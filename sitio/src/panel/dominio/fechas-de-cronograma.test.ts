import { describe, expect, it } from 'vitest'

import {
  diaDelInstante,
  instanteDelDia,
  leerFechaDelFormulario,
  rangoDeFechas,
} from './fechas-de-cronograma'

describe('leerFechaDelFormulario', () => {
  it('acepta solo días de calendario que existen, como AAAA-MM-DD', () => {
    expect(leerFechaDelFormulario('2026-02-13')).toBe('2026-02-13')
    expect(leerFechaDelFormulario('2028-02-29')).toBe('2028-02-29')
    for (const valor of [
      '2026-02-30',
      '2026-13-01',
      '2026-2-13',
      '13/02/2026',
      '2026-02-13T00:00:00Z',
      ' 2026-02-13',
      '1999-12-31',
      20260213,
      null,
    ])
      expect(leerFechaDelFormulario(valor)).toBeNull()
  })
})

describe('instanteDelDia y diaDelInstante', () => {
  it('guarda el mediodía de Lima, así el día no se corre al leerlo en Lima ni en UTC', () => {
    expect(instanteDelDia('2026-02-13')).toBe('2026-02-13T17:00:00.000Z')
  })

  it('el día vuelve igual, también en los bordes de mes y de año', () => {
    for (const dia of ['2026-01-01', '2026-02-28', '2026-12-31', '2028-02-29'])
      expect(diaDelInstante(instanteDelDia(dia))).toBe(dia)
  })

  it('lee como día de Lima lo que guardó el /admin (mediodía o medianoche UTC)', () => {
    expect(diaDelInstante('2026-02-13T12:00:00.000Z')).toBe('2026-02-13')
    expect(diaDelInstante('2026-02-13T05:00:00.000Z')).toBe('2026-02-13')
  })
})

describe('rangoDeFechas', () => {
  it('nombra la primera y la última fecha sin correrlas por la zona horaria', () => {
    expect(rangoDeFechas(['2026-02-24', '2026-02-13', '2026-02-20'])).toBe(
      'Del 13 de febrero al 24 de febrero de 2026',
    )
  })

  it('una sola fecha o ninguna', () => {
    expect(rangoDeFechas(['2026-01-01'])).toBe('El 1 de enero de 2026')
    expect(rangoDeFechas([])).toBe('Sin fechas')
  })
})
