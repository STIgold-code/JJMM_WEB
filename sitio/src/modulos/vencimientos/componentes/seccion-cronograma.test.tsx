import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import type { CronogramaSunatPublico, PeriodoPublico } from '../aplicacion/obtener-cronograma-sunat'
import { SeccionCronograma } from './seccion-cronograma'

// Fechas de ejemplo para las pruebas, no un cronograma oficial.
const periodo = (clave: string, nombre: string): PeriodoPublico => ({
  clave,
  periodo: nombre,
  fechas: Array.from({ length: 10 }, (_, digito) => ({
    digito,
    fecha: `2026-02-${String(12 + digito).padStart(2, '0')}`,
    texto: `fecha ${digito} de ${nombre}`,
  })),
  buenosContribuyentes: 'lunes, 23 de febrero de 2026',
})

const dibujar = (cronograma: CronogramaSunatPublico) =>
  renderToStaticMarkup(<SeccionCronograma titulo="Cronograma de SUNAT" cronograma={cronograma} />)

const CON_PERIODOS: CronogramaSunatPublico = {
  anio: 2026,
  periodos: [periodo('2025-12', 'Diciembre 2025'), periodo('2026-01', 'Enero 2026')],
  claveVigente: '2026-01',
}

describe('SeccionCronograma', () => {
  it('es una sección con nombre accesible y su título', () => {
    const html = dibujar(CON_PERIODOS)

    expect(html).toMatch(/<section id="cronograma"[^>]*aria-labelledby="titulo-cronograma"/)
    expect(html).toContain('Cronograma de SUNAT</h2>')
  })

  it('sin cronograma del año, explica que falta en lugar de la consulta', () => {
    const html = dibujar({ anio: 2026, periodos: [], claveVigente: null })

    expect(html).toContain('Todavía no publicamos el cronograma de SUNAT de 2026.')
    expect(html).not.toContain('<form')
  })

  it('abre la consulta en el periodo vigente, con todos los periodos para elegir', () => {
    const html = dibujar(CON_PERIODOS)

    expect(html).toContain('<option value="2025-12">Diciembre 2025</option>')
    expect(html).toMatch(/<option value="2026-01" selected="">Enero 2026<\/option>/)
    expect(html).toContain('Fechas de vencimiento del periodo Enero 2026')
  })

  it('etiqueta el campo del RUC y lo describe con su ayuda', () => {
    const html = dibujar(CON_PERIODOS)

    expect(html).toContain('<label for="consulta-ruc">Tu RUC</label>')
    expect(html).toMatch(/<input[^>]*id="consulta-ruc"[^>]*aria-describedby="consulta-ruc-ayuda"/)
    expect(html).not.toContain('aria-invalid')
  })

  it('deja lista una región de estado para anunciar el resultado', () => {
    expect(dibujar(CON_PERIODOS)).toMatch(/<p class="[^"]*" role="status"><\/p>/)
  })

  it('muestra la tabla de los diez dígitos y la fecha de buenos contribuyentes', () => {
    const html = dibujar(CON_PERIODOS)

    expect(html.match(/<th scope="row">/g)).toHaveLength(10)
    expect(html).toContain('<td>fecha 9 de Enero 2026</td>')
    expect(html).toContain('Buenos contribuyentes y UESP: lunes, 23 de febrero de 2026.')
  })
})
