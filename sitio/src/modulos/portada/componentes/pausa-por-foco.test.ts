import { describe, expect, it } from 'vitest'

import { debePausarPorFoco } from './pausa-por-foco'

const elementoCon = (focoVisible: boolean) => ({
  matches: (selector: string) => selector === ':focus-visible' && focoVisible,
})

describe('debePausarPorFoco', () => {
  it('pausa cuando el foco llega con el teclado', () => {
    expect(debePausarPorFoco(elementoCon(true))).toBe(true)
  })

  // Un clic con el mouse también deja el foco en el botón: si pausara, el carrusel quedaría
  // detenido hasta hacer clic fuera de la portada.
  it('no pausa cuando el foco viene de un clic con el mouse', () => {
    expect(debePausarPorFoco(elementoCon(false))).toBe(false)
  })
})
