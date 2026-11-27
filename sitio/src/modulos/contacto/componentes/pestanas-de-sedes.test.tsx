import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import type { SedeDeContacto } from '@/modulos/sedes/dominio/sede-de-contacto'

import { PestanasDeSedes } from './pestanas-de-sedes'

const sede = (pestana: string, cambios: Partial<SedeDeContacto> = {}): SedeDeContacto => ({
  nombre: `Sede ${pestana}`,
  pestana,
  direccion: `Jr. Iquitos 593, ${pestana}, Lima`,
  whatsapp: { texto: '951 965 242', href: 'https://wa.me/51951965242?text=Hola' },
  llamada: { texto: '952 249 102', href: 'tel:+51952249102' },
  comoLlegar: 'https://www.google.com/maps/search/?api=1&query=Jr.%20Iquitos',
  mapa: 'https://www.google.com/maps?q=Jr.%20Iquitos&output=embed',
  ...cambios,
})

const SEDES = [sede('San Martín de Porres'), sede('San Isidro')]
const TEXTOS = { comoLlegar: 'Cómo llegar', verMapa: 'Ver mapa' }
const FOTO = { url: '/api/medios/file/hero-equipo.webp', alt: 'Equipo', ancho: 1600, alto: 900 }

const dibujar = (cambios: Partial<Parameters<typeof PestanasDeSedes>[0]> = {}) =>
  renderToStaticMarkup(
    <PestanasDeSedes sedes={SEDES} textos={TEXTOS} foto={FOTO} etiqueta="Sedes" {...cambios} />,
  )

describe('PestanasDeSedes', () => {
  it('dibuja una pestaña por sede con el distrito; solo la primera está elegida', () => {
    const html = dibujar()

    expect(html).toContain('role="tablist" aria-label="Sedes"')
    expect(html).toMatch(
      /role="tab" id="([^"]+)" aria-controls="([^"]+)" aria-selected="true" tabindex="0">San Martín de Porres<\/button>/,
    )
    expect(html).toMatch(/aria-selected="false" tabindex="-1">San Isidro<\/button>/)
  })

  it('cada panel está unido a su pestaña y solo el elegido se ve', () => {
    const html = dibujar()
    const paneles = Array.from(html.matchAll(/<div role="tabpanel" id="([^"]+)"([^>]*)>/g))

    expect(paneles).toHaveLength(2)
    expect(paneles[0]?.[2]).not.toContain('hidden')
    expect(paneles[1]?.[2]).toContain('hidden=""')
    for (const [, id] of paneles) expect(html).toContain(`aria-controls="${id}"`)
  })

  it('muestra la sede como en la v5: nombre, dirección y sus tres botones', () => {
    const html = dibujar()

    expect(html).toContain(
      '<address><strong>Sede San Martín de Porres</strong>Jr. Iquitos 593, San Martín de Porres, Lima</address>',
    )
    expect(html).toMatch(/href="https:\/\/wa\.me\/51951965242\?text=Hola"[^>]*>.*951 965 242<\/a>/)
    expect(html).toMatch(/href="tel:\+51952249102">.*952 249 102<\/a>/)
    expect(html).toMatch(
      /href="https:\/\/www\.google\.com\/maps\/search\/[^"]*" target="_blank" rel="noopener">.*Cómo llegar<span class="oculto">[^<]*pestaña nueva/,
    )
  })

  it('el mapa es una fachada: foto diferida, pin y botón, sin cargar Google Maps', () => {
    const html = dibujar()

    expect(html).not.toContain('<iframe')
    expect(html).toMatch(/<img alt=""[^>]*fetchPriority="low"[^>]*loading="lazy"/)
    expect(html).toMatch(/<button type="button" class="boton boton-contacto">Ver mapa<span/)
    expect(html).toContain('<span class="oculto"> de la Sede San Isidro</span>')
  })

  it('sin foto ni textos de botones no los inventa', () => {
    const html = dibujar({ foto: null, textos: { comoLlegar: null, verMapa: null } })

    expect(html).not.toContain('<img')
    expect(html).not.toContain('Cómo llegar')
    expect(html).not.toContain('<button type="button" class="boton')
  })

  it('una sede sin WhatsApp ni celular solo ofrece cómo llegar', () => {
    const html = dibujar({ sedes: [sede('San Isidro', { whatsapp: null, llamada: null })] })

    expect(html).not.toContain('wa.me')
    expect(html).not.toContain('tel:')
    expect(html).toContain('Cómo llegar')
  })

  it('sin sedes no dibuja nada', () => {
    expect(dibujar({ sedes: [] })).toBe('')
  })
})
