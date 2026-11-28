import { describe, expect, it } from 'vitest'

import { ERROR_CLAVE_CORTA } from './contrasenas'
import { ERROR_DE_FORMULARIO } from './formularios'
import { ERROR_DE_CORREO } from './respuesta-al-mensaje'
import {
  ERROR_DE_ROL,
  ERROR_NOMBRE_LARGO,
  ERROR_SIN_NOMBRE,
  validarCambiosDeCuenta,
  validarCuentaNueva,
} from './validacion-de-usuario'

const NUEVA = {
  nombre: ' Asistente contable ',
  correo: ' Asistente@JJMM.pe ',
  rol: 'editor',
  clave: 'una clave larga',
}

describe('validarCuentaNueva', () => {
  it('devuelve los datos limpios: nombre recortado y correo en minúsculas', () => {
    expect(validarCuentaNueva(NUEVA)).toEqual({
      valido: true,
      datos: {
        nombre: 'Asistente contable',
        correo: 'asistente@jjmm.pe',
        rol: 'editor',
        clave: 'una clave larga',
      },
    })
  })

  it('exige nombre, correo válido, rol conocido y una contraseña de 10 caracteres', () => {
    expect(validarCuentaNueva({ nombre: '', correo: 'x', rol: 'dueño', clave: 'corta' })).toEqual({
      valido: false,
      errores: {
        nombre: ERROR_SIN_NOMBRE,
        correo: ERROR_DE_CORREO,
        rol: ERROR_DE_ROL,
        clave: ERROR_CLAVE_CORTA,
      },
    })
  })

  it('rechaza un nombre desmedido', () => {
    const resultado = validarCuentaNueva({ ...NUEVA, nombre: 'a'.repeat(101) })
    expect(resultado).toEqual({ valido: false, errores: { nombre: ERROR_NOMBRE_LARGO } })
  })

  it.each([null, 'texto', [], { ...NUEVA, rol: 1 }, { ...NUEVA, clave: undefined }])(
    'un formulario con otra forma (%j) es un error general',
    (entrada) => {
      expect(validarCuentaNueva(entrada)).toEqual({
        valido: false,
        errores: { general: ERROR_DE_FORMULARIO },
      })
    },
  )

  it('ignora lo que no es parte del formulario (por ejemplo, un id)', () => {
    const resultado = validarCuentaNueva({ ...NUEVA, id: 1, hash: 'x' })
    expect(resultado.valido && Object.keys(resultado.datos).sort()).toEqual([
      'clave',
      'correo',
      'nombre',
      'rol',
    ])
  })
})

describe('validarCambiosDeCuenta', () => {
  it('sin contraseña nueva, la deja como está (null)', () => {
    expect(validarCambiosDeCuenta({ ...NUEVA, clave: '' })).toEqual({
      valido: true,
      datos: {
        nombre: 'Asistente contable',
        correo: 'asistente@jjmm.pe',
        rol: 'editor',
        clave: null,
      },
    })
  })

  it('con contraseña nueva, aplica la misma regla de largo', () => {
    expect(validarCambiosDeCuenta({ ...NUEVA, clave: 'corta' })).toEqual({
      valido: false,
      errores: { clave: ERROR_CLAVE_CORTA },
    })
  })
})
