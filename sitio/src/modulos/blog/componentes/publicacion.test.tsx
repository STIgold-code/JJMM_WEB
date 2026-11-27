import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import type { ResumenDePublicacion } from '../dominio/publicacion'
import { ArticuloDePublicacion } from './articulo-de-publicacion'
import { PublicacionesSimilares } from './publicaciones-similares'

const similar = (slug: string): ResumenDePublicacion => ({
  titulo: `Título ${slug}`,
  slug,
  extracto: 'Extracto',
  imagen: null,
  categoria: null,
  etiquetas: [],
  fechaDePublicacion: '2026-11-20T15:00:00.000Z',
})

describe('ArticuloDePublicacion', () => {
  const html = renderToStaticMarkup(
    <ArticuloDePublicacion
      titulo="¿Qué es el IGV?"
      extracto="Te explicamos el IGV."
      imagen={{ url: '/api/medios/file/igv.webp', alt: 'Calculadora', ancho: 1200, alto: 630 }}
      categoria={{ nombre: 'Tributación', slug: 'tributacion' }}
      etiquetas={[{ nombre: 'SUNAT', slug: 'sunat', color: 'verde' }]}
      fechaDePublicacion="2026-11-27T15:00:00.000Z"
    >
      <p>Contenido del panel</p>
    </ArticuloDePublicacion>,
  )

  it('es un article con el título como h1, la categoría enlazada y la fecha', () => {
    expect(html).toMatch(/<article class="[^"]* contenedor">/)
    expect(html).toContain('<h1>¿Qué es el IGV?</h1>')
    expect(html).toContain('<a href="/blog/categoria/tributacion">Tributación</a>')
    expect(html).toContain('<time dateTime="2026-11-27">27 de noviembre de 2026</time>')
    expect(html).toContain('href="/blog/etiqueta/sunat"')
  })

  it('carga la imagen principal de inmediato y dibuja el contenido recibido', () => {
    expect(html).toMatch(/<img alt="Calculadora"[^>]*fetchPriority="high"[^>]*loading="eager"/)
    expect(html).toContain('<p>Contenido del panel</p>')
  })
})

describe('PublicacionesSimilares', () => {
  it('lista cada similar con su enlace, como h3 bajo el h2 «Publicaciones similares»', () => {
    const html = renderToStaticMarkup(
      <PublicacionesSimilares publicaciones={[similar('a'), similar('b')]} />,
    )

    expect(html).toContain('<h2 id="titulo-similares">Publicaciones similares</h2>')
    expect(html).toContain('<h3><a href="/blog/a">Título a</a></h3>')
    expect(html).toContain('<h3><a href="/blog/b">Título b</a></h3>')
  })

  it('sin similares no dibuja la sección', () => {
    expect(renderToStaticMarkup(<PublicacionesSimilares publicaciones={[]} />)).toBe('')
  })
})
