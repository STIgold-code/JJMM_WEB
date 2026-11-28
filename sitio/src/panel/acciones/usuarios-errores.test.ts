import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ERROR_SIN_PERMISO } from '../aplicacion/gestionar-mensajes'
import { ERROR_DE_DATOS_DE_LA_CUENTA } from '../aplicacion/gestionar-usuarios'
import { ERROR_DE_CORREO_REPETIDO } from '../aplicacion/guardar-usuario'
import {
  ADMINISTRADOR,
  conSesion,
  dobles,
  EDITOR,
  reiniciarDobles,
} from './prueba/dobles-de-payload'

// Errores de Payload en las acciones de «Usuarios», con la guardia y el adaptador reales: un 400
// vuelve tipado (junto a su campo si se sabe cuál) y nunca rompe la pantalla; un 403 es «sin
// permiso»; cualquier otro error se propaga.
vi.mock('next/headers', () => ({ headers: async () => new Headers() }))
vi.mock('next/navigation', async () => ({
  redirect: (await import('./prueba/dobles-de-payload')).redireccionDePrueba,
}))
vi.mock('next/cache', async () => ({
  revalidatePath: (await import('./prueba/dobles-de-payload')).dobles.revalidatePath,
}))
vi.mock('@/compartido/infraestructura/instancia-payload', async () => {
  const { payloadDoble } = await import('./prueba/dobles-de-payload')
  return { obtenerPayload: async () => payloadDoble }
})

const { crearElUsuario, eliminarElUsuario, guardarElUsuario } = await import('./usuarios')

const NUEVA = { nombre: 'Asistente', correo: 'a2@jjmm.pe', rol: 'editor', clave: 'clave muy larga' }
const FORMULARIO = { nombre: 'Editora', correo: 'a@jjmm.pe', rol: 'editor', clave: '' }

const rechazo400 = (...paths: string[]) => ({
  status: 400,
  data: { errors: paths.map((path) => ({ path })) },
})

beforeEach(() => {
  reiniciarDobles({ usuarios: [ADMINISTRADOR, EDITOR] })
  conSesion(ADMINISTRADOR)
})

describe('cuando Payload rechaza los datos (400)', () => {
  it('un correo que ya usa otra cuenta vuelve como error del campo, al crear y al editar', async () => {
    dobles.create.mockRejectedValueOnce(rechazo400('email'))
    const esperado = { estado: 'invalido', errores: { correo: ERROR_DE_CORREO_REPETIDO } }
    expect(await crearElUsuario(NUEVA)).toEqual(esperado)
    dobles.update.mockRejectedValueOnce(rechazo400('email'))
    expect(await guardarElUsuario(2, FORMULARIO)).toEqual(esperado)
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })

  it('un campo que el panel no conoce queda como aviso general', async () => {
    dobles.create.mockRejectedValueOnce(rechazo400('otroCampo'))
    expect(await crearElUsuario(NUEVA)).toEqual({
      estado: 'error',
      error: ERROR_DE_DATOS_DE_LA_CUENTA,
    })
  })

  it('un 403 de la colección es «sin permiso», sin lanzar', async () => {
    dobles.delete.mockRejectedValueOnce({ status: 403 })
    expect(await eliminarElUsuario(2)).toEqual({ ok: false, error: ERROR_SIN_PERMISO })
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })
})

describe('cualquier otro error de Payload', () => {
  it('se propaga (por ejemplo, la base caída): nunca se muestra como un dato inválido', async () => {
    dobles.create.mockRejectedValueOnce(new Error('sin conexión'))
    await expect(crearElUsuario(NUEVA)).rejects.toThrow('sin conexión')
    dobles.update.mockRejectedValueOnce(Object.assign(new Error('caída'), { status: 500 }))
    await expect(guardarElUsuario(2, FORMULARIO)).rejects.toThrow('caída')
    dobles.delete.mockRejectedValueOnce(new Error('sin conexión'))
    await expect(eliminarElUsuario(2)).rejects.toThrow('sin conexión')
    dobles.find.mockRejectedValueOnce(new Error('lectura caída'))
    await expect(eliminarElUsuario(2)).rejects.toThrow('lectura caída')
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })
})
