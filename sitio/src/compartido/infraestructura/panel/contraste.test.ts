import { describe, expect, it } from 'vitest'

import { relacionDeContraste } from './contraste'

describe('relacionDeContraste (WCAG 2.1)', () => {
  it('da 21:1 entre blanco y negro, en cualquier orden', () => {
    expect(relacionDeContraste('#ffffff', '#000000')).toBeCloseTo(21, 5)
    expect(relacionDeContraste('#000', '#fff')).toBeCloseTo(21, 5)
  })

  it('da 1:1 entre un color y sí mismo', () => {
    expect(relacionDeContraste('#1d629c', '#1d629c')).toBe(1)
  })

  it('calcula el azul de la marca sobre blanco', () => {
    expect(relacionDeContraste('#1d629c', '#fff')).toBeCloseTo(6.4, 1)
  })

  it('rechaza un color que no es hexadecimal', () => {
    expect(() => relacionDeContraste('azul', '#fff')).toThrow(/hexadecimal/)
  })
})
