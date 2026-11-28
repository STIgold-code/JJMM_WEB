import { describe, expect, it } from 'vitest'

import { ERROR_CLAVE_CORTA } from './contrasenas'
import { ERROR_DE_FORMULARIO } from './formularios'
import {
  ERROR_CLAVE_IGUAL_A_LA_ACTUAL,
  ERROR_CLAVES_DISTINTAS,
  ERROR_SIN_CLAVE_ACTUAL,
  validarCambioDeClave,
  validarNombrePropio,
} from './validacion-de-mi-cuenta'
import { ERROR_SIN_NOMBRE } from './validacion-de-usuario'

describe('validarNombrePropio', () => {
  it('devuelve solo el nombre recortado, aunque lleguen otros campos', () => {
    expect(validarNombrePropio({ nombre: ' Carmen ', rol: 'administrador', id: 1 })).toEqual({
      valido: true,
      nombre: 'Carmen',
    })
  })

  it('exige un nombre', () => {
    expect(validarNombrePropio({ nombre: '  ' })).toEqual({
      valido: false,
      errores: { nombre: ERROR_SIN_NOMBRE },
    })
    expect(validarNombrePropio('Carmen')).toEqual({
      valido: false,
      errores: { general: ERROR_DE_FORMULARIO },
    })
  })
})

describe('validarCambioDeClave', () => {
  const CAMBIO = {
    actual: 'clave de antes',
    nueva: 'clave nueva larga',
    repetida: 'clave nueva larga',
  }

  it('trata una contraseña actual de solo espacios como vacía', () => {
    expect(validarCambioDeClave({ ...CAMBIO, actual: '   ' })).toEqual({
      valido: false,
      errores: { actual: ERROR_SIN_CLAVE_ACTUAL },
    })
  })

  it('acepta la contraseña actual y la nueva repetida igual', () => {
    expect(validarCambioDeClave(CAMBIO)).toEqual({
      valido: true,
      datos: { actual: 'clave de antes', nueva: 'clave nueva larga' },
    })
  })

  it('pide la actual, 10 caracteres y que las dos nuevas coincidan', () => {
    expect(validarCambioDeClave({ actual: '', nueva: 'corta', repetida: 'otra' })).toEqual({
      valido: false,
      errores: { actual: ERROR_SIN_CLAVE_ACTUAL, nueva: ERROR_CLAVE_CORTA },
    })
    expect(validarCambioDeClave({ ...CAMBIO, repetida: 'clave nueva largo' })).toEqual({
      valido: false,
      errores: { repetida: ERROR_CLAVES_DISTINTAS },
    })
  })

  it('la nueva tiene que ser distinta de la actual', () => {
    const misma = { actual: 'clave de antes', nueva: 'clave de antes', repetida: 'clave de antes' }
    expect(validarCambioDeClave(misma)).toEqual({
      valido: false,
      errores: { nueva: ERROR_CLAVE_IGUAL_A_LA_ACTUAL },
    })
  })

  it('un formulario con otra forma es un error general', () => {
    expect(validarCambioDeClave({ ...CAMBIO, nueva: 7 })).toEqual({
      valido: false,
      errores: { general: ERROR_DE_FORMULARIO },
    })
  })
})
