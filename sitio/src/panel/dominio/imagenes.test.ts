import { describe, expect, it } from 'vitest'

import {
  filtrosDeImagenesConConteo,
  leerConsultaDeImagenes,
  puedeEliminarImagenes,
  rutaDeImagenes,
  textoDeGaleriaVacia,
} from './imagenes'

describe('leerConsultaDeImagenes', () => {
  it('sin parámetros muestra todas, sin búsqueda, en la primera página', () => {
    expect(leerConsultaDeImagenes({})).toEqual({
      filtro: 'todas',
      busqueda: '',
      pagina: 1,
      imagen: null,
    })
  })

  it('lee el filtro, la búsqueda, la página y la imagen abierta', () => {
    expect(
      leerConsultaDeImagenes({ filtro: 'clientes', q: '  logo ', pagina: '3', imagen: '12' }),
    ).toEqual({ filtro: 'clientes', busqueda: 'logo', pagina: 3, imagen: 12 })
  })

  it('descarta lo que no es válido: filtro desconocido, página o id que no son enteros', () => {
    expect(
      leerConsultaDeImagenes({ filtro: 'otro', pagina: '-1', imagen: '1; DROP', q: ['a', 'b'] }),
    ).toEqual({ filtro: 'todas', busqueda: 'a', pagina: 1, imagen: null })
  })

  it('corta la búsqueda a 100 caracteres', () => {
    expect(leerConsultaDeImagenes({ q: 'x'.repeat(300) }).busqueda).toHaveLength(100)
  })
})

describe('rutaDeImagenes', () => {
  it('sin nada distinto de lo predeterminado es la ruta sola', () => {
    expect(rutaDeImagenes({ filtro: 'todas', pagina: 1 })).toBe('/panel/imagenes')
  })

  it('lleva solo lo que difiere', () => {
    expect(rutaDeImagenes({ filtro: 'sin-usar', busqueda: 'rueda', pagina: 2, imagen: 5 })).toBe(
      '/panel/imagenes?filtro=sin-usar&q=rueda&pagina=2&imagen=5',
    )
  })
})

describe('filtrosDeImagenesConConteo', () => {
  it('arma los filtros de la maqueta, más «Blog» y «Sin usar», con su cantidad', () => {
    const filtros = filtrosDeImagenesConConteo({
      todas: 20,
      inicio: 6,
      clientes: 11,
      marca: 4,
      blog: 0,
      'sin-usar': 1,
    })
    expect(filtros.map(({ valor, texto, cantidad }) => [valor, texto, cantidad])).toEqual([
      ['todas', 'Todas', 20],
      ['inicio', 'Inicio', 6],
      ['clientes', 'Clientes', 11],
      ['marca', 'Marca', 4],
      ['blog', 'Blog', 0],
      ['sin-usar', 'Sin usar', 1],
    ])
  })
})

describe('textoDeGaleriaVacia', () => {
  it('con búsqueda dice qué no coincidió', () => {
    expect(textoDeGaleriaVacia('marca', 'taza')).toBe(
      'Nada coincide con «taza». Prueba con otra palabra.',
    )
  })

  it('sin búsqueda explica el filtro', () => {
    expect(textoDeGaleriaVacia('clientes', '')).toBe('No hay logotipos de clientes.')
    expect(textoDeGaleriaVacia('sin-usar', '')).toBe(
      'Todas las imágenes se usan en alguna parte del sitio.',
    )
  })
})

describe('puedeEliminarImagenes', () => {
  it('solo el administrador elimina imágenes', () => {
    expect(puedeEliminarImagenes('administrador')).toBe(true)
    expect(puedeEliminarImagenes('editor')).toBe(false)
  })
})
