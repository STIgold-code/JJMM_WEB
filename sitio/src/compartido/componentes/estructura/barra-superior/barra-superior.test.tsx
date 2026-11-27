import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { BarraSuperior } from './barra-superior'

const PROPS = {
  redes: [
    { red: 'facebook', url: 'https://www.facebook.com/jjmm' },
    { red: 'tiktok', url: 'https://www.tiktok.com/@jjmm' },
  ] as const,
  whatsapp: { texto: '951 965 242', href: 'https://wa.me/51951965242?text=Hola' },
  llamadas: { texto: '952 249 102', href: 'tel:+51952249102' },
  correo: { texto: 'contabilidad@jjmm.com.pe', href: 'mailto:contabilidad@jjmm.com.pe' },
}

describe('BarraSuperior', () => {
  it('enlaza WhatsApp, llamada y correo con los datos del panel', () => {
    const html = renderToStaticMarkup(<BarraSuperior {...PROPS} />)

    expect(html).toContain('href="https://wa.me/51951965242?text=Hola"')
    expect(html).toContain('href="tel:+51952249102"')
    expect(html).toContain('href="mailto:contabilidad@jjmm.com.pe"')
    expect(html).toContain('951 965 242')
  })

  it('nombra cada red para lectores de pantalla y la enlaza con rel="noopener"', () => {
    const html = renderToStaticMarkup(<BarraSuperior {...PROPS} />)

    expect(html).toMatch(/<ul class="[^"]*" aria-label="Redes sociales">/)
    expect(html).toContain('href="https://www.facebook.com/jjmm" rel="noopener"')
    expect(html).toContain('<span class="oculto">Facebook</span>')
    expect(html).toContain('<span class="oculto">TikTok</span>')
  })

  it('no dibuja la lista de redes si no hay ninguna', () => {
    const html = renderToStaticMarkup(<BarraSuperior {...PROPS} redes={[]} />)

    expect(html).not.toContain('Redes sociales')
  })
})
