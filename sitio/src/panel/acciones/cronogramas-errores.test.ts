import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ERROR_DE_DATOS_DEL_CRONOGRAMA } from '../aplicacion/gestionar-cronogramas'
import { ERROR_DE_FECHA } from '../dominio/validacion-de-cronograma'
import {
  ADMINISTRADOR,
  conSesion,
  dobles,
  EDITOR,
  reiniciarDobles,
} from './prueba/dobles-de-payload'

// Errores de Payload al escribir cronogramas, con la guardia y el adaptador reales (solo Next y
// la Local API son dobles): un 400 vuelve tipado y nunca rompe la pantalla; cualquier otro error
// se propaga tal cual.
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
const FORMULARIO = { anio: '2026', mes: '1', fechas: FECHAS, buenosContribuyentes: '' }

beforeEach(() => {
  reiniciarDobles({ 'cronogramas-sunat': [{ id: 5, anio: 2025, mes: 12 }] })
})

describe('errores de Payload en los cronogramas', () => {
  it('un 400 vuelve tipado: una fecha a su dígito y lo desconocido como aviso general', async () => {
    conSesion(EDITOR)
    dobles.update.mockRejectedValueOnce({
      status: 400,
      data: { errors: [{ path: 'fechasPorDigito.3.fecha' }] },
    })
    expect(await guardarElCronograma(5, FORMULARIO)).toEqual({
      estado: 'invalido',
      errores: { fechas: { 3: ERROR_DE_FECHA } },
    })
    dobles.create.mockRejectedValueOnce({ status: 400, data: { errors: [{ path: 'otro' }] } })
    expect(await guardarElCronograma(null, FORMULARIO)).toEqual({
      estado: 'error',
      error: ERROR_DE_DATOS_DEL_CRONOGRAMA,
    })
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })

  it('cualquier otro error se propaga', async () => {
    conSesion(ADMINISTRADOR)
    dobles.create.mockRejectedValueOnce(new Error('sin conexión'))
    await expect(guardarElCronograma(null, FORMULARIO)).rejects.toThrow('sin conexión')
    dobles.delete.mockRejectedValueOnce(Object.assign(new Error('caída'), { status: 500 }))
    await expect(eliminarElCronograma(5)).rejects.toThrow('caída')
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })
})
