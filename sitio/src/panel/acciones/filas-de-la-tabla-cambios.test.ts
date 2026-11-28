import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ERROR_DE_TABLA_CAMBIADA } from '../dominio/validacion-de-filas'
import {
  ADMINISTRADOR,
  conSesion,
  dobles,
  EDITOR,
  nadaSeEscribio,
  reiniciarDobles,
} from './prueba/dobles-de-payload'

// Cambios simultáneos, nombres intercambiados y errores de Payload al guardar las filas, con la
// guardia y el adaptador reales (solo Next y la Local API son dobles).
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

const { guardarLasFilas } = await import('./filas-de-la-tabla')

const GUARDADAS = [
  { id: 10, nombre: 'Libros electrónicos', orden: 0 },
  { id: 11, nombre: 'Manejo de Kardex', orden: 1 },
]
// La 12 la agregó otra persona después de que se abrió la pantalla.
const CON_FILA_AJENA = [...GUARDADAS, { id: 12, nombre: 'Libro Bancos mensual', orden: 2 }]
const enviar = (filas: unknown[], conocidas: unknown = [10, 11]) => ({ conocidas, filas })
const SOLO_LA_11 = enviar([{ id: 11, nombre: 'Manejo de Kardex' }])

const rechazo400 = (...paths: string[]) => ({
  status: 400,
  data: { errors: paths.map((path) => ({ path })) },
})

beforeEach(() => {
  reiniciarDobles({ 'caracteristicas-de-plan': GUARDADAS })
  dobles.update.mockResolvedValue({ id: 11 })
  dobles.create.mockResolvedValue({ id: 12 })
  dobles.delete.mockResolvedValue({ id: 10 })
})

describe('una lista desactualizada nunca borra lo que otra persona agregó', () => {
  it.each([
    ['el administrador', ADMINISTRADOR],
    ['un editor', EDITOR],
  ])('%s recibe «la tabla cambió» y no se escribe nada', async (_, usuario) => {
    reiniciarDobles({ 'caracteristicas-de-plan': CON_FILA_AJENA })
    conSesion(usuario)
    expect(await guardarLasFilas(SOLO_LA_11)).toEqual({
      estado: 'invalido',
      errores: { general: ERROR_DE_TABLA_CAMBIADA, tablaCambiada: true },
    })
    nadaSeEscribio()
  })

  it('el administrador sí borra una fila que conocía', async () => {
    conSesion(ADMINISTRADOR)
    expect(await guardarLasFilas(SOLO_LA_11)).toMatchObject({ estado: 'guardado' })
    expect(dobles.delete).toHaveBeenCalledTimes(1)
    expect(dobles.delete).toHaveBeenCalledWith(expect.objectContaining({ id: 10 }))
  })

  it('tras guardar, la pantalla recarga sus ids y el siguiente guardado funciona', async () => {
    conSesion(EDITOR)
    reiniciarDobles({ 'caracteristicas-de-plan': CON_FILA_AJENA })
    conSesion(EDITOR)
    const conLaNueva = enviar(
      CON_FILA_AJENA.map(({ id, nombre }) => ({ id, nombre })).reverse(),
      [10, 11, 12],
    )
    expect(await guardarLasFilas(conLaNueva)).toMatchObject({ estado: 'guardado' })
    expect(dobles.delete).not.toHaveBeenCalled()
  })
})

describe('nombres intercambiados', () => {
  it('pasan por un nombre temporal en la misma transacción y no chocan con el índice único', async () => {
    conSesion(EDITOR)
    const intercambio = enviar([
      { id: 10, nombre: 'Manejo de Kardex' },
      { id: 11, nombre: 'Libros electrónicos' },
    ])
    expect(await guardarLasFilas(intercambio)).toMatchObject({ estado: 'guardado' })
    const escritos = dobles.update.mock.calls.map(([{ id, data, req }]) => [id, data.nombre, req])
    const tx = { transactionID: 'tx-1' }
    expect(escritos).toEqual([
      [10, 'Fila 10 (renombrando)', tx],
      [11, 'Fila 11 (renombrando)', tx],
      [10, 'Manejo de Kardex', tx],
      [11, 'Libros electrónicos', tx],
    ])
    expect(dobles.commitTransaction).toHaveBeenCalledWith('tx-1')
  })
})

describe('errores de Payload', () => {
  it('un 400 vuelve tipado a su fila, sin lanzar ni revalidar, y la transacción se deshace', async () => {
    conSesion(EDITOR)
    dobles.create.mockRejectedValueOnce(rechazo400('nombre'))
    const conNueva = enviar([
      ...GUARDADAS.map(({ id, nombre }) => ({ id, nombre })),
      { id: null, nombre: 'Otra' },
    ])
    expect(await guardarLasFilas(conNueva)).toEqual({
      estado: 'invalido',
      errores: { fila: { 2: 'Revisa este nombre: puede que ya exista otra fila igual.' } },
    })
    expect(dobles.rollbackTransaction).toHaveBeenCalledWith('tx-1')
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })

  it('cualquier otro error se propaga y nada se confirma', async () => {
    conSesion(ADMINISTRADOR)
    const caida = Object.assign(new Error('conexión rechazada'), { status: 500 })
    dobles.delete.mockRejectedValueOnce(caida)
    await expect(guardarLasFilas(SOLO_LA_11)).rejects.toBe(caida)
    expect(dobles.commitTransaction).not.toHaveBeenCalled()
    expect(dobles.rollbackTransaction).toHaveBeenCalledWith('tx-1')
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })
})
