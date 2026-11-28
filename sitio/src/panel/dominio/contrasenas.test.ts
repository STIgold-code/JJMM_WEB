import { describe, expect, it } from 'vitest'

import {
  ERROR_CLAVE_CORTA,
  ERROR_CLAVE_EN_BLANCO,
  ERROR_CLAVE_LARGA,
  errorDeClaveNueva,
  LARGO_MINIMO_DE_CLAVE,
  requisitoDeLargo,
} from './contrasenas'

describe('errorDeClaveNueva', () => {
  it('pide al menos 10 caracteres', () => {
    expect(LARGO_MINIMO_DE_CLAVE).toBe(10)
    expect(errorDeClaveNueva('123456789')).toBe(ERROR_CLAVE_CORTA)
    expect(errorDeClaveNueva('')).toBe(ERROR_CLAVE_CORTA)
    expect(errorDeClaveNueva('1234567890')).toBeNull()
  })

  it('no recorta los espacios: cuentan como caracteres', () => {
    expect(errorDeClaveNueva('  abcdefgh')).toBeNull()
  })

  it('rechaza una contraseña hecha solo de espacios: el ingreso no la aceptaría nunca', () => {
    expect(errorDeClaveNueva(' '.repeat(12))).toBe(ERROR_CLAVE_EN_BLANCO)
  })

  it('rechaza una contraseña desmedida', () => {
    expect(errorDeClaveNueva('a'.repeat(257))).toBe(ERROR_CLAVE_LARGA)
    expect(errorDeClaveNueva('a'.repeat(256))).toBeNull()
  })
})

describe('requisitoDeLargo', () => {
  it('cuenta lo que lleva hasta cumplir', () => {
    expect(requisitoDeLargo(0)).toEqual({ cumple: false, texto: 'Al menos 10 caracteres' })
    expect(requisitoDeLargo(4)).toEqual({
      cumple: false,
      texto: 'Al menos 10 caracteres (llevas 4)',
    })
    expect(requisitoDeLargo(10)).toEqual({ cumple: true, texto: 'Tiene 10 caracteres o más' })
  })
})
