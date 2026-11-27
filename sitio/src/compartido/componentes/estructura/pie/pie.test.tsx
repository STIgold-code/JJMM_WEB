import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import type { SedePublica } from '@/modulos/sedes/dominio/sede'

import { Pie } from './pie'

const sede = (nombre: string): SedePublica => ({
  nombre,
  direccion: 'Jr. Iquitos 593',
  localidad: 'San Martín de Porres, Lima',
  celulares: [
    { texto: '951 965 242', href: 'tel:+51951965242' },
    { texto: '952 249 102', href: 'tel:+51952249102' },
  ],
  correo: { texto: 'contabilidad@jjmm.com.pe', href: 'mailto:contabilidad@jjmm.com.pe' },
})

const LOGO = { url: '/api/medios/file/logo-jjmm.png', alt: 'JJMM', ancho: 223, alto: 125 }

const dibujar = (sedes: SedePublica[]) =>
  renderToStaticMarkup(
    <Pie sedes={sedes} logo={LOGO} lema="Cada empresa guiada…" legal="© 2026 JJMM S.A.C." />,
  )

describe('Pie', () => {
  it('es el contentinfo de la página y entra con la aparición al hacer scroll', () => {
    const html = dibujar([sede('Sede San Martín de Porres')])

    expect(html).toMatch(/^<footer class="[^"]* oscuro">/)
    expect(html).toContain('<div class="contenedor revelar">')
  })

  it('reparte las sedes a ambos lados del logo, en orden', () => {
    const html = dibujar([sede('Sede San Martín de Porres'), sede('Sede San Isidro')])
    const logo = html.indexOf('alt="JJMM"')

    expect(html.indexOf('Sede San Martín de Porres')).toBeLessThan(logo)
    expect(html.indexOf('Sede San Isidro')).toBeGreaterThan(logo)
  })

  it('publica solo celulares con enlace de llamada y el correo de la sede', () => {
    const html = dibujar([sede('Sede San Isidro')])

    expect(html).toContain('<a href="tel:+51951965242">951 965 242</a> · ')
    expect(html).toContain('<a href="mailto:contabilidad@jjmm.com.pe">')
    expect(html).not.toMatch(/tel:\+511/)
  })

  it('muestra el lema y el texto legal', () => {
    const html = dibujar([])

    expect(html).toContain('<p>Cada empresa guiada…</p>')
    expect(html).toContain('© 2026 JJMM S.A.C.')
  })
})
