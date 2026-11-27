import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { CampoDeFormulario } from './campo-de-formulario'

describe('CampoDeFormulario', () => {
  it('marca el campo inválido y enlaza su error con aria-describedby', () => {
    const html = renderToStaticMarkup(
      <CampoDeFormulario campo="celular" etiqueta="Celular" prefijo="f" error="Escribe un celular.">
        {(props) => <input {...props} />}
      </CampoDeFormulario>,
    )

    expect(html).toContain('<label for="f-celular">Celular</label><input id="f-celular"')
    expect(html).toContain('aria-invalid="true" aria-describedby="f-celular-error"')
    expect(html).toContain('name="celular"')
    expect(html).toMatch(/<span class="[^"]*" id="f-celular-error">Escribe un celular\.<\/span>/)
  })
})
