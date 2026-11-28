import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ERROR_DE_PERIODO_REPETIDO } from '../aplicacion/gestionar-cronogramas'
import { ERROR_SIN_PERMISO } from '../aplicacion/gestionar-mensajes'
import { ERROR_DE_FECHA } from '../dominio/validacion-de-cronograma'
import {
  ADMINISTRADOR,
  conSesion,
  dobles,
  EDITOR,
  nadaSeEscribio,
  reiniciarDobles,
} from './prueba/dobles-de-payload'

// Las acciones de cronogramas de SUNAT con la guardia y el adaptador reales: solo Next y la
// Local API de Payload son dobles (S4.3).
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

const { eliminarElCronograma, guardarElCronograma } = await import('./cronogramas')

const FECHAS = Array.from({ length: 10 }, (_, d) => `2026-02-${String(13 + d).padStart(2, '0')}`)
const FORMULARIO = { anio: '2026', mes: '1', fechas: FECHAS, buenosContribuyentes: '2026-02-26' }

const ACCIONES_QUE_ESCRIBEN = [
  ['guardarElCronograma (editar)', () => guardarElCronograma(5, FORMULARIO)],
  ['guardarElCronograma (crear)', () => guardarElCronograma(null, FORMULARIO)],
  ['eliminarElCronograma', () => eliminarElCronograma(5)],
] as const

beforeEach(() => {
  reiniciarDobles({ 'cronogramas-sunat': [{ id: 5, anio: 2025, mes: 12 }] })
  dobles.update.mockResolvedValue({ id: 5 })
  dobles.create.mockResolvedValue({ id: 6 })
  dobles.delete.mockResolvedValue({ id: 5, anio: 2025, mes: 12, periodo: 'Diciembre 2025' })
})

describe('acciones de cronogramas sin sesión (S4.3)', () => {
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

describe('guardarElCronograma', () => {
  it('crea el periodo con una fecha por dígito, como mediodía de Lima (sin correr el día)', async () => {
    conSesion(EDITOR)
    expect(await guardarElCronograma(null, FORMULARIO)).toEqual({
      estado: 'guardado',
      aviso: {
        titulo: 'Cronograma de Enero 2026 cargado',
        detalle: 'Tus clientes ya pueden consultar su fecha con el RUC en la guía.',
      },
    })
    expect(dobles.create).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'cronogramas-sunat',
        data: {
          anio: 2026,
          mes: 1,
          fechasPorDigito: FECHAS.map((fecha, digito) => ({
            digito,
            fecha: `${fecha}T17:00:00.000Z`,
          })),
          fechaBuenosContribuyentes: '2026-02-26T17:00:00.000Z',
        },
        overrideAccess: false,
        user: EDITOR,
      }),
    )
    expect(dobles.revalidatePath).toHaveBeenCalledWith('/panel', 'layout')
  })

  it('al editar se puede conservar el mismo periodo; otro ya cargado se rechaza junto al mes', async () => {
    conSesion(EDITOR)
    const mismo = { ...FORMULARIO, anio: '2025', mes: '12', buenosContribuyentes: '' }
    expect(await guardarElCronograma(5, mismo)).toMatchObject({ estado: 'guardado' })
    expect(dobles.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 5,
        data: expect.objectContaining({ fechaBuenosContribuyentes: null }),
      }),
    )
    dobles.update.mockClear()
    dobles.revalidatePath.mockClear()
    expect(await guardarElCronograma(null, mismo)).toEqual({
      estado: 'invalido',
      errores: { mes: ERROR_DE_PERIODO_REPETIDO },
    })
    expect(dobles.create).not.toHaveBeenCalled()
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })

  it('una fecha que no existe, un mes fuera de rango o un id hostil no llegan a Payload', async () => {
    conSesion(EDITOR)
    const fechas = [...FECHAS]
    fechas[4] = '2026-02-31'
    expect(await guardarElCronograma(null, { ...FORMULARIO, fechas })).toEqual({
      estado: 'invalido',
      errores: { fechas: { 4: ERROR_DE_FECHA } },
    })
    expect((await guardarElCronograma(null, { ...FORMULARIO, mes: '0' })).estado).toBe('invalido')
    expect((await guardarElCronograma('5x', FORMULARIO)).estado).toBe('error')
    nadaSeEscribio()
  })
})

describe('eliminarElCronograma', () => {
  it('un editor no puede eliminar: no llega a Payload', async () => {
    conSesion(EDITOR)
    expect(await eliminarElCronograma(5)).toEqual({ ok: false, error: ERROR_SIN_PERMISO })
    nadaSeEscribio()
  })

  it('el administrador elimina con los permisos de la sesión', async () => {
    conSesion(ADMINISTRADOR)
    expect(await eliminarElCronograma('5')).toEqual({
      ok: true,
      aviso: { titulo: 'Cronograma eliminado', detalle: 'Se borró el de Diciembre 2025.' },
    })
    expect(dobles.delete).toHaveBeenCalledWith(
      expect.objectContaining({ collection: 'cronogramas-sunat', id: 5, user: ADMINISTRADOR }),
    )
  })
})
