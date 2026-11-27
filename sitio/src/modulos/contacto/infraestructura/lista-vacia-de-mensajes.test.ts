import { describe, expect, it } from 'vitest'

import { hayBusquedaOFiltros, textoDeListaVacia } from './texto-de-lista-vacia'

describe('textoDeListaVacia', () => {
  it('sin búsqueda, explica de dónde llegan los mensajes', () => {
    expect(textoDeListaVacia(false)).toEqual({
      titulo: 'Todavía no llegó ningún mensaje.',
      detalle:
        'Cuando alguien escriba desde el formulario «Contáctanos» del sitio, su mensaje aparecerá aquí.',
    })
  })

  it('con búsqueda o filtros, dice que nada coincide', () => {
    expect(textoDeListaVacia(true)).toEqual({
      titulo: 'Ningún mensaje coincide con tu búsqueda.',
      detalle: 'Prueba con otras palabras o quita los filtros.',
    })
  })
})

describe('hayBusquedaOFiltros', () => {
  it('detecta una búsqueda escrita', () => {
    expect(hayBusquedaOFiltros({ search: 'ana' })).toBe(true)
  })

  it('detecta un filtro', () => {
    expect(hayBusquedaOFiltros({ where: { estado: { equals: 'nuevo' } } })).toBe(true)
  })

  it('no cuenta una búsqueda vacía ni un filtro vacío', () => {
    expect(hayBusquedaOFiltros({ search: '  ', where: {} })).toBe(false)
    expect(hayBusquedaOFiltros(undefined)).toBe(false)
  })
})
