import { describe, expect, it } from 'vitest'

import { esRucValido, motivoDeRucInvalido, RucInvalidoError, ultimoDigitoDelRuc } from './ruc'

describe('esRucValido', () => {
  it('acepta RUC de empresas y de personas con dígito verificador correcto', () => {
    expect(esRucValido('20131312955')).toBe(true)
    expect(esRucValido('10405678905')).toBe(true)
  })

  it('admite espacios como separadores', () => {
    expect(esRucValido('20131 312955')).toBe(true)
  })

  it('rechaza un dígito verificador incorrecto', () => {
    expect(esRucValido('20131312954')).toBe(false)
  })

  it('rechaza un prefijo que SUNAT no asigna aunque el verificador cuadre', () => {
    expect(esRucValido('30131312951')).toBe(false)
  })

  it.each(['2013131295', '201313129550', '2013131295A', ''])('rechaza «%s»', (ruc) => {
    expect(esRucValido(ruc)).toBe(false)
  })
})

describe('ultimoDigitoDelRuc', () => {
  it('devuelve el último dígito, que define el cronograma de SUNAT', () => {
    expect(ultimoDigitoDelRuc('20131312955')).toBe(5)
  })

  it('lanza RucInvalidoError con un RUC inválido', () => {
    expect(() => ultimoDigitoDelRuc('20131312954')).toThrow(RucInvalidoError)
  })
})

describe('motivoDeRucInvalido', () => {
  it('no devuelve motivo con un RUC válido, aunque tenga espacios', () => {
    expect(motivoDeRucInvalido('20131 312955')).toBeNull()
  })

  it.each(['', '   '])('distingue el campo vacío («%s»)', (valor) => {
    expect(motivoDeRucInvalido(valor)).toBe('vacio')
  })

  it.each(['2013131295', '201313129550', '2013131295A'])(
    'distingue un RUC sin 11 dígitos («%s»)',
    (valor) => {
      expect(motivoDeRucInvalido(valor)).toBe('formato')
    },
  )

  it('distingue 11 dígitos que no forman un RUC válido', () => {
    expect(motivoDeRucInvalido('20131312954')).toBe('invalido')
    expect(motivoDeRucInvalido('30131312951')).toBe('invalido')
  })
})
