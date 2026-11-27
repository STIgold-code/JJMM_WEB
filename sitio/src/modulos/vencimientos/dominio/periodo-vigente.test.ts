import { describe, expect, it } from 'vitest'

import {
  claveDelPeriodo,
  type CronogramaDelPeriodo,
  cronogramasDelAnio,
  esCronogramaCompleto,
  periodoVigente,
} from './periodo-vigente'

// Fechas de ejemplo para las pruebas, no un cronograma oficial.
const cronograma = (anio: number, mes: number, vencen: string[]): CronogramaDelPeriodo => ({
  anio,
  mes,
  periodo: `Periodo ${mes}/${anio}`,
  fechas: vencen.map((fecha, digito) => ({ digito, fecha })),
  fechaBuenosContribuyentes: null,
})

const DICIEMBRE_2025 = cronograma(2025, 12, ['2026-01-14', '2026-01-23'])
const NOVIEMBRE_2025 = cronograma(2025, 11, ['2025-12-12', '2025-12-19'])
const ENERO_2026 = cronograma(2026, 1, ['2026-02-13', '2026-02-20'])
const FEBRERO_2026 = cronograma(2026, 2, ['2026-03-13', '2026-03-20'])

describe('claveDelPeriodo', () => {
  it('identifica el periodo como AAAA-MM', () => {
    expect(claveDelPeriodo(2026, 1)).toBe('2026-01')
    expect(claveDelPeriodo(2025, 12)).toBe('2025-12')
  })
})

describe('cronogramasDelAnio', () => {
  it('deja los periodos del año y el diciembre anterior, que vence en enero', () => {
    const delAnio = cronogramasDelAnio([NOVIEMBRE_2025, DICIEMBRE_2025, ENERO_2026], 2026)

    expect(delAnio).toEqual([DICIEMBRE_2025, ENERO_2026])
  })

  it('los ordena del periodo más antiguo al más reciente', () => {
    const delAnio = cronogramasDelAnio([FEBRERO_2026, DICIEMBRE_2025, ENERO_2026], 2026)

    expect(delAnio.map((c) => claveDelPeriodo(c.anio, c.mes))).toEqual([
      '2025-12',
      '2026-01',
      '2026-02',
    ])
  })

  it('devuelve una lista vacía si el año no tiene cronogramas', () => {
    expect(cronogramasDelAnio([NOVIEMBRE_2025], 2026)).toEqual([])
  })
})

describe('esCronogramaCompleto', () => {
  it('exige una fecha por cada dígito del 0 al 9', () => {
    const completo = cronograma(
      2026,
      3,
      Array.from({ length: 10 }, () => '2026-04-15'),
    )

    expect(esCronogramaCompleto(completo)).toBe(true)
    expect(esCronogramaCompleto(ENERO_2026)).toBe(false)
  })
})

describe('periodoVigente', () => {
  const CRONOGRAMAS = [DICIEMBRE_2025, ENERO_2026, FEBRERO_2026]

  it('elige el primer periodo que todavía tiene fechas por vencer', () => {
    expect(periodoVigente(CRONOGRAMAS, '2026-02-01')).toBe(ENERO_2026)
  })

  it('mantiene el periodo mientras vence su última fecha, ese mismo día incluido', () => {
    expect(periodoVigente(CRONOGRAMAS, '2026-01-23')).toBe(DICIEMBRE_2025)
    expect(periodoVigente(CRONOGRAMAS, '2026-01-24')).toBe(ENERO_2026)
  })

  it('elige el más reciente si todos ya vencieron', () => {
    expect(periodoVigente(CRONOGRAMAS, '2026-12-31')).toBe(FEBRERO_2026)
  })

  it('devuelve null si no hay cronogramas', () => {
    expect(periodoVigente([], '2026-02-01')).toBeNull()
  })
})
