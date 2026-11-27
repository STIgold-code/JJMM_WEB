import { describe, expect, it } from 'vitest'

import { calcularPaginacion, leerNumeroDePagina, PUBLICACIONES_POR_PAGINA } from './paginacion'

describe('leerNumeroDePagina', () => {
  it('sin parámetro es la primera página', () => {
    expect(leerNumeroDePagina(undefined)).toBe(1)
  })

  it('acepta enteros positivos escritos en decimal', () => {
    expect(leerNumeroDePagina('1')).toBe(1)
    expect(leerNumeroDePagina('12')).toBe(12)
  })

  it('rechaza ceros, negativos, decimales, texto y ceros a la izquierda', () => {
    for (const valor of ['0', '-1', '2.5', 'dos', '', '02', '1e2', ' 3']) {
      expect(leerNumeroDePagina(valor)).toBeNull()
    }
  })

  it('rechaza el parámetro repetido', () => {
    expect(leerNumeroDePagina(['1', '2'])).toBeNull()
  })
})

describe('calcularPaginacion', () => {
  it('muestra nueve publicaciones por página', () => {
    expect(PUBLICACIONES_POR_PAGINA).toBe(9)
  })

  it('calcula el total de páginas y los vecinos de una página intermedia', () => {
    expect(calcularPaginacion(20, 2, 9)).toEqual({
      pagina: 2,
      totalDePaginas: 3,
      anterior: 1,
      siguiente: 3,
    })
  })

  it('no tiene anterior en la primera ni siguiente en la última', () => {
    expect(calcularPaginacion(18, 1, 9)).toMatchObject({ anterior: null, siguiente: 2 })
    expect(calcularPaginacion(18, 2, 9)).toMatchObject({ anterior: 1, siguiente: null })
  })

  it('sin publicaciones hay una sola página, vacía', () => {
    expect(calcularPaginacion(0, 1, 9)).toEqual({
      pagina: 1,
      totalDePaginas: 1,
      anterior: null,
      siguiente: null,
    })
  })

  it('devuelve null si la página no existe', () => {
    expect(calcularPaginacion(9, 2, 9)).toBeNull()
    expect(calcularPaginacion(0, 2, 9)).toBeNull()
  })
})
