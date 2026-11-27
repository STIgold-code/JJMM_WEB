import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import type { Paginacion } from '../dominio/paginacion'
import type { ResumenDePublicacion } from '../dominio/publicacion'
import { ListadoDelBlog } from './listado-del-blog'

const PUBLICACION: ResumenDePublicacion = {
  titulo: '¿Qué es el IGV?',
  slug: 'que-es-el-igv',
  extracto: 'Te explicamos el IGV.',
  imagen: { url: '/api/medios/file/igv.webp', alt: 'Calculadora', ancho: 1200, alto: 630 },
  categoria: { nombre: 'Tributación', slug: 'tributacion' },
  etiquetas: [
    { nombre: 'SUNAT', slug: 'sunat', color: 'rojo' },
    { nombre: 'Mypes', slug: 'mypes', color: 'amarillo' },
  ],
  fechaDePublicacion: '2026-11-27T15:00:00.000Z',
}

const UNA_PAGINA: Paginacion = { pagina: 1, totalDePaginas: 1, anterior: null, siguiente: null }

const dibujar = (publicaciones: ResumenDePublicacion[], paginacion = UNA_PAGINA) =>
  renderToStaticMarkup(
    <ListadoDelBlog
      titulo="Blog"
      antetitulo="Categoría"
      introduccion="Novedades tributarias."
      textoVacio="Aún no hay publicaciones."
      listado={{ publicaciones, paginacion }}
      rutaBase="/blog/categoria/tributacion"
    />,
  )

describe('ListadoDelBlog', () => {
  it('muestra el título como h1 con su antetítulo e introducción', () => {
    const html = dibujar([PUBLICACION])

    expect(html).toContain('<h1 id="titulo-del-listado">Blog</h1>')
    expect(html).toContain('>Categoría</p>')
    expect(html).toContain('>Novedades tributarias.</p>')
  })

  it('cada tarjeta enlaza al detalle, a su categoría y a sus etiquetas, con la fecha en es-PE', () => {
    const html = dibujar([PUBLICACION])

    expect(html).toContain('<a href="/blog/que-es-el-igv">¿Qué es el IGV?</a>')
    expect(html).toContain('<a href="/blog/categoria/tributacion">Tributación</a>')
    expect(html).toMatch(
      /<a class="[^"]*etiqueta[^"]* [^"]*rojo[^"]*" href="\/blog\/etiqueta\/sunat">/,
    )
    expect(html).toMatch(/class="[^"]*amarillo[^"]*" href="\/blog\/etiqueta\/mypes"/)
    expect(html).toContain('<time dateTime="2026-11-27">27 de noviembre de 2026</time>')
    expect(html).toContain('alt="Calculadora"')
  })

  it('las tarjetas entran con la aparición al hacer scroll', () => {
    expect(dibujar([PUBLICACION])).toMatch(/<li class="revelar">/)
  })

  it('sin publicaciones muestra el texto del panel y ninguna lista', () => {
    const html = dibujar([])

    expect(html).toContain('Aún no hay publicaciones.')
    expect(html).not.toContain('<ul')
  })

  it('con una sola página no dibuja la paginación', () => {
    expect(dibujar([PUBLICACION])).not.toContain('aria-label="Paginación"')
  })

  it('enlaza la página anterior sin parámetro si es la primera, y la siguiente con ?pagina=', () => {
    const html = dibujar([PUBLICACION], { pagina: 2, totalDePaginas: 3, anterior: 1, siguiente: 3 })

    expect(html).toContain('aria-label="Paginación"')
    expect(html).toContain('rel="prev" href="/blog/categoria/tributacion">Anterior</a>')
    expect(html).toContain('rel="next" href="/blog/categoria/tributacion?pagina=3">Siguiente</a>')
    expect(html).toContain('<p>Página 2 de 3</p>')
  })
})
