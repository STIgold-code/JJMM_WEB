import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { QuienesSomos } from './quienes-somos'

const dibujar = () =>
  renderToStaticMarkup(
    <QuienesSomos
      ancla="quienes-somos"
      idDelTitulo="titulo-quienes-somos"
      titulo="Quiénes somos"
      cifras={[
        { prefijo: 'Más de', valor: 100, sufijo: null, descripcion: 'clientes de outsourcing' },
        { prefijo: 'Más de', valor: 10, sufijo: 'años', descripcion: 'de experiencia' },
      ]}
      parrafos={[
        [
          { texto: 'Somos el ', resaltado: false },
          { texto: 'Estudio Contable JJMM S.A.C.', resaltado: true },
        ],
      ]}
    />,
  )

describe('QuienesSomos', () => {
  it('es la sección del ancla, nombrada por su título oculto', () => {
    const html = dibujar()

    expect(html).toMatch(
      /^<section class="[^"]*" id="quienes-somos" aria-labelledby="titulo-quienes-somos">/,
    )
    expect(html).toContain('<h2 class="oculto" id="titulo-quienes-somos">Quiénes somos</h2>')
  })

  it('anima cada cifra desde cero y deja el número real para lectores de pantalla', () => {
    const html = dibujar()

    expect(html).toContain(
      'style="--meta:100" aria-hidden="true"></span><span class="oculto">100</span></b>',
    )
    expect(html).toContain('<span class="oculto">10</span> años</b>')
  })

  it('escalona los círculos a 0,2 s y el texto entra desde la derecha', () => {
    const html = dibujar()

    expect(html).toContain('style="--retraso:0.2s"')
    expect(html).toContain('style="--retraso:0.4s"')
    expect(html).toMatch(
      /<p class="[^"]* revelar desde-derecha">Somos el <strong>Estudio Contable JJMM S\.A\.C\.<\/strong><\/p>/,
    )
  })
})
