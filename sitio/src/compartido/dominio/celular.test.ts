import { describe, expect, it } from 'vitest'

import { esCelularPeruano, normalizarCelular } from './celular'

describe('esCelularPeruano', () => {
  it('acepta los celulares publicados por el estudio, con o sin espacios', () => {
    expect(esCelularPeruano('951 965 242')).toBe(true)
    expect(esCelularPeruano('952249102')).toBe(true)
  })

  it('rechaza teléfonos fijos de Lima', () => {
    expect(esCelularPeruano('01 4567890')).toBe(false)
  })

  it('rechaza números con una cantidad de dígitos distinta de 9', () => {
    expect(esCelularPeruano('95196524')).toBe(false)
    expect(esCelularPeruano('9519652420')).toBe(false)
  })

  it('rechaza valores con caracteres que no son dígitos ni espacios', () => {
    expect(esCelularPeruano('951-965-242')).toBe(false)
    expect(esCelularPeruano('')).toBe(false)
  })
})

describe('normalizarCelular', () => {
  it('quita todos los espacios', () => {
    expect(normalizarCelular(' 951 965  242 ')).toBe('951965242')
  })
})
