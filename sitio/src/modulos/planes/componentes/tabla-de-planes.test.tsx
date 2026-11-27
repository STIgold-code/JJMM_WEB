import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import type { PlanDeLaTabla } from './partes-de-la-tabla'
import { TablaDePlanes } from './tabla-de-planes'

const PLANES: PlanDeLaTabla[] = [
  { nombre: 'Emprende', enlace: 'https://wa.me/51951965242?text=Emprende' },
  { nombre: 'SIGEMype I', enlace: 'https://wa.me/51951965242?text=I' },
]

const dibujar = (planes = PLANES) =>
  renderToStaticMarkup(
    <TablaDePlanes
      encabezado="Qué incluye"
      textoDelBoton="Solicitar"
      planes={planes}
      filas={[
        {
          caracteristica: 'Gestión de planilla hasta',
          celdas: [
            { tipo: 'texto', texto: '2 trabajadores' },
            { tipo: 'texto', texto: 'Consultar' },
          ],
        },
        { caracteristica: 'Libro Bancos', celdas: [{ tipo: 'no-incluido' }, { tipo: 'incluido' }] },
      ]}
    />,
  )

describe('TablaDePlanes', () => {
  it('compara los planes en una tabla con encabezados de columna y de fila', () => {
    const html = dibujar()

    // El nombre de la tabla no repite el de la sección: dos regiones con el mismo nombre
    // se confunden en un lector de pantalla.
    expect(html).toContain('role="region" aria-label="Tabla comparativa de planes"')
    expect(html).not.toContain('aria-label="Nuestros planes"')
    expect(html).toContain('<th scope="col">Qué incluye</th>')
    expect(html).toMatch(/<th scope="col"[^>]*>SIGEMype I<\/th>/)
    expect(html).toContain('<th scope="row">Gestión de planilla hasta</th>')
    expect(html).toMatch(/<td[^>]*>Consultar<\/td>/)
  })

  it('anuncia lo incluido y lo no incluido a los lectores de pantalla', () => {
    const html = dibujar()

    expect(html).toContain('<span class="oculto">No incluido</span>')
    expect(html).toContain('<span class="oculto">Incluido</span>')
  })

  it('en el celular muestra el primer plan elegido y oculta los demás', () => {
    const html = dibujar()

    expect(html).toMatch(/aria-pressed="true">Emprende<\/button>/)
    expect(html).toMatch(/aria-pressed="false">SIGEMype I<\/button>/)
    expect(html).toMatch(/<th scope="col">Emprende<\/th><th scope="col" class="[^"]+">SIGEMype I/)
  })

  it('ofrece solicitar cada plan por WhatsApp', () => {
    expect(dibujar()).toContain(
      '<a class="boton boton-contacto" href="https://wa.me/51951965242?text=Emprende">Solicitar<span class="oculto"> el plan Emprende</span></a>',
    )
  })

  it('sin enlaces de contacto no dibuja la fila de botones', () => {
    expect(dibujar(PLANES.map((plan) => ({ ...plan, enlace: null })))).not.toContain('<tfoot>')
  })
})
