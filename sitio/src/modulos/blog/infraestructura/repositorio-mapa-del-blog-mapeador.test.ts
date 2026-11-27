import { describe, expect, it } from 'vitest'

import { mapearPublicacionDelMapa } from './repositorio-mapa-del-blog-mapeador'

const CATEGORIA = {
  id: 2,
  nombre: 'Tributación',
  slug: 'tributacion',
  updatedAt: '',
  createdAt: '',
}
const ETIQUETA = {
  id: 3,
  nombre: 'SUNAT',
  slug: 'sunat',
  color: 'rojo' as const,
  updatedAt: '',
  createdAt: '',
}

describe('mapearPublicacionDelMapa', () => {
  it('toma el slug, la fecha de actualización y los slugs de sus relaciones pobladas', () => {
    expect(
      mapearPublicacionDelMapa({
        slug: 'que-es-el-igv',
        updatedAt: '2026-11-28T10:00:00.000Z',
        categoria: CATEGORIA,
        etiquetas: [ETIQUETA, 4],
      }),
    ).toEqual({
      slug: 'que-es-el-igv',
      actualizadaEn: '2026-11-28T10:00:00.000Z',
      categoria: 'tributacion',
      etiquetas: ['sunat'],
    })
  })

  it('trata como ausentes las relaciones sin poblar o vacías', () => {
    expect(
      mapearPublicacionDelMapa({
        slug: 'renta',
        updatedAt: '2026-11-28T10:00:00.000Z',
        categoria: 2,
        etiquetas: null,
      }),
    ).toMatchObject({ categoria: null, etiquetas: [] })
  })
})
