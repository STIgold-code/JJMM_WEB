import { describe, expect, it } from 'vitest'

import { sedePorTecla } from './sede-por-tecla'

describe('sedePorTecla', () => {
  it('las flechas laterales mueven una pestaña y dan la vuelta', () => {
    expect(sedePorTecla(0, 'ArrowRight', 3)).toBe(1)
    expect(sedePorTecla(2, 'ArrowRight', 3)).toBe(0)
    expect(sedePorTecla(0, 'ArrowLeft', 3)).toBe(2)
  })

  it('Inicio y Fin van a los extremos', () => {
    expect(sedePorTecla(1, 'Home', 3)).toBe(0)
    expect(sedePorTecla(0, 'End', 3)).toBe(2)
  })

  it('las flechas verticales y otras teclas no mueven: la página sigue desplazándose', () => {
    expect(sedePorTecla(0, 'ArrowDown', 3)).toBeNull()
    expect(sedePorTecla(0, 'Enter', 3)).toBeNull()
  })
})
