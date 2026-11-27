import { describe, expect, it } from 'vitest'

import { propsDeRevelado } from './props-de-revelado'

describe('propsDeRevelado', () => {
  it('sube desde abajo sin retraso por defecto', () => {
    expect(propsDeRevelado()).toEqual({ className: 'revelar' })
  })

  it('entra desde un costado', () => {
    expect(propsDeRevelado({ desde: 'izquierda' }).className).toBe('revelar desde-izquierda')
    expect(propsDeRevelado({ desde: 'derecha' }).className).toBe('revelar desde-derecha')
  })

  it('escalona la entrada con la variable --retraso en segundos', () => {
    expect(propsDeRevelado({ retraso: 0.2 })).toEqual({
      className: 'revelar',
      style: { '--retraso': '0.2s' },
    })
  })

  it('suma las clases propias del componente', () => {
    expect(propsDeRevelado({ clase: 'tarjeta' }).className).toBe('tarjeta revelar')
  })
})
