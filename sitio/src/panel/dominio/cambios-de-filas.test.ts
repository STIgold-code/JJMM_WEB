import { describe, expect, it } from 'vitest'

import { cambiosDeFilas } from './cambios-de-filas'

const GUARDADAS = [
  { id: 10, nombre: 'Libros electrónicos' },
  { id: 11, nombre: 'Para empresas con ventas anuales hasta de' },
  { id: 12, nombre: 'Manejo de Kardex' },
]

describe('cambiosDeFilas', () => {
  it('borra las que faltan, crea las nuevas y actualiza solo nombre u orden que cambian', () => {
    const guardadas = GUARDADAS.map((f, orden) => ({ ...f, orden }))
    const enviadas = [
      { id: 12, nombre: 'Manejo de Kardex' },
      { id: null, nombre: 'Libro Bancos mensual' },
      { id: 10, nombre: 'Libros electrónicos (PLE)' },
    ]
    expect(cambiosDeFilas(guardadas, enviadas)).toEqual({
      eliminar: [11],
      temporales: [],
      actualizar: [
        { id: 12, posicion: 0, datos: { orden: 0 } },
        { id: 10, posicion: 2, datos: { nombre: 'Libros electrónicos (PLE)', orden: 2 } },
      ],
      crear: [{ posicion: 1, datos: { nombre: 'Libro Bancos mensual', orden: 1 } }],
    })
  })
})

describe('cambiosDeFilas con nombres intercambiados', () => {
  it('pasa antes por un nombre temporal a las filas que toman el nombre actual de otra', () => {
    const guardadas = [
      { id: 1, nombre: 'A', orden: 0 },
      { id: 2, nombre: 'B', orden: 1 },
      { id: 3, nombre: 'C', orden: 2 },
    ]
    const enviadas = [
      { id: 1, nombre: 'B' },
      { id: 2, nombre: 'A' },
      { id: 3, nombre: 'D' },
    ]
    const cambios = cambiosDeFilas(guardadas, enviadas)
    expect(cambios.temporales).toEqual([
      { id: 1, posicion: 0, nombre: 'Fila 1 (renombrando)' },
      { id: 2, posicion: 1, nombre: 'Fila 2 (renombrando)' },
    ])
    // Primero la que toma un nombre libre; después las que esperan con el temporal.
    expect(cambios.actualizar.map((c) => [c.id, c.datos.nombre])).toEqual([
      [3, 'D'],
      [1, 'B'],
      [2, 'A'],
    ])
  })

  it('una fila que toma el nombre de otra que se renombra a uno libre espera a que lo libere', () => {
    const guardadas = [
      { id: 1, nombre: 'A', orden: 0 },
      { id: 2, nombre: 'B', orden: 1 },
    ]
    const cambios = cambiosDeFilas(guardadas, [
      { id: 1, nombre: 'B' },
      { id: 2, nombre: 'Z' },
    ])
    expect(cambios.temporales.map((t) => t.id)).toEqual([1])
    expect(cambios.actualizar.map((c) => c.id)).toEqual([2, 1])
  })

  it('sin choques no hay nombres temporales', () => {
    const guardadas = [{ id: 1, nombre: 'A', orden: 0 }]
    expect(cambiosDeFilas(guardadas, [{ id: 1, nombre: 'Z' }]).temporales).toEqual([])
  })
})
