import { describe, expect, it } from 'vitest'

import { formatearFechaDePublicacion } from './fecha-de-publicacion'

describe('formatearFechaDePublicacion', () => {
  it('escribe la fecha larga en español de Perú', () => {
    expect(formatearFechaDePublicacion('2026-11-27T15:00:00.000Z')).toEqual({
      texto: '27 de noviembre de 2026',
      iso: '2026-11-27',
    })
  })

  it('usa la hora de Lima, no la del servidor (UTC)', () => {
    // 1 de diciembre a las 02:00 UTC todavía es 30 de noviembre en Lima (UTC−5).
    expect(formatearFechaDePublicacion('2026-12-01T02:00:00.000Z')).toEqual({
      texto: '30 de noviembre de 2026',
      iso: '2026-11-30',
    })
  })

  it('devuelve null si la fecha no es válida', () => {
    expect(formatearFechaDePublicacion('no es una fecha')).toBeNull()
  })
})
