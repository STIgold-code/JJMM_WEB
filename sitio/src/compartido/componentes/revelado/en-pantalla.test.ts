import { describe, expect, it } from 'vitest'

import { estaEnPantalla } from './en-pantalla'

const ALTO_DE_VENTANA = 800

describe('estaEnPantalla', () => {
  it('reconoce un elemento dentro de la primera pantalla', () => {
    expect(estaEnPantalla({ top: 100, bottom: 300 }, ALTO_DE_VENTANA)).toBe(true)
  })

  it('cuenta como en pantalla al que asoma por el borde inferior', () => {
    expect(estaEnPantalla({ top: 790, bottom: 990 }, ALTO_DE_VENTANA)).toBe(true)
  })

  it('no cuenta al que empieza justo debajo de la pantalla', () => {
    expect(estaEnPantalla({ top: 800, bottom: 1000 }, ALTO_DE_VENTANA)).toBe(false)
  })

  it('no cuenta al que quedó por encima de la pantalla', () => {
    expect(estaEnPantalla({ top: -300, bottom: 0 }, ALTO_DE_VENTANA)).toBe(false)
  })
})
