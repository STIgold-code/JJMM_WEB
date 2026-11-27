import { describe, expect, it } from 'vitest'

import {
  condicionDelFiltro,
  condicionPorSlug,
  SOLO_PUBLICADAS,
} from './repositorio-blog-condiciones'

describe('condiciones de publicaciones', () => {
  it('el listado general solo trae publicadas', () => {
    expect(condicionDelFiltro({ tipo: 'todas' })).toEqual({ _status: { equals: 'published' } })
  })

  it('filtra por el slug de la categoría o de la etiqueta, siempre entre publicadas', () => {
    expect(condicionDelFiltro({ tipo: 'categoria', slug: 'laboral' })).toEqual({
      and: [SOLO_PUBLICADAS, { 'categoria.slug': { equals: 'laboral' } }],
    })
    expect(condicionDelFiltro({ tipo: 'etiqueta', slug: 'plame' })).toEqual({
      and: [SOLO_PUBLICADAS, { 'etiquetas.slug': { equals: 'plame' } }],
    })
  })

  it('el detalle busca por slug solo entre publicadas', () => {
    expect(condicionPorSlug('que-es-el-igv')).toEqual({
      and: [SOLO_PUBLICADAS, { slug: { equals: 'que-es-el-igv' } }],
    })
  })
})
