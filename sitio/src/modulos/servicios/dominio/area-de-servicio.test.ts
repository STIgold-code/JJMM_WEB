import { describe, expect, it } from 'vitest'

import { esCodigoDeAreaValido, esListaDePuntosValida } from './area-de-servicio'

describe('esCodigoDeAreaValido', () => {
  it('acepta de P1 a P9', () => {
    expect(esCodigoDeAreaValido('P1')).toBe(true)
    expect(esCodigoDeAreaValido('P9')).toBe(true)
  })

  it.each(['P0', 'P10', 'p1', '1', ''])('rechaza «%s»', (codigo) => {
    expect(esCodigoDeAreaValido(codigo)).toBe(false)
  })
})

describe('esListaDePuntosValida', () => {
  it('acepta tres o más pares x,y separados por espacios', () => {
    expect(esListaDePuntosValida('72.8,155.8 174.1,78.7 216.5,191.5 203.1,197.6')).toBe(true)
    expect(esListaDePuntosValida('0,0 10,0 10,10')).toBe(true)
  })

  it.each(['', '1,2 3,4', 'a,b c,d e,f', '1,2 3,4 5', '1;2 3;4 5;6', '-1,2 3,4 5,6'])(
    'rechaza «%s»',
    (puntos) => {
      expect(esListaDePuntosValida(puntos)).toBe(false)
    },
  )
})
