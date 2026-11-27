import { describe, expect, it } from 'vitest'

import {
  extractoDelMensaje,
  filtrosConConteo,
  MENSAJES_POR_PAGINA,
  paginacion,
  textoDeListaVacia,
} from './lista-de-mensajes'

describe('extractoDelMensaje', () => {
  it('deja igual un texto corto, en una sola línea', () => {
    expect(extractoDelMensaje('Hola,\n  necesito  ayuda')).toBe('Hola, necesito ayuda')
  })

  it('corta un texto largo en 70 caracteres y agrega puntos suspensivos', () => {
    const extracto = extractoDelMensaje(`${'a'.repeat(69)} ${'b'.repeat(30)}`)
    expect(extracto).toBe(`${'a'.repeat(69)}…`)
  })
})

describe('filtrosConConteo', () => {
  it('cuenta nuevos, atendidos y todos (la suma), en el orden de la maqueta', () => {
    expect(filtrosConConteo({ nuevos: 3, atendidos: 5 })).toEqual([
      { filtro: 'nuevo', texto: 'Nuevos', cantidad: 3 },
      { filtro: 'atendido', texto: 'Atendidos', cantidad: 5 },
      { filtro: 'todos', texto: 'Todos', cantidad: 8 },
    ])
  })
})

describe('textoDeListaVacia', () => {
  it('explica qué aparecerá según el filtro', () => {
    expect(textoDeListaVacia('nuevo', '')).toBe(
      'No hay mensajes nuevos. Cuando alguien escriba desde el sitio, aparecerá aquí.',
    )
    expect(textoDeListaVacia('atendido', '')).toBe('Aún no marcas ningún mensaje como atendido.')
    expect(textoDeListaVacia('todos', '')).toBe('No hay mensajes.')
  })

  it('con búsqueda dice qué se buscó y sugiere otra palabra', () => {
    expect(textoDeListaVacia('nuevo', 'plame')).toBe(
      'Nada coincide con «plame». Prueba con otra palabra.',
    )
  })
})

describe('paginacion', () => {
  it('una sola página no tiene anterior ni siguiente', () => {
    expect(paginacion(3, 1)).toEqual({
      pagina: 1,
      paginas: 1,
      desde: 1,
      hasta: 3,
      total: 3,
      anterior: null,
      siguiente: null,
    })
  })

  it('en una página intermedia muestra el rango y las dos vecinas', () => {
    const total = MENSAJES_POR_PAGINA * 2 + 4
    expect(paginacion(total, 2)).toMatchObject({
      pagina: 2,
      paginas: 3,
      desde: MENSAJES_POR_PAGINA + 1,
      hasta: MENSAJES_POR_PAGINA * 2,
      anterior: 1,
      siguiente: 3,
    })
  })

  it('una página más allá del final se lleva a la última', () => {
    expect(paginacion(MENSAJES_POR_PAGINA + 1, 9)).toMatchObject({
      pagina: 2,
      desde: MENSAJES_POR_PAGINA + 1,
      hasta: MENSAJES_POR_PAGINA + 1,
      siguiente: null,
    })
  })

  it('sin resultados queda en la página 1, sin rango', () => {
    expect(paginacion(0, 4)).toMatchObject({ pagina: 1, paginas: 1, desde: 0, hasta: 0 })
  })
})
