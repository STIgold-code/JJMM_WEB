import { describe, expect, it } from 'vitest'

import { ERROR_DE_FORMULARIO } from './formularios'
import { ERROR_DE_CELULAR, ERROR_DE_CORREO } from './respuesta-al-mensaje'
import {
  ERROR_CELULAR_VACIO,
  ERROR_DE_MAPA,
  ERROR_SIN_CELULARES,
  ERROR_TEXTO_LARGO,
  MAXIMO_DE_CELULARES,
  validarFormularioDeSede,
} from './validacion-de-sede'

const MAPA = 'https://www.google.com/maps/embed?pb=!1m18!1m12'

const FORMULARIO = {
  nombre: ' Sede San Isidro ',
  direccion: 'Calle Gorriones 151',
  distrito: 'San Isidro',
  ciudad: 'Lima',
  celulares: [
    { clave: 1, numero: '951965242', tieneWhatsApp: true },
    { clave: 2, numero: '952 249 102', tieneWhatsApp: false },
  ],
  correo: '',
  mapa: MAPA,
  visible: true,
}

describe('validarFormularioDeSede', () => {
  it('recorta los textos, da formato a los celulares y deja vacíos como nulos', () => {
    expect(validarFormularioDeSede(FORMULARIO)).toEqual({
      valido: true,
      datos: {
        nombre: 'Sede San Isidro',
        direccion: 'Calle Gorriones 151',
        distrito: 'San Isidro',
        ciudad: 'Lima',
        celulares: [
          { numero: '951 965 242', tieneWhatsApp: true },
          { numero: '952 249 102', tieneWhatsApp: false },
        ],
        correo: null,
        mapa: MAPA,
        visible: true,
      },
    })
  })

  it('pide los datos de la dirección', () => {
    const resultado = validarFormularioDeSede({
      ...FORMULARIO,
      nombre: ' ',
      direccion: '',
      distrito: '',
      ciudad: '',
    })
    expect(resultado).toEqual({
      valido: false,
      errores: {
        nombre: 'Escribe el nombre de la sede.',
        direccion: 'Escribe la dirección de la sede.',
        distrito: 'Escribe el distrito.',
        ciudad: 'Escribe la ciudad.',
      },
    })
  })

  it('rechaza teléfonos fijos y filas vacías, y dice en qué fila está cada error', () => {
    const celulares = [
      { clave: 1, numero: '01 555 1234', tieneWhatsApp: false },
      { clave: 2, numero: '951965242', tieneWhatsApp: true },
      { clave: 3, numero: '  ', tieneWhatsApp: false },
    ]
    expect(validarFormularioDeSede({ ...FORMULARIO, celulares })).toEqual({
      valido: false,
      errores: { celular: { 0: ERROR_DE_CELULAR, 2: ERROR_CELULAR_VACIO } },
    })
  })

  it('exige al menos un celular y pone un tope', () => {
    expect(validarFormularioDeSede({ ...FORMULARIO, celulares: [] })).toEqual({
      valido: false,
      errores: { celulares: ERROR_SIN_CELULARES },
    })
    const muchos = Array.from({ length: MAXIMO_DE_CELULARES + 1 }, (_, clave) => ({
      clave,
      numero: '951965242',
      tieneWhatsApp: false,
    }))
    expect(validarFormularioDeSede({ ...FORMULARIO, celulares: muchos }).valido).toBe(false)
  })

  it('acepta solo mapas insertados de Google Maps y correos válidos', () => {
    const resultado = validarFormularioDeSede({
      ...FORMULARIO,
      mapa: 'https://maps.app.goo.gl/abc',
      correo: 'no es correo',
    })
    expect(resultado).toEqual({
      valido: false,
      errores: { mapa: ERROR_DE_MAPA, correo: ERROR_DE_CORREO },
    })
  })

  it('rechaza textos desmedidos', () => {
    const resultado = validarFormularioDeSede({ ...FORMULARIO, distrito: 'x'.repeat(201) })
    expect(resultado).toEqual({ valido: false, errores: { distrito: ERROR_TEXTO_LARGO } })
  })

  it.each([
    ['no es un objeto', 'sede'],
    ['falta un campo', { ...FORMULARIO, ciudad: undefined }],
    ['«visible» no es sí o no', { ...FORMULARIO, visible: 'true' }],
    ['los celulares no son una lista', { ...FORMULARIO, celulares: '951965242' }],
    ['un celular no tiene la forma esperada', { ...FORMULARIO, celulares: [{ numero: 9 }] }],
  ])('si %s, no se puede leer el formulario', (_, entrada) => {
    expect(validarFormularioDeSede(entrada)).toEqual({
      valido: false,
      errores: { general: ERROR_DE_FORMULARIO },
    })
  })
})
