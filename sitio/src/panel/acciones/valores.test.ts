import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ERROR_SIN_PERMISO } from '../aplicacion/gestionar-mensajes'
import { TEXTOS_DE_VALORES } from '../aplicacion/gestionar-valores'
import {
  ADMINISTRADOR,
  conSesion,
  dobles,
  EDITOR,
  nadaSeEscribio,
  reiniciarDobles,
} from './prueba/dobles-de-payload'

// Las acciones de valores con la guardia y el adaptador reales: solo Next y la Local API de
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

const { eliminarElValor, guardarElValor, ordenarLosValores } = await import('./valores')

const FORMULARIO = { nombre: ' Excelencia ', icono: 'pulgar', orden: 0 }

const ACCIONES_QUE_ESCRIBEN = [
  ['ordenarLosValores', () => ordenarLosValores([2, 1])],
  ['guardarElValor (editar)', () => guardarElValor(1, FORMULARIO)],
  ['guardarElValor (crear)', () => guardarElValor(null, FORMULARIO)],
  ['eliminarElValor', () => eliminarElValor(1)],
] as const

const rechazo400 = (...paths: string[]) => ({
  status: 400,
  data: { errors: paths.map((path) => ({ path })) },
})

beforeEach(() => {
  reiniciarDobles({
    valores: [
      { id: 1, nombre: 'Excelencia', orden: 0 },
      { id: 2, nombre: 'Compromiso', orden: 4 },
    ],
  })
  dobles.update.mockResolvedValue({ id: 1, nombre: 'Excelencia' })
  dobles.create.mockResolvedValue({ id: 9, nombre: 'Excelencia' })
  dobles.delete.mockResolvedValue({ id: 1, nombre: 'Excelencia' })
})

describe('acciones de valores sin sesión (S4.3)', () => {
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

describe('guardarElValor y ordenarLosValores', () => {
  it('al editar escribe solo nombre e ícono, con los permisos de la sesión', async () => {
    conSesion(EDITOR)
    expect(await guardarElValor('1', FORMULARIO)).toMatchObject({ estado: 'guardado' })
    expect(dobles.update).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'valores',
        id: 1,
        data: { nombre: 'Excelencia', icono: 'pulgar' },
        overrideAccess: false,
        user: EDITOR,
      }),
    )
    expect(dobles.revalidatePath).toHaveBeenCalledWith('/panel', 'layout')
  })

  it('al crear, el valor va al final de la sección', async () => {
    conSesion(EDITOR)
    expect(await guardarElValor(null, FORMULARIO)).toMatchObject({ estado: 'guardado' })
    expect(dobles.create).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'valores',
        data: { nombre: 'Excelencia', icono: 'pulgar', orden: 5 },
        user: EDITOR,
      }),
    )
  })

  it('un ícono fuera de la lista o un id hostil no llegan a Payload', async () => {
    conSesion(EDITOR)
    expect((await guardarElValor(1, { ...FORMULARIO, icono: 'cohete' })).estado).toBe('invalido')
    expect((await guardarElValor({ id: 1 }, FORMULARIO)).estado).toBe('error')
    expect(await ordenarLosValores([1])).toEqual({
      ok: false,
      error: TEXTOS_DE_VALORES.listaCambiada,
    })
    nadaSeEscribio()
  })

  it('ordena en una transacción', async () => {
    conSesion(EDITOR)
    expect(await ordenarLosValores([2, 1])).toEqual({ ok: true })
    expect(dobles.update).toHaveBeenCalledWith(
      expect.objectContaining({ collection: 'valores', id: 2, data: { orden: 0 } }),
    )
    expect(dobles.commitTransaction).toHaveBeenCalledWith('tx-1')
  })
})

describe('eliminarElValor', () => {
  it('un editor no puede eliminar: no llega a Payload', async () => {
    conSesion(EDITOR)
    expect(await eliminarElValor(1)).toEqual({ ok: false, error: ERROR_SIN_PERMISO })
    nadaSeEscribio()
  })

  it('el administrador elimina con los permisos de la sesión y revalida', async () => {
    conSesion(ADMINISTRADOR)
    expect(await eliminarElValor('1')).toEqual({
      ok: true,
      aviso: { titulo: 'Valor eliminado', detalle: 'Se borró «Excelencia».' },
    })
    const permisos = { overrideAccess: false, user: ADMINISTRADOR }
    expect(dobles.delete).toHaveBeenCalledWith(expect.objectContaining({ id: 1, ...permisos }))
    expect(dobles.revalidatePath).toHaveBeenCalledWith('/panel', 'layout')
  })
})

describe('errores de Payload', () => {
  it('un 400 vuelve tipado junto a su campo, sin lanzar ni revalidar', async () => {
    conSesion(EDITOR)
    dobles.update.mockRejectedValueOnce(rechazo400('icono'))
    expect(await guardarElValor(1, FORMULARIO)).toEqual({
      estado: 'invalido',
      errores: { icono: 'Elige un ícono.' },
    })
    dobles.create.mockRejectedValueOnce(rechazo400())
    const error = { estado: 'error', error: TEXTOS_DE_VALORES.invalido }
    expect(await guardarElValor(null, FORMULARIO)).toEqual(error)
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })

  it('cualquier otro error se propaga: nunca se muestra como un dato inválido', async () => {
    conSesion(ADMINISTRADOR)
    const caida = Object.assign(new Error('conexión rechazada'), { status: 500 })
    dobles.update.mockRejectedValueOnce(caida)
    await expect(guardarElValor(1, FORMULARIO)).rejects.toBe(caida)
    dobles.delete.mockRejectedValueOnce(new Error('sin conexión'))
    await expect(eliminarElValor(1)).rejects.toThrow('sin conexión')
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })
})
