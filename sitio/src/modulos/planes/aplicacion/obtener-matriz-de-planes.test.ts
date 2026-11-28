import { describe, expect, it } from 'vitest'

import { crearObtenerMatrizDePlanes, type RepositorioPlanes } from './obtener-matriz-de-planes'

const repositorio = (planes: number): RepositorioPlanes => ({
  listarPlanes: async () =>
    Array.from({ length: planes }, (_, i) => ({
      id: i + 1,
      nombre: `Plan ${i + 1}`,
      mensajeDeConsulta: null,
      visible: true,
    })),
  listarCaracteristicas: async () => [{ id: 10, nombre: 'Libros electrónicos' }],
  listarInclusiones: async () => [{ plan: 1, caracteristica: 10, tipo: 'incluido', texto: null }],
})

describe('crearObtenerMatrizDePlanes', () => {
  it('arma la matriz con las tres colecciones del repositorio', async () => {
    const matriz = await crearObtenerMatrizDePlanes(repositorio(2))()

    expect(matriz?.filas).toEqual([
      {
        caracteristica: 'Libros electrónicos',
        celdas: [{ tipo: 'incluido' }, { tipo: 'no-incluido' }],
      },
    ])
  })

  it('deja fuera de la tabla del sitio el plan oculto en el panel', async () => {
    const base = repositorio(2)
    const conUnOculto: RepositorioPlanes = {
      ...base,
      listarPlanes: async () =>
        (await base.listarPlanes()).map((plan) => ({ ...plan, visible: plan.id !== 1 })),
    }
    const matriz = await crearObtenerMatrizDePlanes(conUnOculto)()

    expect(matriz?.planes.map((plan) => plan.nombre)).toEqual(['Plan 2'])
    expect(matriz?.filas[0]?.celdas).toEqual([{ tipo: 'no-incluido' }])
  })

  it('devuelve null si no hay planes', async () => {
    expect(await crearObtenerMatrizDePlanes(repositorio(0))()).toBeNull()
  })
})
