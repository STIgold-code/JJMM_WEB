import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { EncabezadoDeGuia } from './encabezado-de-guia'

describe('EncabezadoDeGuia', () => {
  it('pone el título como único h1, con entrada lateral', () => {
    const html = renderToStaticMarkup(
      <EncabezadoDeGuia titulo="Guía de clientes" introduccion={null} />,
    )

    expect(html.match(/<h1/g)).toHaveLength(1)
    expect(html).toMatch(/<h1 class="[^"]*revelar desde-izquierda">Guía de clientes<\/h1>/)
  })

  it('muestra la introducción solo si el panel la tiene', () => {
    const con = renderToStaticMarkup(
      <EncabezadoDeGuia titulo="Guía" introduccion="Lo que debes enviar y cuándo." />,
    )
    const sin = renderToStaticMarkup(<EncabezadoDeGuia titulo="Guía" introduccion={null} />)

    expect(con).toContain('Lo que debes enviar y cuándo.</p>')
    expect(sin).not.toContain('<p')
  })
})
