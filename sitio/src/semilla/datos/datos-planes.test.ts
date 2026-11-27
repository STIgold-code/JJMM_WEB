import { describe, expect, it } from 'vitest'

import { contieneMonto, validarTextoDeInclusion } from '@/modulos/planes/dominio/inclusion-de-plan'

import { SEMILLA } from '.'
import { recorrerTextos } from './recorrer-textos'

const textosDeCeldas = (): string[] =>
  SEMILLA.caracteristicas.flatMap(({ celdas }) =>
    celdas.flatMap((celda) => (typeof celda === 'string' ? [] : [celda.texto])),
  )

describe('semilla: planes (S9)', () => {
  it('carga los cuatro planes publicados, en orden', () => {
    expect(SEMILLA.planes.map((plan) => plan.nombre)).toEqual([
      'Emprende',
      'SIGEMype I',
      'SIGEMype II',
      'SIGEMype Business',
    ])
  })

  it('carga las 22 características de la matriz, sin repetir nombres', () => {
    const nombres = SEMILLA.caracteristicas.map((c) => c.nombre)

    expect(nombres).toHaveLength(22)
    expect(new Set(nombres).size).toBe(nombres.length)
  })

  it('cada característica tiene exactamente una celda por plan (par plan + característica único)', () => {
    for (const { nombre, celdas } of SEMILLA.caracteristicas) {
      expect(celdas, nombre).toHaveLength(SEMILLA.planes.length)
    }
  })

  it('ningún texto de los planes publica un monto', () => {
    const textos = recorrerTextos({
      planes: SEMILLA.planes,
      caracteristicas: SEMILLA.caracteristicas,
      seccion: SEMILLA.paginaDeInicio.planes,
    })

    expect(textos.filter(({ texto }) => contieneMonto(texto))).toEqual([])
  })

  it('cada celda de texto cumple la regla de inclusión', () => {
    for (const texto of textosDeCeldas()) {
      expect(validarTextoDeInclusion('texto', texto), texto).toBeNull()
    }
  })

  it('las ventas anuales y los costos se muestran como «Consultar»', () => {
    const conPrecio = SEMILLA.caracteristicas.filter(({ nombre }) =>
      /ventas anuales|Costo por trabajador|Límite de registro/.test(nombre),
    )

    expect(conPrecio).toHaveLength(3)
    for (const { celdas } of conPrecio) {
      expect(
        celdas.every((celda) => typeof celda === 'object' && celda.texto === 'Consultar'),
      ).toBe(true)
    }
  })

  it('la nota al pie dice que el precio se consulta', () => {
    expect(SEMILLA.paginaDeInicio.planes.notaAlPie).toBe('Precio de cada plan: consultar.')
  })
})
