import { describe, expect, it } from 'vitest'

import { cambiosDeInclusiones } from './inclusiones-a-guardar'
import type { InclusionDelPanel } from './planes'

const GUARDADAS: InclusionDelPanel[] = [
  { id: 1, plan: 3, caracteristica: 10, tipo: 'texto', texto: '6 trabajadores' },
  { id: 2, plan: 3, caracteristica: 11, tipo: 'incluido', texto: null },
  { id: 3, plan: 3, caracteristica: 12, tipo: 'no-incluido', texto: null },
]

describe('cambiosDeInclusiones', () => {
  it('sin cambios no escribe nada', () => {
    expect(
      cambiosDeInclusiones(GUARDADAS, [
        { caracteristica: 10, tipo: 'texto', texto: '6 trabajadores' },
        { caracteristica: 11, tipo: 'incluido', texto: null },
        { caracteristica: 12, tipo: 'no-incluido', texto: null },
        { caracteristica: 13, tipo: 'no-incluido', texto: null },
      ]),
    ).toEqual({ crear: [], actualizar: [] })
  })

  it('actualiza la celda guardada que cambia, con su id', () => {
    expect(
      cambiosDeInclusiones(GUARDADAS, [
        { caracteristica: 10, tipo: 'texto', texto: '8 trabajadores' },
        { caracteristica: 11, tipo: 'no-incluido', texto: null },
      ]),
    ).toEqual({
      crear: [],
      actualizar: [
        { id: 1, caracteristica: 10, tipo: 'texto', texto: '8 trabajadores' },
        { id: 2, caracteristica: 11, tipo: 'no-incluido', texto: null },
      ],
    })
  })

  it('crea la celda que falta solo si deja de ser «No incluido»', () => {
    expect(
      cambiosDeInclusiones(GUARDADAS, [
        { caracteristica: 13, tipo: 'incluido', texto: null },
        { caracteristica: 14, tipo: 'texto', texto: 'Consultar' },
        { caracteristica: 15, tipo: 'no-incluido', texto: null },
      ]),
    ).toEqual({
      crear: [
        { caracteristica: 13, tipo: 'incluido', texto: null },
        { caracteristica: 14, tipo: 'texto', texto: 'Consultar' },
      ],
      actualizar: [],
    })
  })
})
