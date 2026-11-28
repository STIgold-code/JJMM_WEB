import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ERROR_DE_DATOS_DEL_VENCIMIENTO } from '../aplicacion/gestionar-vencimientos'
import { ERROR_SIN_PERMISO } from '../aplicacion/gestionar-mensajes'
import {
  ADMINISTRADOR,
  conSesion,
  dobles,
  EDITOR,
  nadaSeEscribio,
  reiniciarDobles,
} from './prueba/dobles-de-payload'

// Las acciones de vencimientos con la guardia y el adaptador reales: solo Next y la Local API
// de Payload son dobles (S4.3).
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

const { eliminarElVencimiento, guardarElVencimiento } = await import('./vencimientos')

const FORMULARIO = {
  obligacion: 'CONAFOVICER',
  periodicidad: 'mensual',
  cuandoVence: 'Consulta la fecha con el estudio.',
  nota: '',
}

const ACCIONES_QUE_ESCRIBEN = [
  ['guardarElVencimiento (editar)', () => guardarElVencimiento(1, FORMULARIO)],
  ['guardarElVencimiento (crear)', () => guardarElVencimiento(null, FORMULARIO)],
  ['eliminarElVencimiento', () => eliminarElVencimiento(1)],
] as const

beforeEach(() => {
  reiniciarDobles({
    vencimientos: [
      { id: 1, obligacion: 'PLAME', orden: 0 },
      { id: 2, obligacion: 'DAOT', orden: 6 },
    ],
  })
  dobles.update.mockResolvedValue({ id: 1, obligacion: 'CONAFOVICER' })
  dobles.create.mockResolvedValue({ id: 9, obligacion: 'CONAFOVICER' })
  dobles.delete.mockResolvedValue({ id: 1, obligacion: 'PLAME' })
})

describe('acciones de vencimientos sin sesión (S4.3)', () => {
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

describe('guardarElVencimiento', () => {
  it('al editar escribe solo los campos del panel, con los permisos de la sesión', async () => {
    conSesion(EDITOR)
    expect(await guardarElVencimiento('1', FORMULARIO)).toMatchObject({ estado: 'guardado' })
    expect(dobles.update).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'vencimientos',
        id: 1,
        data: {
          obligacion: 'CONAFOVICER',
          periodicidad: 'mensual',
          cuandoVence: 'Consulta la fecha con el estudio.',
          nota: null,
        },
        overrideAccess: false,
        user: EDITOR,
      }),
    )
    expect(dobles.revalidatePath).toHaveBeenCalledWith('/panel', 'layout')
  })

  it('al crear, el vencimiento va al final de la lista', async () => {
    conSesion(EDITOR)
    expect(await guardarElVencimiento(null, FORMULARIO)).toMatchObject({ estado: 'guardado' })
    expect(dobles.create).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'vencimientos',
        data: expect.objectContaining({ orden: 7 }),
        user: EDITOR,
      }),
    )
  })

  it('una periodicidad que no existe o un id hostil no llegan a Payload', async () => {
    conSesion(EDITOR)
    expect((await guardarElVencimiento(1, { ...FORMULARIO, periodicidad: 'semanal' })).estado).toBe(
      'invalido',
    )
    expect((await guardarElVencimiento('-1', FORMULARIO)).estado).toBe('error')
    nadaSeEscribio()
  })
})

describe('eliminarElVencimiento', () => {
  it('un editor no puede eliminar: no llega a Payload', async () => {
    conSesion(EDITOR)
    expect(await eliminarElVencimiento(1)).toEqual({ ok: false, error: ERROR_SIN_PERMISO })
    nadaSeEscribio()
  })

  it('el administrador elimina con los permisos de la sesión', async () => {
    conSesion(ADMINISTRADOR)
    expect(await eliminarElVencimiento(1)).toEqual({
      ok: true,
      aviso: { titulo: 'Vencimiento eliminado', detalle: 'Se borró PLAME.' },
    })
    expect(dobles.delete).toHaveBeenCalledWith(
      expect.objectContaining({ collection: 'vencimientos', id: 1, user: ADMINISTRADOR }),
    )
  })
})

describe('errores de Payload', () => {
  it('un 400 vuelve tipado junto a su campo, sin lanzar ni revalidar', async () => {
    conSesion(ADMINISTRADOR)
    dobles.update.mockRejectedValueOnce({
      status: 400,
      data: { errors: [{ path: 'cuandoVence' }] },
    })
    expect(await guardarElVencimiento(1, FORMULARIO)).toEqual({
      estado: 'invalido',
      errores: { cuandoVence: 'Revisa cuándo vence.' },
    })
    dobles.delete.mockRejectedValueOnce({ status: 400 })
    expect(await eliminarElVencimiento(1)).toEqual({
      ok: false,
      error: ERROR_DE_DATOS_DEL_VENCIMIENTO,
    })
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })

  it('cualquier otro error se propaga', async () => {
    conSesion(ADMINISTRADOR)
    dobles.create.mockRejectedValueOnce(new Error('sin conexión'))
    await expect(guardarElVencimiento(null, FORMULARIO)).rejects.toThrow('sin conexión')
    dobles.delete.mockRejectedValueOnce(new Error('sin conexión'))
    await expect(eliminarElVencimiento(1)).rejects.toThrow('sin conexión')
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })
})
