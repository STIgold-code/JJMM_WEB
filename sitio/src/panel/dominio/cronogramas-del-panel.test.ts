import { describe, expect, it } from 'vitest'

import {
  type CronogramaDelPanel,
  digitosQueFaltan,
  formularioDeCronograma,
  hayCambiosEnElCronograma,
  secundarioDeCronograma,
} from './cronogramas-del-panel'

const FECHAS = Array.from({ length: 10 }, (_, digito) => ({
  digito,
  fecha: `2026-02-${String(13 + digito).padStart(2, '0')}`,
}))

const CRONOGRAMA: CronogramaDelPanel = {
  id: 4,
  anio: 2026,
  mes: 1,
  periodo: 'Enero 2026',
  fechas: FECHAS,
  buenosContribuyentes: '2026-02-26',
}

describe('formularioDeCronograma', () => {
  it('pone cada fecha en la posición de su dígito', () => {
    const desordenado = { ...CRONOGRAMA, fechas: [...FECHAS].reverse() }
    expect(formularioDeCronograma(desordenado, 2026)).toEqual({
      anio: '2026',
      mes: '1',
      fechas: FECHAS.map((f) => f.fecha),
      buenosContribuyentes: '2026-02-26',
    })
  })

  it('uno nuevo propone el año en curso y deja el resto vacío', () => {
    expect(formularioDeCronograma(null, 2027)).toEqual({
      anio: '2027',
      mes: '',
      fechas: Array.from({ length: 10 }, () => ''),
      buenosContribuyentes: '',
    })
  })

  it('un dígito que falta en lo guardado queda vacío para completarlo', () => {
    const incompleto = { ...CRONOGRAMA, fechas: FECHAS.slice(0, 8) }
    expect(formularioDeCronograma(incompleto, 2026).fechas.slice(7)).toEqual(['2026-02-20', '', ''])
  })

  it('detecta cambios en cualquier fecha', () => {
    const original = formularioDeCronograma(CRONOGRAMA, 2026)
    const fechas = [...original.fechas]
    expect(hayCambiosEnElCronograma(original, { ...original, fechas })).toBe(false)
    fechas[5] = '2026-03-01'
    expect(hayCambiosEnElCronograma(original, { ...original, fechas })).toBe(true)
  })
})

describe('estado de un cronograma guardado', () => {
  it('nombra los dígitos sin fecha', () => {
    expect(digitosQueFaltan(CRONOGRAMA.fechas)).toEqual([])
    expect(digitosQueFaltan(FECHAS.slice(2))).toEqual([0, 1])
  })

  it('el dato secundario dice desde cuándo y hasta cuándo vence', () => {
    expect(secundarioDeCronograma(CRONOGRAMA)).toBe('Del 13 de febrero al 22 de febrero de 2026')
  })
})
