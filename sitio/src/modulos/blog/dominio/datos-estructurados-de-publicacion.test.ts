import { describe, expect, it } from 'vitest'

import {
  datosEstructuradosDePublicacion,
  migasDePublicacion,
} from './datos-estructurados-de-publicacion'
import type { DetalleDePublicacion } from './publicacion'

const ORIGEN = new URL('https://sigemype.com')

const PUBLICACION: DetalleDePublicacion<null> = {
  titulo: '¿Qué es el IGV?',
  slug: 'que-es-el-igv',
  extracto: 'Te explicamos el IGV.',
  imagen: { url: '/api/medios/file/igv.webp', alt: 'Calculadora', ancho: 1200, alto: 630 },
  categoria: { nombre: 'Tributación', slug: 'tributacion' },
  etiquetas: [
    { nombre: 'SUNAT', slug: 'sunat', color: 'rojo' },
    { nombre: 'IGV', slug: 'igv', color: 'azul' },
  ],
  fechaDePublicacion: '2026-11-27T15:00:00.000Z',
  fechaDeActualizacion: '2026-11-28T10:00:00.000Z',
  contenido: null,
  seo: { titulo: null, descripcion: null },
}

const ESTUDIO = { nombre: 'Estudio Contable JJMM', logo: '/api/medios/file/logo.webp' }

const EDITOR = {
  '@type': 'Organization',
  name: 'Estudio Contable JJMM',
  url: 'https://sigemype.com/',
  logo: { '@type': 'ImageObject', url: 'https://sigemype.com/api/medios/file/logo.webp' },
}

describe('datosEstructuradosDePublicacion', () => {
  it('describe la publicación como BlogPosting con URL absolutas', () => {
    expect(datosEstructuradosDePublicacion(ORIGEN, PUBLICACION, ESTUDIO)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: '¿Qué es el IGV?',
      description: 'Te explicamos el IGV.',
      url: 'https://sigemype.com/blog/que-es-el-igv',
      mainEntityOfPage: 'https://sigemype.com/blog/que-es-el-igv',
      datePublished: '2026-11-27T15:00:00.000Z',
      dateModified: '2026-11-28T10:00:00.000Z',
      inLanguage: 'es-PE',
      image: ['https://sigemype.com/api/medios/file/igv.webp'],
      articleSection: 'Tributación',
      keywords: ['SUNAT', 'IGV'],
      author: EDITOR,
      publisher: EDITOR,
    })
  })

  it('usa la descripción SEO del panel y omite lo que no existe', () => {
    const datos = datosEstructuradosDePublicacion(
      ORIGEN,
      {
        ...PUBLICACION,
        imagen: null,
        categoria: null,
        etiquetas: [],
        seo: { titulo: 'IGV 2026', descripcion: 'Guía del IGV' },
      },
      { ...ESTUDIO, logo: null },
    )

    expect(datos.description).toBe('Guía del IGV')
    expect(datos.headline).toBe('¿Qué es el IGV?')
    expect(datos).not.toHaveProperty('image')
    expect(datos).not.toHaveProperty('articleSection')
    expect(datos).not.toHaveProperty('keywords')
    expect(datos.publisher).toEqual({
      '@type': 'Organization',
      name: 'Estudio Contable JJMM',
      url: 'https://sigemype.com/',
    })
  })
})

describe('migasDePublicacion', () => {
  const textos = { nombreDelSitio: 'Estudio Contable JJMM', tituloDelBlog: 'Blog' }

  it('va del inicio al blog, la categoría y la publicación', () => {
    expect(migasDePublicacion(PUBLICACION, textos)).toEqual([
      { nombre: 'Estudio Contable JJMM', ruta: '/' },
      { nombre: 'Blog', ruta: '/blog' },
      { nombre: 'Tributación', ruta: '/blog/categoria/tributacion' },
      { nombre: '¿Qué es el IGV?', ruta: '/blog/que-es-el-igv' },
    ])
  })

  it('sin categoría salta ese nivel', () => {
    const migas = migasDePublicacion({ ...PUBLICACION, categoria: null }, textos)

    expect(migas.map(({ ruta }) => ruta)).toEqual(['/', '/blog', '/blog/que-es-el-igv'])
  })
})
