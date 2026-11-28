import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ERROR_DE_ORDEN_DE_AVISOS } from '../aplicacion/gestionar-avisos'
import {
  conSesion,
  dobles,
  EDITOR,
  nadaSeEscribio,
  reiniciarDobles,
} from './prueba/dobles-de-payload'

// Las acciones de avisos con la guardia y el adaptador reales: solo Next y la Local API de
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

const { cambiarVisibilidadDelAviso, eliminarElAviso, guardarElAviso, ordenarLosAvisos } =
  await import('./avisos')

const FORMULARIO = {
  titulo: 'Cierre de planilla',
  cuandoAplica: 'Inicia el 20 de cada mes.',
  documentos: 'Permisos\nVacaciones',
  correo: 'recursoshumanos@jjmm.com.pe',
}

const ACCIONES_QUE_ESCRIBEN = [
  ['cambiarVisibilidadDelAviso', () => cambiarVisibilidadDelAviso(1, false)],
  ['ordenarLosAvisos', () => ordenarLosAvisos([2, 1])],
  ['eliminarElAviso', () => eliminarElAviso(1)],
  ['guardarElAviso (editar)', () => guardarElAviso(1, FORMULARIO)],
  ['guardarElAviso (crear)', () => guardarElAviso(null, FORMULARIO)],
] as const

beforeEach(() => {
  reiniciarDobles({
    'avisos-para-clientes': [
      { id: 1, titulo: 'Cierre tributario', orden: 0 },
      { id: 2, titulo: 'Cierre de planilla', orden: 3 },
    ],
  })
  dobles.update.mockResolvedValue({ id: 1, titulo: 'Cierre tributario', activo: true })
  dobles.create.mockResolvedValue({ id: 9, titulo: 'Cierre de planilla' })
  dobles.delete.mockResolvedValue({ id: 1, titulo: 'Cierre tributario' })
})

describe('acciones de avisos sin sesión (S4.3)', () => {
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

describe('cambiarVisibilidadDelAviso y ordenarLosAvisos', () => {
  it('escribe solo `activo` con los permisos de la sesión y revalida el panel', async () => {
    conSesion(EDITOR)
    expect(await cambiarVisibilidadDelAviso('1', false)).toMatchObject({ ok: true })
    expect(dobles.update).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'avisos-para-clientes',
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
    expect((await cambiarVisibilidadDelAviso(1, 'false')).ok).toBe(false)
    expect((await cambiarVisibilidadDelAviso('1 OR 1=1', true)).ok).toBe(false)
    nadaSeEscribio()
  })

  it('ordena en una transacción; una lista que no coincide no escribe nada', async () => {
    conSesion(EDITOR)
    expect(await ordenarLosAvisos([2, 1])).toEqual({ ok: true })
    expect(dobles.update).toHaveBeenCalledWith(
      expect.objectContaining({ id: 2, data: { orden: 0 }, req: { transactionID: 'tx-1' } }),
    )
    expect(dobles.commitTransaction).toHaveBeenCalledWith('tx-1')
    reiniciarDobles({ 'avisos-para-clientes': [{ id: 1, orden: 0 }] })
    conSesion(EDITOR)
    expect(await ordenarLosAvisos([1, 1])).toEqual({ ok: false, error: ERROR_DE_ORDEN_DE_AVISOS })
    nadaSeEscribio()
  })
})

describe('guardarElAviso', () => {
  it('al editar escribe solo los campos del panel, con los documentos como filas', async () => {
    conSesion(EDITOR)
    expect(await guardarElAviso('1', FORMULARIO)).toMatchObject({ estado: 'guardado' })
    expect(dobles.update).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'avisos-para-clientes',
        id: 1,
        data: {
          titulo: 'Cierre de planilla',
          cuandoAplica: 'Inicia el 20 de cada mes.',
          documentos: [{ texto: 'Permisos' }, { texto: 'Vacaciones' }],
          correoDeContacto: 'recursoshumanos@jjmm.com.pe',
        },
        overrideAccess: false,
        user: EDITOR,
      }),
    )
    expect(dobles.revalidatePath).toHaveBeenCalledWith('/panel', 'layout')
  })

  it('al crear, el aviso queda oculto y al final de la lista', async () => {
    conSesion(EDITOR)
    expect(await guardarElAviso(null, FORMULARIO)).toMatchObject({ estado: 'guardado' })
    expect(dobles.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ orden: 4, activo: false }),
        overrideAccess: false,
        user: EDITOR,
      }),
    )
  })

  it('un formulario inválido o un id hostil no llegan a Payload', async () => {
    conSesion(EDITOR)
    expect((await guardarElAviso(1, { ...FORMULARIO, titulo: '' })).estado).toBe('invalido')
    expect((await guardarElAviso({ id: 1 }, FORMULARIO)).estado).toBe('error')
    expect((await guardarElAviso(undefined, FORMULARIO)).estado).toBe('error')
    nadaSeEscribio()
  })
})
