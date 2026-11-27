import { describe, expect, it } from 'vitest'

import {
  fechaIsoEnLima,
  fechaLargaEnLima,
  fechaRelativa,
  horaEnLima,
  saludoSegunHora,
} from './fechas-del-panel'

// Lima está en UTC−5 todo el año (sin horario de verano).
const EN_LIMA = (iso: string) => new Date(`${iso}-05:00`)

describe('saludoSegunHora', () => {
  it.each([
    [0, 'Buenos días'],
    [11, 'Buenos días'],
    [12, 'Buenas tardes'],
    [18, 'Buenas tardes'],
    [19, 'Buenas noches'],
    [23, 'Buenas noches'],
  ])('a las %i h dice «%s»', (hora, saludo) => {
    expect(saludoSegunHora(hora)).toBe(saludo)
  })
})

describe('horaEnLima', () => {
  it('usa la hora de Lima aunque el servidor esté en UTC', () => {
    expect(horaEnLima(new Date('2026-11-27T03:30:00Z'))).toBe(22)
    expect(horaEnLima(new Date('2026-11-27T17:00:00Z'))).toBe(12)
  })
})

describe('fechaLargaEnLima', () => {
  it('escribe el día de la semana con mayúscula inicial, el día, el mes y el año', () => {
    expect(fechaLargaEnLima(EN_LIMA('2026-11-27T09:00:00'))).toBe(
      'Viernes, 27 de noviembre de 2026',
    )
  })

  it('cambia de día según Lima, no según UTC', () => {
    expect(fechaLargaEnLima(new Date('2026-11-28T03:00:00Z'))).toBe(
      'Viernes, 27 de noviembre de 2026',
    )
  })
})

describe('fechaIsoEnLima', () => {
  it('devuelve AAAA-MM-DD del día en Lima', () => {
    expect(fechaIsoEnLima(new Date('2026-11-28T03:00:00Z'))).toBe('2026-11-27')
  })
})

describe('fechaRelativa', () => {
  const AHORA = EN_LIMA('2026-11-27T15:00:00')

  it('dice «Hoy» con la hora en 24 horas para el mismo día', () => {
    expect(fechaRelativa(EN_LIMA('2026-11-27T09:05:00'), AHORA)).toBe('Hoy, 09:05')
  })

  it('dice «Ayer» para el día anterior', () => {
    expect(fechaRelativa(EN_LIMA('2026-11-26T18:03:00'), AHORA)).toBe('Ayer, 18:03')
  })

  it('escribe el día y el mes abreviado para fechas anteriores', () => {
    expect(fechaRelativa(EN_LIMA('2026-11-20T16:20:00'), AHORA)).toMatch(/^20 nov\.?, 16:20$/)
  })
})
