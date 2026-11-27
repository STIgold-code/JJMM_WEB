import { describe, expect, it } from 'vitest'

import { esMapaIncrustadoDeGoogle, urlDelMapaIncrustado, urlParaComoLlegar } from './mapa-de-sede'

const INCRUSTADO = 'https://www.google.com/maps/embed?pb=!1m18!1m12!2sESTUDIO+CONTABLE+JJMM+SAC'
const DIRECCION = 'Jr. Iquitos 593, San Martín de Porres, Lima'

describe('esMapaIncrustadoDeGoogle', () => {
  it('acepta solo la dirección de inserción de Google Maps', () => {
    expect(esMapaIncrustadoDeGoogle(INCRUSTADO)).toBe(true)
  })

  it.each([
    ['otro origen', 'https://www.google.com.evil.pe/maps/embed?pb=1'],
    ['http', 'http://www.google.com/maps/embed?pb=1'],
    ['otra ruta', 'https://www.google.com/maps/place/JJMM'],
    ['sin parámetros', 'https://www.google.com/maps/embed'],
    ['con usuario', 'https://ana@www.google.com/maps/embed?pb=1'],
    ['un script', 'javascript:alert(1)'],
    ['texto', 'Jr. Iquitos 593'],
  ])('rechaza %s', (_caso, valor) => {
    expect(esMapaIncrustadoDeGoogle(valor)).toBe(false)
  })
})

describe('urlDelMapaIncrustado', () => {
  it('usa el mapa guardado en el panel si es de Google Maps', () => {
    expect(urlDelMapaIncrustado(INCRUSTADO, DIRECCION)).toBe(INCRUSTADO)
  })

  it('sin mapa válido lo arma con la dirección, como la v5', () => {
    const esperado =
      'https://www.google.com/maps?q=Jr.%20Iquitos%20593%2C%20San%20Mart%C3%ADn%20de%20Porres%2C%20Lima&output=embed'

    expect(urlDelMapaIncrustado(null, DIRECCION)).toBe(esperado)
    expect(urlDelMapaIncrustado('https://otro.pe/mapa', DIRECCION)).toBe(esperado)
  })
})

describe('urlParaComoLlegar', () => {
  it('busca la dirección en Google Maps', () => {
    expect(urlParaComoLlegar('Calle Gorriones 151, San Isidro, Lima')).toBe(
      'https://www.google.com/maps/search/?api=1&query=Calle%20Gorriones%20151%2C%20San%20Isidro%2C%20Lima',
    )
  })
})
