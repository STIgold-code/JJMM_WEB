import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ERROR_SIN_PERMISO } from '../aplicacion/gestionar-mensajes'
import { ERROR_DE_TABLA_CAMBIADA } from '../dominio/validacion-de-filas'
import {
  ADMINISTRADOR,
  conSesion,
  dobles,
  EDITOR,
  nadaSeEscribio,
  reiniciarDobles,
} from './prueba/dobles-de-payload'

// Guardar las filas de la tabla con la guardia y el adaptador reales: solo Next y la Local API de
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

const { guardarLasFilas } = await import('./filas-de-la-tabla')

const GUARDADAS = [
  { id: 10, nombre: 'Libros electrónicos', orden: 0 },
  { id: 11, nombre: 'Manejo de Kardex', orden: 1 },
]
const TX = { transactionID: 'tx-1' }
const enviar = (filas: unknown[], conocidas: unknown = [10, 11]) => ({ conocidas, filas })

// Renombra y sube la 11, agrega una nueva y quita la 10.
const CON_BORRADO = enviar([
  { id: 11, nombre: 'Manejo de Kárdex' },
  { id: null, nombre: 'Libro Bancos mensual' },
])
const SIN_BORRADO = enviar([...CON_BORRADO.filas, { id: 10, nombre: 'Libros electrónicos' }])

beforeEach(() => {
  reiniciarDobles({ 'caracteristicas-de-plan': GUARDADAS })
  dobles.update.mockResolvedValue({ id: 11 })
  dobles.create.mockResolvedValue({ id: 12 })
  dobles.delete.mockResolvedValue({ id: 10 })
})

describe('guardarLasFilas sin sesión (S4.3)', () => {
  it('lleva al ingreso y no escribe nada', async () => {
    conSesion(null)
    await expect(guardarLasFilas(SIN_BORRADO)).rejects.toThrow('REDIRECCION /panel/ingreso')
    expect(dobles.find).not.toHaveBeenCalled()
    nadaSeEscribio()
  })

  it('tampoco escribe con una cuenta ajena al equipo', async () => {
    conSesion({ id: 9, rol: 'otro' })
    await expect(guardarLasFilas(SIN_BORRADO)).rejects.toThrow('REDIRECCION /panel/ingreso')
    nadaSeEscribio()
  })
})

describe('guardarLasFilas', () => {
  it('el administrador borra, actualiza y crea en una transacción, solo nombre y orden', async () => {
    conSesion(ADMINISTRADOR)
    expect(await guardarLasFilas(CON_BORRADO)).toMatchObject({ estado: 'guardado' })
    const permisos = { overrideAccess: false, user: ADMINISTRADOR, req: TX }
    expect(dobles.delete).toHaveBeenCalledWith(
      expect.objectContaining({ collection: 'caracteristicas-de-plan', id: 10, ...permisos }),
    )
    expect(dobles.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 11,
        data: { nombre: 'Manejo de Kárdex', orden: 0 },
        ...permisos,
      }),
    )
    expect(dobles.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: { nombre: 'Libro Bancos mensual', orden: 1 }, ...permisos }),
    )
    expect(dobles.commitTransaction).toHaveBeenCalledWith('tx-1')
    expect(dobles.revalidatePath).toHaveBeenCalledWith('/panel', 'layout')
  })

  it('nunca crea celdas: una fila nueva es «No incluido» en todos los planes', async () => {
    conSesion(EDITOR)
    await guardarLasFilas(SIN_BORRADO)
    for (const [llamada] of dobles.create.mock.calls)
      expect(llamada).toMatchObject({ collection: 'caracteristicas-de-plan' })
  })

  it('un editor ordena, renombra y agrega, pero no puede quitar filas', async () => {
    conSesion(EDITOR)
    expect(await guardarLasFilas(SIN_BORRADO)).toMatchObject({ estado: 'guardado' })
    expect(dobles.delete).not.toHaveBeenCalled()
    reiniciarDobles({ 'caracteristicas-de-plan': GUARDADAS })
    conSesion(EDITOR)
    expect(await guardarLasFilas(CON_BORRADO)).toEqual({
      estado: 'error',
      error: ERROR_SIN_PERMISO,
    })
    nadaSeEscribio()
  })

  it('montos, nombres repetidos, ids ajenos o una forma hostil no llegan a Payload', async () => {
    conSesion(ADMINISTRADOR)
    const conMonto = enviar([{ id: 10, nombre: 'Desde S/ 50' }])
    expect((await guardarLasFilas(conMonto)).estado).toBe('invalido')
    const repetidas = enviar([
      { id: 10, nombre: 'Kardex' },
      { id: null, nombre: 'kárdex' },
    ])
    expect((await guardarLasFilas(repetidas)).estado).toBe('invalido')
    expect(await guardarLasFilas(enviar([{ id: 99, nombre: 'Otra' }], [10, 11, 99]))).toEqual({
      estado: 'invalido',
      errores: { general: ERROR_DE_TABLA_CAMBIADA, tablaCambiada: true },
    })
    expect((await guardarLasFilas([{ id: 10, nombre: 'Sin conocidas' }])).estado).toBe('invalido')
    expect((await guardarLasFilas(enviar([], [10, 10]))).estado).toBe('invalido')
    nadaSeEscribio()
  })

  it('sin cambios no escribe nada', async () => {
    conSesion(EDITOR)
    const iguales = enviar(GUARDADAS.map(({ id, nombre }) => ({ id, nombre })))
    expect(await guardarLasFilas(iguales)).toMatchObject({ estado: 'guardado' })
    expect(dobles.beginTransaction).not.toHaveBeenCalled()
  })
})
