import { beforeEach, describe, expect, it, vi } from 'vitest'

import { TEXTOS_DE_CLIENTES } from '../aplicacion/gestionar-clientes'
import { ERROR_SIN_PERMISO } from '../aplicacion/gestionar-mensajes'
import { ERROR_DE_LOGO } from '../dominio/validacion-de-cliente'
import {
  ADMINISTRADOR,
  conSesion,
  dobles,
  EDITOR,
  nadaSeEscribio,
  reiniciarDobles,
} from './prueba/dobles-de-payload'

// Eliminar clientes y los errores de Payload, con la guardia y el adaptador reales (solo Next y la
// Local API son dobles): un 400 vuelve tipado y nunca rompe la pantalla; cualquier otro error se
// propaga tal cual.
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

const { cambiarVisibilidadDelCliente, eliminarElCliente, guardarElCliente } =
  await import('./clientes')

const FORMULARIO = { nombre: 'Cadex', enlace: 'https://cadex.pe', logo: 7, visible: true }

const rechazo400 = (...paths: string[]) => ({
  status: 400,
  data: { errors: paths.map((path) => ({ path })) },
})

beforeEach(() => {
  reiniciarDobles({ clientes: [{ id: 1, nombre: 'Cadex', orden: 0 }] })
  dobles.delete.mockResolvedValue({ id: 1, nombre: 'Cadex' })
})

describe('eliminarElCliente', () => {
  it('un editor no puede eliminar: no llega a Payload', async () => {
    conSesion(EDITOR)
    expect(await eliminarElCliente(1)).toEqual({ ok: false, error: ERROR_SIN_PERMISO })
    nadaSeEscribio()
  })

  it('el administrador elimina con los permisos de la sesión y revalida', async () => {
    conSesion(ADMINISTRADOR)
    expect(await eliminarElCliente(1)).toEqual({
      ok: true,
      aviso: {
        titulo: 'Cliente eliminado',
        detalle: 'Se borró Cadex. Su logotipo sigue en Imágenes.',
      },
    })
    expect(dobles.delete).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'clientes',
        id: 1,
        overrideAccess: false,
        user: ADMINISTRADOR,
      }),
    )
    expect(dobles.revalidatePath).toHaveBeenCalledWith('/panel', 'layout')
  })

  it('un id inválido no llega a Payload', async () => {
    conSesion(ADMINISTRADOR)
    expect((await eliminarElCliente({ id: 1 })).ok).toBe(false)
    nadaSeEscribio()
  })
})

describe('errores de Payload en los clientes', () => {
  it('un 400 vuelve tipado junto a su campo, sin lanzar ni revalidar', async () => {
    conSesion(EDITOR)
    dobles.update.mockRejectedValueOnce(rechazo400('logo'))
    expect(await guardarElCliente(1, FORMULARIO)).toEqual({
      estado: 'invalido',
      errores: { logo: ERROR_DE_LOGO },
    })
    dobles.update.mockRejectedValueOnce({ status: 400 })
    expect(await cambiarVisibilidadDelCliente(1, true)).toEqual({
      ok: false,
      error: TEXTOS_DE_CLIENTES.invalido,
    })
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })

  it('cualquier otro error se propaga: nunca se muestra como un dato inválido', async () => {
    conSesion(ADMINISTRADOR)
    const caida = Object.assign(new Error('conexión rechazada'), { status: 500 })
    dobles.create.mockRejectedValueOnce(caida)
    await expect(guardarElCliente(null, FORMULARIO)).rejects.toBe(caida)
    dobles.delete.mockRejectedValueOnce(new Error('sin conexión'))
    await expect(eliminarElCliente(1)).rejects.toThrow('sin conexión')
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })
})
