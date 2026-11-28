import { beforeEach, describe, expect, it, vi } from 'vitest'

import { TEXTOS_DE_AREAS } from '../aplicacion/gestionar-areas'
import {
  ADMINISTRADOR,
  conSesion,
  dobles,
  EDITOR,
  nadaSeEscribio,
  reiniciarDobles,
} from './prueba/dobles-de-payload'

// Las acciones de áreas con la guardia y el adaptador reales: solo Next y la Local API de
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

const { guardarElArea, ordenarLasAreas } = await import('./areas')

const GAJO = '72.8,155.8 174.1,78.7 216.5,191.5'
const FORMULARIO = {
  nombre: 'Legal',
  nombreCorto: 'Legal',
  descripcion: 'Abogados y contadores.',
  puntos: ['Asesoría legal', 'Servicios legales'],
  mensaje: '',
  poligono: GAJO,
  // Lo que el panel nunca toma del navegador.
  codigo: 'P9',
  orden: 99,
}

const ACCIONES_QUE_ESCRIBEN = [
  ['ordenarLasAreas', () => ordenarLasAreas([2, 1])],
  ['guardarElArea', () => guardarElArea(1, FORMULARIO)],
] as const

beforeEach(() => {
  reiniciarDobles({
    'areas-de-servicio': [
      { id: 1, nombre: 'Legal', orden: 0 },
      { id: 2, nombre: 'Tributaria', orden: 1 },
    ],
  })
  dobles.update.mockResolvedValue({ id: 1, nombre: 'Legal' })
})

describe('acciones de áreas sin sesión (S4.3)', () => {
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

describe('ordenarLasAreas', () => {
  it('ordena en una transacción con los permisos de la sesión y revalida el panel', async () => {
    conSesion(EDITOR)
    expect(await ordenarLasAreas([2, 1])).toEqual({ ok: true })
    expect(dobles.update).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'areas-de-servicio',
        id: 2,
        data: { orden: 0 },
        overrideAccess: false,
        user: EDITOR,
        req: { transactionID: 'tx-1' },
      }),
    )
    expect(dobles.commitTransaction).toHaveBeenCalledWith('tx-1')
    expect(dobles.revalidatePath).toHaveBeenCalledWith('/panel', 'layout')
  })

  it('una lista que no coincide con la guardada no escribe nada', async () => {
    conSesion(EDITOR)
    expect(await ordenarLasAreas([1, 1])).toEqual({
      ok: false,
      error: TEXTOS_DE_AREAS.listaCambiada,
    })
    expect(await ordenarLasAreas('2,1')).toMatchObject({ ok: false })
    nadaSeEscribio()
  })
})

describe('guardarElArea', () => {
  it('escribe solo los campos del panel: nunca el código ni el orden', async () => {
    conSesion(EDITOR)
    expect(await guardarElArea('1', FORMULARIO)).toMatchObject({ estado: 'guardado' })
    expect(dobles.update).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'areas-de-servicio',
        id: 1,
        data: {
          nombre: 'Legal',
          nombreCorto: 'Legal',
          descripcion: 'Abogados y contadores.',
          puntos: [{ texto: 'Asesoría legal' }, { texto: 'Servicios legales' }],
          mensajeDeConsulta: null,
          poligonoEnLaRueda: GAJO,
        },
        overrideAccess: false,
        user: EDITOR,
      }),
    )
    expect(dobles.revalidatePath).toHaveBeenCalledWith('/panel', 'layout')
  })

  it('un formulario inválido o un id hostil no llegan a Payload', async () => {
    conSesion(ADMINISTRADOR)
    expect((await guardarElArea(1, { ...FORMULARIO, nombre: '' })).estado).toBe('invalido')
    expect((await guardarElArea(1, { ...FORMULARIO, poligono: '1,2' })).estado).toBe('invalido')
    expect((await guardarElArea('1 OR 1=1', FORMULARIO)).estado).toBe('error')
    expect((await guardarElArea(null, FORMULARIO)).estado).toBe('error')
    nadaSeEscribio()
  })
})
