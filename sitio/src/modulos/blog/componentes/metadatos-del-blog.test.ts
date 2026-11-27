import { describe, expect, it } from 'vitest'

import { metadatosDeListado, metadatosDelBlog, metadatosDePublicacion } from './metadatos-del-blog'

const PAGINA_DEL_BLOG = {
  titulo: 'Blog',
  introduccion: 'Novedades tributarias.',
  textoSinPublicaciones: 'Aún no hay publicaciones.',
  seo: { titulo: null, descripcion: null },
}

describe('metadatosDelBlog', () => {
  it('usa el título y la introducción si no hay SEO propio, con canonical /blog', () => {
    expect(metadatosDelBlog(PAGINA_DEL_BLOG, 1)).toEqual({
      title: 'Blog',
      description: 'Novedades tributarias.',
      alternates: { canonical: '/blog' },
      openGraph: { type: 'website', title: 'Blog', url: '/blog' },
    })
  })

  it('prefiere el SEO del panel y numera las páginas siguientes', () => {
    const conSeo = { ...PAGINA_DEL_BLOG, seo: { titulo: 'Blog contable', descripcion: 'IGV' } }

    expect(metadatosDelBlog(conSeo, 2)).toMatchObject({
      title: 'Blog contable (página 2)',
      description: 'IGV',
      alternates: { canonical: '/blog?pagina=2' },
    })
  })
})

describe('metadatosDeListado', () => {
  it('sin descripción no la define, para heredar la del sitio', () => {
    const metadatos = metadatosDeListado({
      titulo: 'Categoría: Laboral',
      descripcion: null,
      rutaBase: '/blog/categoria/laboral',
      pagina: 1,
    })

    expect(metadatos).not.toHaveProperty('description')
    expect(metadatos.alternates).toEqual({ canonical: '/blog/categoria/laboral' })
  })
})

describe('metadatosDePublicacion', () => {
  const publicacion = {
    titulo: '¿Qué es el IGV?',
    slug: 'que-es-el-igv',
    extracto: 'Te explicamos el IGV.',
    imagen: { url: '/api/medios/file/igv.webp', alt: 'Calculadora', ancho: 1200, alto: 630 },
    categoria: null,
    etiquetas: [],
    fechaDePublicacion: '2026-11-27T15:00:00.000Z',
    contenido: null,
    seo: { titulo: null, descripcion: null },
  }

  it('describe el artículo con su extracto, canonical e imagen de Open Graph', () => {
    expect(metadatosDePublicacion(publicacion)).toEqual({
      title: '¿Qué es el IGV?',
      description: 'Te explicamos el IGV.',
      alternates: { canonical: '/blog/que-es-el-igv' },
      openGraph: {
        type: 'article',
        title: '¿Qué es el IGV?',
        description: 'Te explicamos el IGV.',
        url: '/blog/que-es-el-igv',
        publishedTime: '2026-11-27T15:00:00.000Z',
        images: [
          { url: '/api/medios/file/igv.webp', width: 1200, height: 630, alt: 'Calculadora' },
        ],
      },
    })
  })

  it('prefiere el título y la descripción SEO del panel', () => {
    const conSeo = { ...publicacion, seo: { titulo: 'IGV en 2026', descripcion: 'Guía' } }

    expect(metadatosDePublicacion(conSeo)).toMatchObject({
      title: 'IGV en 2026',
      description: 'Guía',
    })
  })
})
