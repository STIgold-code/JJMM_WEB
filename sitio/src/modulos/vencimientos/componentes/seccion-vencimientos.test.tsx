import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { agruparPorPeriodicidad, type Vencimiento } from '../dominio/vencimiento'
import { SeccionVencimientos } from './seccion-vencimientos'

const VENCIMIENTOS: Vencimiento[] = [
  {
    obligacion: 'PDT 621 (IGV y Renta)',
    periodicidad: 'mensual',
    cuandoVence: 'Los 07 de cada mes.',
    nota: null,
  },
  {
    obligacion: 'DAOT',
    periodicidad: 'anual',
    cuandoVence: 'Inicia la declaración el 01 de marzo.',
    nota: 'Solo si superas el monto que fija SUNAT.',
  },
]

const dibujar = (vencimientos: Vencimiento[]) =>
  renderToStaticMarkup(
    <SeccionVencimientos
      titulo="Vencimientos tributarios"
      grupos={agruparPorPeriodicidad(vencimientos)}
    />,
  )

describe('SeccionVencimientos', () => {
  it('es una sección con nombre accesible y su título', () => {
    const html = dibujar(VENCIMIENTOS)

    expect(html).toMatch(/<section id="vencimientos"[^>]*aria-labelledby="titulo-vencimientos"/)
    expect(html).toContain('Vencimientos tributarios</h2>')
  })

  it('agrupa en mensuales y anuales, cada grupo con su título', () => {
    const html = dibujar(VENCIMIENTOS)

    expect(html).toMatch(/<h3 id="vencimientos-mensual"[^>]*>Mensuales<\/h3>/)
    expect(html).toMatch(/<h3 id="vencimientos-anual"[^>]*>Anuales<\/h3>/)
    expect(html.indexOf('Mensuales')).toBeLessThan(html.indexOf('Anuales'))
  })

  it('pone cada obligación y cuándo vence en una lista de descripciones', () => {
    const html = dibujar(VENCIMIENTOS)

    expect(html).toContain('<dt>PDT 621 (IGV y Renta)</dt><dd>Los 07 de cada mes.</dd>')
  })

  it('muestra la nota solo cuando existe', () => {
    const html = dibujar(VENCIMIENTOS)

    expect(html).toContain('Solo si superas el monto que fija SUNAT.')
    expect(html.match(/class="[^"]*nota/g)).toHaveLength(1)
  })

  it('no se dibuja si no hay vencimientos', () => {
    expect(dibujar([])).toBe('')
  })
})
