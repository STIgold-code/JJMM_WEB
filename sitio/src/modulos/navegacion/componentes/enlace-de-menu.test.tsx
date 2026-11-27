import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import type { ItemDeMenu } from '../dominio/item-de-menu'
import { EnlaceDeMenu } from './enlace-de-menu'
import { MenuDeEscritorio } from './menu-de-escritorio'

const SECCION: ItemDeMenu = {
  etiqueta: 'Planes',
  href: '/#planes',
  seccion: 'planes',
  externo: false,
  nuevaPestana: false,
  imagen: null,
}

const SIGEFACT: ItemDeMenu = {
  etiqueta: 'SIGEFact',
  href: 'https://sigefact.pse.pe/',
  seccion: null,
  externo: true,
  nuevaPestana: true,
  imagen: {
    url: '/api/medios/file/sigefact.png',
    alt: 'SIGEFact, facturación electrónica',
    ancho: 160,
    alto: 40,
  },
}

const BLOG: ItemDeMenu = { ...SECCION, etiqueta: 'Blog', href: '/blog', seccion: null }

const dibujar = (item: ItemDeMenu, variante: 'cabecera' | 'panel' = 'cabecera') =>
  renderToStaticMarkup(<EnlaceDeMenu item={item} actual={undefined} variante={variante} />)

describe('EnlaceDeMenu', () => {
  it('enlaza una sección del inicio con /#ancla y sin rel ni pestaña nueva', () => {
    expect(dibujar(SECCION)).toBe('<a href="/#planes">Planes</a>')
  })

  it('abre un sitio externo en una pestaña nueva con rel="noopener" y lo anuncia', () => {
    const html = dibujar(SIGEFACT)

    expect(html).toContain('href="https://sigefact.pse.pe/" rel="noopener" target="_blank"')
    expect(html).toContain('<span class="oculto"> (se abre en una pestaña nueva)</span>')
  })

  it('en la cabecera muestra el logo con su texto alternativo en lugar de la etiqueta', () => {
    const html = dibujar(SIGEFACT)

    expect(html).toContain('alt="SIGEFact, facturación electrónica"')
    expect(html).not.toMatch(/>SIGEFact</)
  })

  it('en el panel muestra la etiqueta y deja el logo como decorativo', () => {
    const html = dibujar(SIGEFACT, 'panel')

    expect(html).toContain('>SIGEFact<img')
    expect(html).toContain('alt=""')
  })

  it('enlaza una página interna y marca la actual con aria-current', () => {
    const html = renderToStaticMarkup(<EnlaceDeMenu item={BLOG} actual="page" variante="panel" />)

    expect(html).toContain('href="/blog"')
    expect(html).toContain('aria-current="page"')
  })
})

describe('MenuDeEscritorio', () => {
  it('dibuja un nav etiquetado con los ítems en orden y la sección visible marcada', () => {
    const html = renderToStaticMarkup(
      <MenuDeEscritorio
        items={[BLOG, SECCION]}
        actualDe={(item) => (item.seccion === 'planes' ? 'true' : undefined)}
      />,
    )

    expect(html).toMatch(/<nav class="[^"]*" aria-label="Principal">/)
    expect(html.indexOf('/blog')).toBeLessThan(html.indexOf('/#planes'))
    expect(html).toContain('<a href="/#planes" aria-current="true">Planes</a>')
  })
})
