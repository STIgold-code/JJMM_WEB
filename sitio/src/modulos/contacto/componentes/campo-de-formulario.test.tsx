import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { CampoDeFormulario } from './campo-de-formulario'

describe('CampoDeFormulario', () => {
  it('marca el campo inválido y enlaza su error con aria-describedby', () => {
    const html = renderToStaticMarkup(
      <CampoDeFormulario campo="nombre" etiqueta="Nombre" prefijo="f" error="Escribe tu nombre.">
        {(props) => <input {...props} />}
      </CampoDeFormulario>,
    )

    expect(html).toContain('<label for="f-nombre">Nombre</label><input id="f-nombre"')
    expect(html).toContain('aria-invalid="true" aria-describedby="f-nombre-error"')
    expect(html).toContain('name="nombre"')
    expect(html).toMatch(/<span class="[^"]*" id="f-nombre-error">Escribe tu nombre\.<\/span>/)
  })
})
