import { describe, expect, it } from 'vitest'

import {
  armarMatrizDePlanes,
  type CaracteristicaGuardada,
  type InclusionGuardada,
  MontoNoPublicableError,
  type PlanGuardado,
} from './matriz-de-planes'

const plan = (id: number, nombre: string): PlanGuardado => ({
  id,
  nombre,
  mensajeDeConsulta: `Hola, quiero información del plan ${nombre}.`,
})

const PLANES = [plan(1, 'Emprende'), plan(2, 'SIGEMype I')]
const CARACTERISTICAS: CaracteristicaGuardada[] = [
  { id: 10, nombre: 'Gestión integral de planilla hasta' },
  { id: 11, nombre: 'Libro Bancos mensual' },
]

const inclusion = (
  planId: number,
  caracteristica: number,
  tipo: InclusionGuardada['tipo'],
  texto: string | null = null,
): InclusionGuardada => ({ plan: planId, caracteristica, tipo, texto })

describe('armarMatrizDePlanes', () => {
  it('arma una fila por característica con una celda por plan, en el orden recibido', () => {
    const matriz = armarMatrizDePlanes(PLANES, CARACTERISTICAS, [
      inclusion(1, 10, 'texto', '2 trabajadores'),
      inclusion(2, 10, 'texto', '4 trabajadores'),
      inclusion(1, 11, 'no-incluido'),
      inclusion(2, 11, 'incluido'),
    ])

    expect(matriz?.planes.map((p) => p.nombre)).toEqual(['Emprende', 'SIGEMype I'])
    expect(matriz?.filas).toEqual([
      {
        caracteristica: 'Gestión integral de planilla hasta',
        celdas: [
          { tipo: 'texto', texto: '2 trabajadores' },
          { tipo: 'texto', texto: '4 trabajadores' },
        ],
      },
      {
        caracteristica: 'Libro Bancos mensual',
        celdas: [{ tipo: 'no-incluido' }, { tipo: 'incluido' }],
      },
    ])
  })

  it('muestra como no incluida la celda que falta o el texto vacío', () => {
    const matriz = armarMatrizDePlanes(PLANES, CARACTERISTICAS.slice(1), [
      inclusion(2, 11, 'texto', '  '),
    ])

    expect(matriz?.filas[0]?.celdas).toEqual([{ tipo: 'no-incluido' }, { tipo: 'no-incluido' }])
  })

  it('no publica montos: una celda con precio es un error de datos (S9)', () => {
    expect(() =>
      armarMatrizDePlanes(PLANES, CARACTERISTICAS, [inclusion(1, 10, 'texto', 'S/ 350')]),
    ).toThrow(MontoNoPublicableError)
  })

  it('no arma la matriz sin planes o sin características', () => {
    expect(armarMatrizDePlanes([], CARACTERISTICAS, [])).toBeNull()
    expect(armarMatrizDePlanes(PLANES, [], [])).toBeNull()
  })
})
