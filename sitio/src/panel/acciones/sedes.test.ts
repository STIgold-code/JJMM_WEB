import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ERROR_DE_ORDEN_DE_SEDES } from '../aplicacion/gestionar-sedes'
import {
  conSesion,
  dobles,
  EDITOR,
  nadaSeEscribio,
  reiniciarDobles,
} from './prueba/dobles-de-payload'

// Las acciones se prueban por su interfaz pública con la guardia y el adaptador reales: solo
// Next y la Local API de Payload son dobles. Así se comprueba que sin sesión nada llega a
// Payload y que cada escritura viaja con `overrideAccess: false` y el usuario de la sesión.
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

const { cambiarVisibilidadDeLaSede, crearLaSede, eliminarLaSede, guardarLaSede, ordenarLasSedes } =
  await import('./sedes')

const COLECCIONES = {
  sedes: [
    { id: 1, nombre: 'Sede San Martín de Porres', orden: 0 },
    { id: 2, nombre: 'Sede San Isidro', orden: 1 },
  ],
}

const FORMULARIO_DE_SEDE = {
  nombre: 'Sede San Isidro',
  direccion: 'Calle Gorriones 151',
  distrito: 'San Isidro',
  ciudad: 'Lima',
  celulares: [
    { clave: 1, numero: '951965242', tieneWhatsApp: true },
    { clave: 2, numero: '952 249 102', tieneWhatsApp: false },
  ],
  correo: '',
  mapa: '',
  visible: true,
}

const ACCIONES_QUE_ESCRIBEN = [
  ['cambiarVisibilidadDeLaSede', () => cambiarVisibilidadDeLaSede(1, false)],
  ['ordenarLasSedes', () => ordenarLasSedes([2, 1])],
  ['eliminarLaSede', () => eliminarLaSede(1)],
  ['guardarLaSede', () => guardarLaSede(2, FORMULARIO_DE_SEDE)],
  ['crearLaSede', () => crearLaSede(FORMULARIO_DE_SEDE)],
] as const

beforeEach(() => {
  reiniciarDobles(COLECCIONES)
  dobles.update.mockResolvedValue({ id: 1, nombre: 'Sede San Martín de Porres' })
})

describe('acciones de sedes sin sesión (S4.3)', () => {
  it.each(ACCIONES_QUE_ESCRIBEN)('%s lleva al ingreso y no escribe nada', async (_, accion) => {
    conSesion(null)
    await expect(accion()).rejects.toThrow('REDIRECCION /panel/ingreso')
    expect(dobles.find).not.toHaveBeenCalled()
    nadaSeEscribio()
  })

  it.each(ACCIONES_QUE_ESCRIBEN)(
    '%s tampoco escribe con una cuenta que no es del equipo',
    async (_, accion) => {
      conSesion({ id: 9, rol: 'otro' })
      await expect(accion()).rejects.toThrow('REDIRECCION /panel/ingreso')
      nadaSeEscribio()
    },
  )
})

describe('cambiarVisibilidadDeLaSede', () => {
  it('escribe solo `activo` con los permisos de la sesión y revalida el panel', async () => {
    conSesion(EDITOR)
    expect(await cambiarVisibilidadDeLaSede('1', false)).toEqual({
      ok: true,
      aviso: {
        titulo: 'La sede San Martín de Porres quedó oculta en el sitio',
        detalle: 'Puedes cambiarlo cuando quieras.',
      },
    })
    expect(dobles.update).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'sedes',
        id: 1,
        data: { activo: false },
        overrideAccess: false,
        user: EDITOR,
      }),
    )
    expect(dobles.revalidatePath).toHaveBeenCalledWith('/panel', 'layout')
  })

  it('un valor que no es sí o no, o un id inválido, no llega a Payload', async () => {
    conSesion(EDITOR)
    expect((await cambiarVisibilidadDeLaSede(1, 'false')).ok).toBe(false)
    expect((await cambiarVisibilidadDeLaSede('1; DROP', true)).ok).toBe(false)
    nadaSeEscribio()
  })
})

describe('ordenarLasSedes', () => {
  it('escribe el orden nuevo en una transacción y la confirma', async () => {
    conSesion(EDITOR)
    expect(await ordenarLasSedes([2, 1])).toEqual({ ok: true })
    expect(dobles.update).toHaveBeenCalledTimes(2)
    expect(dobles.update).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'sedes',
        id: 2,
        data: { orden: 0 },
        overrideAccess: false,
        user: EDITOR,
        req: expect.objectContaining({ transactionID: 'tx-1' }),
      }),
    )
    expect(dobles.commitTransaction).toHaveBeenCalledWith('tx-1')
    expect(dobles.revalidatePath).toHaveBeenCalledWith('/panel', 'layout')
  })

  it('una lista que no coincide con las sedes guardadas no escribe nada', async () => {
    conSesion(EDITOR)
    expect(await ordenarLasSedes([2, 1, 3])).toEqual({ ok: false, error: ERROR_DE_ORDEN_DE_SEDES })
    nadaSeEscribio()
  })
})
