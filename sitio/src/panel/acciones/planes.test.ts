import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ERROR_DE_ORDEN } from '../aplicacion/gestionar-planes'
import { ESTADO_INICIAL_DE_CREACION } from '../aplicacion/guardar-plan'
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

const { cambiarVisibilidadDelPlan, crearElPlan, eliminarElPlan, guardarElPlan, ordenarLosPlanes } =
  await import('./planes')

const COLECCIONES = {
  planes: [
    { id: 1, nombre: 'Emprende', orden: 0 },
    { id: 2, nombre: 'SIGEMype I', orden: 1 },
  ],
  'caracteristicas-de-plan': [{ id: 10 }],
}

const conNombre = (nombre: string) => {
  const datos = new FormData()
  datos.set('nombre', nombre)
  return datos
}

const FORMULARIO = {
  nombre: 'SIGEMype II',
  mensajeDeConsulta: '',
  visible: true,
  celdas: [{ caracteristica: 10, tipo: 'incluido', texto: '' }],
}

const ACCIONES_QUE_ESCRIBEN = [
  ['cambiarVisibilidadDelPlan', () => cambiarVisibilidadDelPlan(1, false)],
  ['ordenarLosPlanes', () => ordenarLosPlanes([2, 1])],
  ['eliminarElPlan', () => eliminarElPlan(1)],
  ['guardarElPlan', () => guardarElPlan(1, FORMULARIO)],
  ['crearElPlan', () => crearElPlan(ESTADO_INICIAL_DE_CREACION, conNombre('SIGEMype III'))],
] as const

beforeEach(() => {
  reiniciarDobles(COLECCIONES)
  dobles.update.mockResolvedValue({ id: 1, nombre: 'Emprende' })
})

describe('acciones de planes sin sesión (S4.3)', () => {
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

describe('cambiarVisibilidadDelPlan', () => {
  it('escribe solo `activo` con los permisos de la sesión y revalida el panel', async () => {
    conSesion(EDITOR)
    expect(await cambiarVisibilidadDelPlan('1', false)).toEqual({
      ok: true,
      aviso: {
        titulo: 'El plan Emprende quedó oculto en el sitio',
        detalle: 'Puedes cambiarlo cuando quieras.',
      },
    })
    expect(dobles.update).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'planes',
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
    expect((await cambiarVisibilidadDelPlan(1, 'false')).ok).toBe(false)
    expect((await cambiarVisibilidadDelPlan('x', true)).ok).toBe(false)
    nadaSeEscribio()
  })
})

describe('ordenarLosPlanes', () => {
  it('escribe el orden nuevo en una transacción y la confirma', async () => {
    conSesion(EDITOR)
    expect(await ordenarLosPlanes([2, 1])).toEqual({ ok: true })
    expect(dobles.update).toHaveBeenCalledTimes(2)
    expect(dobles.update).toHaveBeenCalledWith(
      expect.objectContaining({
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

  it('una lista que no coincide con los planes guardados no escribe nada', async () => {
    conSesion(EDITOR)
    expect(await ordenarLosPlanes([2, 1, 3])).toEqual({ ok: false, error: ERROR_DE_ORDEN })
    nadaSeEscribio()
  })

  it('sin cambios de orden no escribe nada', async () => {
    conSesion(EDITOR)
    expect(await ordenarLosPlanes([1, 2])).toEqual({ ok: true })
    expect(dobles.update).not.toHaveBeenCalled()
    expect(dobles.beginTransaction).not.toHaveBeenCalled()
  })
})
