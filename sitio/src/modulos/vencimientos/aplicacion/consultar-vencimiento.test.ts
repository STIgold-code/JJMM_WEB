import { describe, expect, it } from 'vitest'

import { consultarVencimiento } from './consultar-vencimiento'
import type { PeriodoPublico } from './obtener-cronograma-sunat'

// Fechas de ejemplo para las pruebas, no un cronograma oficial.
const ENERO_2026: PeriodoPublico = {
  clave: '2026-01',
  periodo: 'Enero 2026',
  fechas: Array.from({ length: 10 }, (_, digito) => ({
    digito,
    fecha: `2026-02-${String(12 + digito).padStart(2, '0')}`,
    texto: `fecha del dígito ${digito}`,
  })),
  buenosContribuyentes: null,
}

describe('consultarVencimiento', () => {
  it('devuelve la fecha del último dígito de un RUC válido', () => {
    expect(consultarVencimiento(ENERO_2026, '20131312955')).toEqual({
      tipo: 'fecha',
      digito: 5,
      texto: 'fecha del dígito 5',
    })
  })

  it('acepta el RUC con espacios', () => {
    expect(consultarVencimiento(ENERO_2026, ' 20131 312955 ')).toMatchObject({ digito: 5 })
  })

  it.each([
    ['', 'vacio'],
    ['2013131295', 'formato'],
    ['20131312954', 'invalido'],
  ])('con «%s» devuelve el motivo «%s»', (ruc, motivo) => {
    expect(consultarVencimiento(ENERO_2026, ruc)).toEqual({ tipo: 'error', motivo })
  })
})
