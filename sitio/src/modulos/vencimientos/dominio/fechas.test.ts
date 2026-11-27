import { describe, expect, it } from 'vitest'

import { diaEnLima, formatearFecha } from './fechas'

describe('diaEnLima', () => {
  it('usa el día de Lima (UTC-5), no el del servidor', () => {
    expect(diaEnLima(new Date('2026-02-01T03:00:00Z'))).toBe('2026-01-31')
    expect(diaEnLima(new Date('2026-02-01T05:00:00Z'))).toBe('2026-02-01')
  })

  it('lee una fecha guardada a cualquier hora del día de Lima como ese día', () => {
    expect(diaEnLima(new Date('2026-02-13T05:00:00.000Z'))).toBe('2026-02-13')
    expect(diaEnLima(new Date('2026-02-13T17:00:00.000Z'))).toBe('2026-02-13')
  })
})

describe('formatearFecha', () => {
  it('escribe la fecha completa en español, con el día de la semana', () => {
    expect(formatearFecha('2026-02-13')).toBe('viernes, 13 de febrero de 2026')
  })

  it('no corre la fecha un día por la zona horaria', () => {
    expect(formatearFecha('2026-03-01')).toBe('domingo, 1 de marzo de 2026')
  })

  it('lanza un error si la fecha no es AAAA-MM-DD', () => {
    expect(() => formatearFecha('13/02/2026')).toThrow(/13\/02\/2026/)
  })
})
