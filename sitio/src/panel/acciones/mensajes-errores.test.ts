import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ERROR_DE_DATOS_GUARDADOS } from '../aplicacion/gestionar-mensajes'
import { ESTADO_INICIAL_DE_CONTACTO } from '../aplicacion/guardar-datos-de-contacto'
import { ERROR_DE_CORREO } from '../dominio/respuesta-al-mensaje'

// Errores de Payload al escribir, con la guardia y el adaptador reales (solo Next y la Local
// API son dobles): un 400 (datos rechazados por la colección) vuelve como resultado tipado y
// nunca rompe la pantalla; cualquier otro error se propaga tal cual.
const dobles = vi.hoisted(() => ({
  auth: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  revalidatePath: vi.fn(),
}))

vi.mock('next/headers', () => ({ headers: async () => new Headers() }))
vi.mock('next/navigation', () => ({
  redirect: (ruta: string) => {
    throw new Error(`REDIRECCION ${ruta}`)
  },
}))
vi.mock('next/cache', () => ({ revalidatePath: dobles.revalidatePath }))
vi.mock('@/compartido/infraestructura/instancia-payload', () => ({
  obtenerPayload: async () => ({ auth: dobles.auth, update: dobles.update, delete: dobles.delete }),
}))

const { cambiarEstadoDelMensaje, eliminarElMensaje, guardarContactoDelMensaje } =
  await import('./mensajes')

const conSesion = (rol: string) =>
  dobles.auth.mockResolvedValue({
    user: { id: 1, rol, email: 'a@jjmm.pe' },
    permissions: { collections: {} },
  })

const rechazoDeValidacion = () =>
  Object.assign(new Error('El siguiente campo no es válido: correo'), {
    status: 400,
    data: { errors: [{ path: 'correo', message: 'No es válido' }] },
  })

beforeEach(() => {
  dobles.auth.mockReset()
  dobles.update.mockReset()
  dobles.delete.mockReset()
  dobles.revalidatePath.mockReset()
})

describe('cuando Payload rechaza los datos (400)', () => {
  it('guardarContactoDelMensaje devuelve el error del campo, sin lanzar ni revalidar', async () => {
    conSesion('editor')
    dobles.update.mockRejectedValueOnce(rechazoDeValidacion())
    const datos = new FormData()
    datos.set('id', '5')
    datos.set('correo', 'ana@correo.pe')
    const estado = await guardarContactoDelMensaje(ESTADO_INICIAL_DE_CONTACTO, datos)
    expect(estado).toEqual({ estado: 'invalido', errores: { correo: ERROR_DE_CORREO } })
    expect(dobles.update).toHaveBeenCalledTimes(1)
    expect(dobles.delete).not.toHaveBeenCalled()
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })

  it('cambiarEstadoDelMensaje devuelve un aviso claro, sin lanzar ni revalidar', async () => {
    conSesion('editor')
    dobles.update.mockRejectedValueOnce({ status: 400 })
    expect(await cambiarEstadoDelMensaje(5, 'atendido')).toEqual({
      ok: false,
      error: ERROR_DE_DATOS_GUARDADOS,
    })
    expect(dobles.update).toHaveBeenCalledTimes(1)
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })
})

describe('cualquier otro error de Payload', () => {
  it('se propaga (por ejemplo, la base caída): nunca se muestra como un dato inválido', async () => {
    conSesion('administrador')
    const caida = Object.assign(new Error('conexión rechazada'), { status: 500 })
    dobles.update.mockRejectedValueOnce(caida)
    await expect(cambiarEstadoDelMensaje(5, 'nuevo')).rejects.toBe(caida)
    dobles.delete.mockRejectedValueOnce(new Error('sin conexión'))
    await expect(eliminarElMensaje(5)).rejects.toThrow('sin conexión')
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })
})
