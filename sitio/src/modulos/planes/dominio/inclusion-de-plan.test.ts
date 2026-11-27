import { describe, expect, it } from 'vitest'

import { contieneMonto, validarTextoDeInclusion } from './inclusion-de-plan'

describe('contieneMonto', () => {
  it.each(['S/ 300', 'S/.150', 'Desde 100 soles', 'USD 50', '$20', 'US$ 1 200', '2 dólares'])(
    'detecta el monto en «%s»',
    (texto) => {
      expect(contieneMonto(texto)).toBe(true)
    },
  )

  it.each(['Consultar', '2 trabajadores', '12 trabajadores', 'Solo el IGV'])(
    'no confunde «%s» con un monto',
    (texto) => {
      expect(contieneMonto(texto)).toBe(false)
    },
  )
})

describe('validarTextoDeInclusion', () => {
  it('exige texto cuando la celda es de tipo texto', () => {
    expect(validarTextoDeInclusion('texto', 'Consultar')).toBeNull()
    expect(validarTextoDeInclusion('texto', '  ')).toMatch(/Consultar/)
    expect(validarTextoDeInclusion('texto', null)).toMatch(/Consultar/)
  })

  it('rechaza montos porque los precios se muestran como «Consultar» (S9)', () => {
    expect(validarTextoDeInclusion('texto', 'S/ 300 mensuales')).toMatch(/montos/)
  })

  it('exige el texto vacío en celdas incluido o no incluido', () => {
    expect(validarTextoDeInclusion('incluido', null)).toBeNull()
    expect(validarTextoDeInclusion('no-incluido', '')).toBeNull()
    expect(validarTextoDeInclusion('incluido', 'Sí')).toMatch(/vacío/)
  })
})
