import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { PanelDeArea } from './panel-de-area'
import { type PestanaDeArea, PestanasDeServicios } from './pestanas-de-servicios'

const area = (codigo: string, gajo: string | null): PestanaDeArea => ({
  codigo,
  nombreCorto: `Área ${codigo}`,
  gajo,
  panel: <p>Detalle {codigo}</p>,
})

const dibujar = () =>
  renderToStaticMarkup(
    <PestanasDeServicios
      areas={[area('P1', '1,1 2,2 3,3'), area('P2', null)]}
      rueda={<span>Rueda</span>}
      etiqueta="Áreas de servicio"
    />,
  )

describe('PestanasDeServicios', () => {
  it('sigue el patrón de pestañas: una seleccionada y en el orden de tabulación', () => {
    const html = dibujar()

    expect(html).toContain('role="tablist" aria-label="Áreas de servicio"')
    expect(html).toMatch(
      /role="tab" id="([^"]+)-pestana-0" aria-controls="\1-panel-0" aria-selected="true" tabindex="0"><b>P1<\/b><span>Área P1<\/span>/,
    )
    expect(html).toMatch(/aria-selected="false" tabindex="-1"><b>P2<\/b>/)
  })

  it('muestra solo el panel de la pestaña activa', () => {
    const html = dibujar()

    expect(html).toMatch(
      /role="tabpanel"[^>]*-panel-0" aria-labelledby="[^"]*-pestana-0" tabindex="0" class="[^"]*"><p>Detalle P1/,
    )
    expect(html).toMatch(/-panel-1"[^>]*hidden=""[^>]*><p>Detalle P2/)
  })

  it('dibuja sobre la rueda solo los gajos que existen, ocultos para lectores de pantalla', () => {
    const html = dibujar()

    expect(html).toContain('<svg viewBox="0 0 500 550" aria-hidden="true" focusable="false">')
    expect(html.match(/<polygon/g)).toHaveLength(1)
  })

  it('entra la rueda desde la izquierda y las pestañas desde la derecha', () => {
    const html = dibujar()

    expect(html).toContain('revelar desde-izquierda')
    expect(html).toContain('revelar desde-derecha" style="--retraso:0.1s"')
  })
})

describe('PanelDeArea', () => {
  it('dibuja código, nombre, puntos y la consulta por WhatsApp', () => {
    const html = renderToStaticMarkup(
      <PanelDeArea
        area={{ codigo: 'P1', nombre: 'Legal', descripcion: 'Asesoría.', puntos: ['Contratos'] }}
        consulta={{
          href: 'https://wa.me/51951965242?text=Legal',
          texto: 'Consultar este servicio',
        }}
      />,
    )

    expect(html).toContain('<h3><span>P1:</span>Legal</h3>')
    expect(html).toContain('</svg>Contratos</li>')
    expect(html).toContain(
      '<a class="boton boton-azul" href="https://wa.me/51951965242?text=Legal">',
    )
    expect(html).toContain('Consultar este servicio<span class="oculto">: Legal</span>')
  })
})
