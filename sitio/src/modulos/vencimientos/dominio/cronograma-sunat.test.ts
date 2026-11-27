import { describe, expect, it } from 'vitest'

import {
  type FechaPorDigito,
  fechaDeVencimientoParaRuc,
  nombreDelPeriodo,
  validarFechasPorDigito,
} from './cronograma-sunat'
import { RucInvalidoError } from './ruc'

// Fechas de ejemplo para las pruebas, no un cronograma oficial.
const CRONOGRAMA_COMPLETO: FechaPorDigito[] = Array.from({ length: 10 }, (_, digito) => ({
  digito,
  fecha: `2026-02-${String(13 + digito).padStart(2, '0')}`,
}))

describe('validarFechasPorDigito', () => {
  it('acepta una fecha por cada dígito del 0 al 9', () => {
    expect(validarFechasPorDigito(CRONOGRAMA_COMPLETO)).toBeNull()
  })

  it('rechaza un cronograma al que le falta un dígito y dice cuál', () => {
    const sinElSiete = CRONOGRAMA_COMPLETO.filter((fila) => fila.digito !== 7)
    expect(validarFechasPorDigito(sinElSiete)).toMatch(/7/)
  })

  it('rechaza un dígito repetido', () => {
    const repetido = [...CRONOGRAMA_COMPLETO, { digito: 3, fecha: '2026-02-28' }]
    expect(validarFechasPorDigito(repetido)).toMatch(/3/)
  })

  it('rechaza dígitos fuera del rango 0 a 9', () => {
    const fuera = [...CRONOGRAMA_COMPLETO, { digito: 10, fecha: '2026-02-28' }]
    expect(validarFechasPorDigito(fuera)).toMatch(/0 al 9/)
  })
})

describe('nombreDelPeriodo', () => {
  it('nombra el periodo tributario con el mes en español y el año', () => {
    expect(nombreDelPeriodo(2026, 1)).toBe('Enero 2026')
    expect(nombreDelPeriodo(2025, 12)).toBe('Diciembre 2025')
  })

  it('lanza un error con un mes fuera de 1 a 12', () => {
    expect(() => nombreDelPeriodo(2026, 13)).toThrow(/13/)
  })
})

describe('fechaDeVencimientoParaRuc', () => {
  it('elige la fecha que corresponde al último dígito del RUC', () => {
    expect(fechaDeVencimientoParaRuc(CRONOGRAMA_COMPLETO, '20131312955')).toBe('2026-02-18')
    expect(fechaDeVencimientoParaRuc(CRONOGRAMA_COMPLETO, '10405678905')).toBe('2026-02-18')
  })

  it('lanza RucInvalidoError si el RUC no es válido', () => {
    expect(() => fechaDeVencimientoParaRuc(CRONOGRAMA_COMPLETO, '123')).toThrow(RucInvalidoError)
  })

  it('lanza un error si el cronograma no tiene el dígito', () => {
    const sinElCinco = CRONOGRAMA_COMPLETO.filter((fila) => fila.digito !== 5)
    expect(() => fechaDeVencimientoParaRuc(sinElCinco, '20131312955')).toThrow(/5/)
  })
})
