import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { EncabezadoDeSeccion, idDeTitulo } from './encabezado-de-seccion'

describe('EncabezadoDeSeccion', () => {
  it('dibuja el título con su id y la bajada, ambos con aparición al hacer scroll', () => {
    const html = renderToStaticMarkup(
      <EncabezadoDeSeccion id="titulo-planes" titulo="Nuestros planes" bajada="Compara." />,
    )

    expect(html).toMatch(/^<h2 id="titulo-planes" class="[^"]* revelar">Nuestros planes<\/h2>/)
    expect(html).toMatch(/<p class="[^"]* revelar">Compara\.<\/p>$/)
  })

  it('omite la bajada vacía', () => {
    const html = renderToStaticMarkup(<EncabezadoDeSeccion id="t" titulo="Clientes" bajada="" />)

    expect(html).not.toContain('<p')
  })
})

describe('idDeTitulo', () => {
  it('usa el ancla de la sección o, sin ella, el tipo del bloque', () => {
    expect(idDeTitulo('planes', 'nuestros-planes')).toBe('titulo-nuestros-planes')
    expect(idDeTitulo('clientes', '')).toBe('titulo-clientes')
    expect(idDeTitulo('clientes', null)).toBe('titulo-clientes')
  })
})
