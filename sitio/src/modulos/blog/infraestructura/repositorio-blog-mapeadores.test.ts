import { describe, expect, it } from 'vitest'

import type { Medio, Publicacione } from '@/payload-types'

import { mapearPaginaDelBlog, mapearResumen } from './repositorio-blog-mapeadores'

const IMAGEN: Medio = {
  id: 7,
  alt: 'Calculadora y documentos',
  url: '/api/medios/file/igv.webp',
  width: 1200,
  height: 630,
  updatedAt: '2026-11-27T00:00:00.000Z',
  createdAt: '2026-11-27T00:00:00.000Z',
}

const PUBLICACION: Publicacione = {
  id: 1,
  titulo: '¿Qué es el IGV?',
  slug: 'que-es-el-igv',
  extracto: 'Te explicamos el IGV.',
  imagen: IMAGEN,
  contenido: {
    root: { type: 'root', children: [], direction: null, format: '', indent: 0, version: 1 },
  },
  categoria: { id: 2, nombre: 'Tributación', slug: 'tributacion', updatedAt: '', createdAt: '' },
  etiquetas: [
    { id: 3, nombre: 'SUNAT', slug: 'sunat', color: 'rojo', updatedAt: '', createdAt: '' },
    4,
  ],
  fechaDePublicacion: '2026-11-27T15:00:00.000Z',
  updatedAt: '',
  createdAt: '',
  _status: 'published',
}

describe('mapearResumen', () => {
  it('toma los campos de la tarjeta con la imagen, la categoría y las etiquetas pobladas', () => {
    expect(mapearResumen(PUBLICACION)).toEqual({
      titulo: '¿Qué es el IGV?',
      slug: 'que-es-el-igv',
      extracto: 'Te explicamos el IGV.',
      imagen: {
        url: '/api/medios/file/igv.webp',
        alt: 'Calculadora y documentos',
        ancho: 1200,
        alto: 630,
      },
      categoria: { nombre: 'Tributación', slug: 'tributacion' },
      etiquetas: [{ nombre: 'SUNAT', slug: 'sunat', color: 'rojo' }],
      fechaDePublicacion: '2026-11-27T15:00:00.000Z',
    })
  })

  it('trata como ausentes las relaciones sin poblar', () => {
    const resumen = mapearResumen({ ...PUBLICACION, imagen: 7, categoria: 2, etiquetas: null })

    expect(resumen).toMatchObject({ imagen: null, categoria: null, etiquetas: [] })
  })
})

describe('mapearPaginaDelBlog', () => {
  it('devuelve los textos del listado y su SEO', () => {
    const pagina = mapearPaginaDelBlog({
      titulo: 'Blog',
      introduccion: 'Novedades tributarias.',
      textoSinPublicaciones: 'Aún no hay publicaciones.',
      seo: { titulo: 'Blog contable', descripcion: '' },
    })

    expect(pagina).toEqual({
      titulo: 'Blog',
      introduccion: 'Novedades tributarias.',
      textoSinPublicaciones: 'Aún no hay publicaciones.',
      seo: { titulo: 'Blog contable', descripcion: null },
    })
  })

  it('devuelve null si la global nunca se guardó', () => {
    expect(mapearPaginaDelBlog({})).toBeNull()
    expect(mapearPaginaDelBlog({ titulo: 'Blog', textoSinPublicaciones: ' ' })).toBeNull()
  })
})
