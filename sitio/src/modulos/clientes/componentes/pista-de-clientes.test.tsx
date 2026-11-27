import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { PistaDeClientes } from './pista-de-clientes'

describe('PistaDeClientes', () => {
  it('es una lista nombrada y enfocable para desplazarla con el teclado', () => {
    const html = renderToStaticMarkup(
      <PistaDeClientes etiqueta="Algunos de nuestros clientes">
        <li>Cadex</li>
      </PistaDeClientes>,
    )

    expect(html).toMatch(
      /<ul class="[^"]*" aria-label="Algunos de nuestros clientes" tabindex="0"><li>Cadex<\/li><\/ul>/,
    )
  })

  it('ofrece flechas con nombre y desactiva la anterior al inicio', () => {
    const html = renderToStaticMarkup(
      <PistaDeClientes etiqueta="Clientes">
        <li>Cadex</li>
      </PistaDeClientes>,
    )

    expect(html).toMatch(/<button type="button" disabled="">.*Clientes anteriores/)
    expect(html).toContain('<span class="oculto">Más clientes</span>')
  })
})
