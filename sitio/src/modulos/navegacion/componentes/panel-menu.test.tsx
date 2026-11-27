import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { PanelMenu } from './panel-menu'

const PROPS = {
  id: 'panel-menu',
  alCerrar: () => undefined,
  items: [
    {
      etiqueta: 'Servicios',
      href: '/#servicios',
      seccion: 'servicios',
      externo: false,
      nuevaPestana: false,
      imagen: null,
    },
  ],
  actualDe: () => undefined,
  whatsapp: { texto: '951 965 242', href: 'https://wa.me/51951965242' },
  textoDeWhatsApp: 'Escríbenos por WhatsApp',
}

describe('PanelMenu', () => {
  it('es un diálogo modal con nombre y un botón de cerrar con texto accesible', () => {
    const html = renderToStaticMarkup(<PanelMenu {...PROPS} abierto />)

    expect(html).toContain('role="dialog" aria-modal="true" aria-label="Menú"')
    expect(html).toContain('<span class="oculto">Cerrar menú</span>')
    expect(html).toContain('aria-label="Principal en el celular"')
  })

  it('cerrado queda inerte para el teclado y los lectores de pantalla', () => {
    expect(renderToStaticMarkup(<PanelMenu {...PROPS} abierto={false} />)).toMatch(
      /^<div id="panel-menu" class="[^"]*" inert="">/,
    )
    expect(renderToStaticMarkup(<PanelMenu {...PROPS} abierto />)).not.toContain('inert')
  })

  it('termina con el botón de WhatsApp de la configuración', () => {
    const html = renderToStaticMarkup(<PanelMenu {...PROPS} abierto />)

    expect(html).toContain('href="https://wa.me/51951965242"')
    expect(html).toContain('Escríbenos por WhatsApp</a>')
  })

  it('omite el botón de WhatsApp si no hay configuración', () => {
    const html = renderToStaticMarkup(<PanelMenu {...PROPS} abierto whatsapp={null} />)

    expect(html).not.toContain('wa.me')
  })
})
