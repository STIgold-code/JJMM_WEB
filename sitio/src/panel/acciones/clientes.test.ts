import { beforeEach, describe, expect, it, vi } from 'vitest'

import { TEXTOS_DE_CLIENTES } from '../aplicacion/gestionar-clientes'
import { ERROR_DE_ENLACE, ERROR_DE_LOGO } from '../dominio/validacion-de-cliente'
import {
  conSesion,
  dobles,
  EDITOR,
  nadaSeEscribio,
  reiniciarDobles,
} from './prueba/dobles-de-payload'

// Las acciones de clientes con la guardia y el adaptador reales: solo Next y la Local API de
// Payload son dobles (S4.3).
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

const { cambiarVisibilidadDelCliente, eliminarElCliente, guardarElCliente, ordenarLosClientes } =
  await import('./clientes')

const FORMULARIO = { nombre: 'Cadex', enlace: 'https://cadex.pe', logo: 7, visible: true }

const ACCIONES_QUE_ESCRIBEN = [
  ['cambiarVisibilidadDelCliente', () => cambiarVisibilidadDelCliente(1, false)],
  ['ordenarLosClientes', () => ordenarLosClientes([2, 1])],
  ['guardarElCliente (editar)', () => guardarElCliente(1, FORMULARIO)],
  ['guardarElCliente (crear)', () => guardarElCliente(null, FORMULARIO)],
  ['eliminarElCliente', () => eliminarElCliente(1)],
] as const

beforeEach(() => {
  reiniciarDobles({
    clientes: [
      { id: 1, nombre: 'Cadex', orden: 0 },
      { id: 2, nombre: 'Insutec', orden: 1 },
    ],
  })
  dobles.update.mockResolvedValue({ id: 1, nombre: 'Cadex', activo: true })
  dobles.create.mockResolvedValue({ id: 9, nombre: 'Cadex' })
  dobles.delete.mockResolvedValue({ id: 1, nombre: 'Cadex' })
})

describe('acciones de clientes sin sesión (S4.3)', () => {
  it.each(ACCIONES_QUE_ESCRIBEN)('%s lleva al ingreso y no escribe nada', async (_, accion) => {
    conSesion(null)
    await expect(accion()).rejects.toThrow('REDIRECCION /panel/ingreso')
    expect(dobles.find).not.toHaveBeenCalled()
    nadaSeEscribio()
  })

  it.each(ACCIONES_QUE_ESCRIBEN)(
    '%s tampoco escribe con una cuenta ajena al equipo',
    async (_, accion) => {
      conSesion({ id: 9, rol: 'otro' })
      await expect(accion()).rejects.toThrow('REDIRECCION /panel/ingreso')
      nadaSeEscribio()
    },
  )
})

describe('interruptor y orden', () => {
  it('escribe solo `activo` con los permisos de la sesión y revalida el panel', async () => {
    conSesion(EDITOR)
    expect(await cambiarVisibilidadDelCliente('1', false)).toMatchObject({ ok: true })
    expect(dobles.update).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'clientes',
        id: 1,
        data: { activo: false },
        overrideAccess: false,
        user: EDITOR,
      }),
    )
    expect(dobles.revalidatePath).toHaveBeenCalledWith('/panel', 'layout')
  })

  it('un valor que no es sí o no, o una lista que no coincide, no llegan a Payload', async () => {
    conSesion(EDITOR)
    expect((await cambiarVisibilidadDelCliente(1, 'true')).ok).toBe(false)
    expect(await ordenarLosClientes([2])).toEqual({
      ok: false,
      error: TEXTOS_DE_CLIENTES.listaCambiada,
    })
    nadaSeEscribio()
  })
})

describe('guardarElCliente', () => {
  it('al editar escribe solo los campos del panel, con el logotipo como id', async () => {
    conSesion(EDITOR)
    expect(await guardarElCliente('1', { ...FORMULARIO, orden: 0 })).toMatchObject({
      estado: 'guardado',
    })
    expect(dobles.update).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'clientes',
        id: 1,
        data: { nombre: 'Cadex', logo: 7, enlace: 'https://cadex.pe', activo: true },
        overrideAccess: false,
        user: EDITOR,
      }),
    )
  })

  it('al crear va al final del carrusel, con la visibilidad elegida', async () => {
    conSesion(EDITOR)
    await guardarElCliente(null, { ...FORMULARIO, visible: false })
    expect(dobles.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { nombre: 'Cadex', logo: 7, enlace: 'https://cadex.pe', activo: false, orden: 2 },
        user: EDITOR,
      }),
    )
  })

  it('sin logotipo, con un enlace http o un id hostil, no llega a Payload', async () => {
    conSesion(EDITOR)
    expect(await guardarElCliente(1, { ...FORMULARIO, logo: null, enlace: 'http://x.pe' })).toEqual(
      { estado: 'invalido', errores: { logo: ERROR_DE_LOGO, enlace: ERROR_DE_ENLACE } },
    )
    expect((await guardarElCliente('1;DROP', FORMULARIO)).estado).toBe('error')
    nadaSeEscribio()
  })
})
