import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { PorQueElegirnos } from './por-que-elegirnos'

describe('PorQueElegirnos', () => {
  it('es una sección oscura con su título y cada valor con su ícono, escalonados', () => {
    const html = renderToStaticMarkup(
      <PorQueElegirnos
        ancla={null}
        idDelTitulo="titulo-por-que-elegirnos"
        titulo="¿Por qué elegirnos?"
        bajada="Razones."
        valores={[
          { nombre: 'Excelencia', icono: 'pulgar' },
          { nombre: 'Compromiso', icono: 'trofeo' },
        ]}
      />,
    )

    expect(html).toMatch(
      /^<section class="[^"]* oscuro" aria-labelledby="titulo-por-que-elegirnos">/,
    )
    expect(html).toContain('<use href="#i-pulgar"></use>')
    expect(html).toContain('Excelencia</span>')
    expect(html).toContain('style="--retraso:0.08s"')
  })
})
