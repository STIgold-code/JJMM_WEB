import { describe, expect, it } from 'vitest'

import {
  celdaIncluida,
  cuantasIncluye,
  type InclusionDelPanel,
  puedeEliminarPlanes,
  resumenDeInclusiones,
  rutaDelPlan,
} from './planes'

const inclusion = (
  plan: number,
  tipo: InclusionDelPanel['tipo'],
  texto: string | null = null,
): InclusionDelPanel => ({ id: plan * 100 + 1, plan, caracteristica: 1, tipo, texto })

describe('planes del panel', () => {
  it('la ruta de edición lleva el id del plan', () => {
    expect(rutaDelPlan(7)).toBe('/panel/planes/7')
  })

  it('cuenta como incluido lo que el sitio muestra como incluido', () => {
    expect(celdaIncluida({ tipo: 'incluido', texto: null })).toBe(true)
    expect(celdaIncluida({ tipo: 'texto', texto: 'Consultar' })).toBe(true)
    expect(celdaIncluida({ tipo: 'texto', texto: '  ' })).toBe(false)
    expect(celdaIncluida({ tipo: 'no-incluido', texto: null })).toBe(false)
  })

  it('cuenta solo las celdas del plan pedido', () => {
    const inclusiones = [
      inclusion(1, 'incluido'),
      inclusion(1, 'no-incluido'),
      inclusion(2, 'incluido'),
    ]
    expect(cuantasIncluye(1, inclusiones)).toBe(1)
  })

  it('resume lo que incluye frente al total de características', () => {
    expect(resumenDeInclusiones(10, 22)).toBe('Incluye 10 de 22 características')
    expect(resumenDeInclusiones(0, 0)).toBe('La tabla todavía no tiene características')
  })

  it('solo el administrador elimina planes', () => {
    expect(puedeEliminarPlanes('administrador')).toBe(true)
    expect(puedeEliminarPlanes('editor')).toBe(false)
  })
})
