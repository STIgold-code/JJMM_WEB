import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { BotonWhatsApp } from './boton-whatsapp'

describe('BotonWhatsApp', () => {
  it('enlaza al chat con el texto de la configuración y un nombre accesible completo', () => {
    const html = renderToStaticMarkup(
      <BotonWhatsApp href="https://wa.me/51951965242?text=Hola" texto="Escríbenos" />,
    )

    expect(html).toContain('href="https://wa.me/51951965242?text=Hola"')
    expect(html).toContain('>Escríbenos</span>')
    expect(html).toContain('<span class="oculto"> por WhatsApp</span>')
  })
})
