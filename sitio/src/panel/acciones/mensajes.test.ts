import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ERROR_SIN_PERMISO } from '../aplicacion/gestionar-mensajes'
import { ESTADO_INICIAL_DE_CONTACTO } from '../aplicacion/guardar-datos-de-contacto'

// Las acciones se prueban por su interfaz pública con la guardia y el adaptador reales: solo
// Next y la Local API de Payload son dobles. Así se comprueba que sin sesión nada llega a
// Payload y que cada escritura viaja con `overrideAccess: false` y el usuario de la sesión.
const dobles = vi.hoisted(() => ({
  auth: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  revalidatePath: vi.fn(),
  redirect: vi.fn((ruta: string) => {
    throw new Error(`REDIRECCION ${ruta}`)
  }),
}))

vi.mock('next/headers', () => ({ headers: async () => new Headers() }))
vi.mock('next/navigation', () => ({ redirect: dobles.redirect }))
vi.mock('next/cache', () => ({ revalidatePath: dobles.revalidatePath }))
vi.mock('@/compartido/infraestructura/instancia-payload', () => ({
  obtenerPayload: async () => ({ auth: dobles.auth, update: dobles.update, delete: dobles.delete }),
}))

const { cambiarEstadoDelMensaje, eliminarElMensaje, guardarContactoDelMensaje } =
  await import('./mensajes')

const PERMISOS = { collections: {} }
const ADMINISTRADOR = { id: 1, rol: 'administrador', email: 'a@jjmm.pe' }
const EDITOR = { id: 2, rol: 'editor', email: 'e@jjmm.pe' }

const conSesion = (usuario: object | null) =>
  dobles.auth.mockResolvedValue({ user: usuario, permissions: PERMISOS })

const formulario = (campos: Record<string, string>) => {
  const datos = new FormData()
  for (const [campo, valor] of Object.entries(campos)) datos.set(campo, valor)
  return datos
}

const ACCIONES_QUE_ESCRIBEN = [
  ['cambiarEstadoDelMensaje', () => cambiarEstadoDelMensaje(5, 'atendido')],
  ['eliminarElMensaje', () => eliminarElMensaje(5)],
  [
    'guardarContactoDelMensaje',
    () =>
      guardarContactoDelMensaje(
        ESTADO_INICIAL_DE_CONTACTO,
        formulario({ id: '5', celular: '951965242', correo: '' }),
      ),
  ],
] as const

beforeEach(() => {
  dobles.auth.mockReset()
  dobles.update.mockReset().mockResolvedValue({ id: 5, nombre: 'Ana' })
  dobles.delete.mockReset().mockResolvedValue({ id: 5, nombre: 'Ana' })
  dobles.revalidatePath.mockReset()
  dobles.redirect.mockClear()
})

describe('acciones de mensajes sin sesión (S4.3)', () => {
  it.each(ACCIONES_QUE_ESCRIBEN)('%s lleva al ingreso y no escribe nada', async (_, accion) => {
    conSesion(null)
    await expect(accion()).rejects.toThrow('REDIRECCION /panel/ingreso')
    expect(dobles.update).not.toHaveBeenCalled()
    expect(dobles.delete).not.toHaveBeenCalled()
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })

  it.each(ACCIONES_QUE_ESCRIBEN)(
    '%s tampoco escribe con una cuenta que no es del equipo',
    async (_, accion) => {
      conSesion({ id: 9, rol: 'otro' })
      await expect(accion()).rejects.toThrow('REDIRECCION /panel/ingreso')
      expect(dobles.update).not.toHaveBeenCalled()
      expect(dobles.delete).not.toHaveBeenCalled()
    },
  )
})

describe('cambiarEstadoDelMensaje', () => {
  it('escribe solo el estado con los permisos de la sesión y revalida el panel', async () => {
    conSesion(EDITOR)
    const resultado = await cambiarEstadoDelMensaje('5', 'atendido')
    expect(resultado.ok).toBe(true)
    expect(dobles.update).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'mensajes-de-contacto',
        id: 5,
        data: { estado: 'atendido' },
        overrideAccess: false,
        user: EDITOR,
      }),
    )
    expect(dobles.revalidatePath).toHaveBeenCalledWith('/panel', 'layout')
  })

  it('un estado que no existe no llega a Payload', async () => {
    conSesion(EDITOR)
    expect((await cambiarEstadoDelMensaje(5, 'borrado')).ok).toBe(false)
    expect(dobles.update).not.toHaveBeenCalled()
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })
})

describe('eliminarElMensaje', () => {
  it('un editor no puede eliminar: no llega a Payload', async () => {
    conSesion(EDITOR)
    expect(await eliminarElMensaje(5)).toEqual({ ok: false, error: ERROR_SIN_PERMISO })
    expect(dobles.delete).not.toHaveBeenCalled()
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })

  it('el administrador elimina con los permisos de la sesión', async () => {
    conSesion(ADMINISTRADOR)
    expect((await eliminarElMensaje(5)).ok).toBe(true)
    expect(dobles.delete).toHaveBeenCalledWith(
      expect.objectContaining({ id: 5, overrideAccess: false, user: ADMINISTRADOR }),
    )
    expect(dobles.revalidatePath).toHaveBeenCalledWith('/panel', 'layout')
  })

  it('si la colección lo rechaza (403), avisa sin permiso en vez de romperse', async () => {
    conSesion(ADMINISTRADOR)
    dobles.delete.mockRejectedValueOnce(Object.assign(new Error('Forbidden'), { status: 403 }))
    expect(await eliminarElMensaje(5)).toEqual({ ok: false, error: ERROR_SIN_PERMISO })
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })
})

describe('guardarContactoDelMensaje', () => {
  it('guarda celular y correo normalizados y revalida', async () => {
    conSesion(EDITOR)
    const estado = await guardarContactoDelMensaje(
      ESTADO_INICIAL_DE_CONTACTO,
      formulario({ id: '5', celular: '951965242', correo: '' }),
    )
    expect(estado.estado).toBe('guardado')
    expect(dobles.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 5,
        data: { celular: '951 965 242', correo: null },
        overrideAccess: false,
        user: EDITOR,
      }),
    )
    expect(dobles.revalidatePath).toHaveBeenCalledWith('/panel', 'layout')
  })

  it('con un teléfono fijo no escribe y devuelve el error del campo', async () => {
    conSesion(EDITOR)
    const estado = await guardarContactoDelMensaje(
      ESTADO_INICIAL_DE_CONTACTO,
      formulario({ id: '5', celular: '014567890', correo: '' }),
    )
    expect(estado.estado).toBe('invalido')
    expect(dobles.update).not.toHaveBeenCalled()
  })
})
