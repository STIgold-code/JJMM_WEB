import { describe, expect, it } from 'vitest'

import {
  type DatosDelFormulario,
  primerCampoConError,
  textoParaWhatsApp,
  validarMensajeDeContacto,
} from './mensaje-de-contacto'

const DATOS: DatosDelFormulario = {
  nombre: '  Ana Torres ',
  celular: '987 654 321',
  correo: '',
  servicio: 'Asesoría tributaria',
  mensaje: ' Necesito declarar mi renta anual. ',
}

describe('validarMensajeDeContacto', () => {
  it('acepta un mensaje completo y lo normaliza', () => {
    expect(validarMensajeDeContacto(DATOS)).toEqual({
      valido: true,
      mensaje: {
        nombre: 'Ana Torres',
        celular: '987654321',
        correo: null,
        servicio: 'Asesoría tributaria',
        mensaje: 'Necesito declarar mi renta anual.',
      },
    })
  })

  it('exige nombre, celular y mensaje', () => {
    const resultado = validarMensajeDeContacto({ ...DATOS, nombre: ' ', celular: '', mensaje: '' })

    expect(resultado).toEqual({
      valido: false,
      errores: {
        nombre: 'Escribe tu nombre para saber cómo dirigirnos a ti.',
        celular: 'Escribe tu celular para poder responderte.',
        mensaje: 'Cuéntanos en una línea qué necesitas.',
      },
    })
  })

  it('solo acepta celulares peruanos, nunca teléfonos fijos', () => {
    const resultado = validarMensajeDeContacto({ ...DATOS, celular: '01 456 7890' })

    expect(resultado).toEqual({
      valido: false,
      errores: { celular: 'Escribe un celular de 9 dígitos que empiece con 9.' },
    })
  })

  it('valida el formato del correo solo si se escribe', () => {
    const conCorreo = validarMensajeDeContacto({ ...DATOS, correo: 'ana@empresa.pe' })
    const malCorreo = validarMensajeDeContacto({ ...DATOS, correo: 'ana@empresa' })

    expect(conCorreo.valido && conCorreo.mensaje.correo).toBe('ana@empresa.pe')
    expect(malCorreo).toEqual({
      valido: false,
      errores: { correo: 'Escribe un correo válido, por ejemplo nombre@empresa.com.' },
    })
  })

  it('limita la longitud de cada campo a lo que guarda el panel', () => {
    const resultado = validarMensajeDeContacto({
      ...DATOS,
      nombre: 'a'.repeat(121),
      servicio: 's'.repeat(121),
      mensaje: 'm'.repeat(2001),
      correo: `${'c'.repeat(250)}@x.pe`,
    })

    expect(resultado).toEqual({
      valido: false,
      errores: {
        nombre: 'Usa como máximo 120 caracteres.',
        correo: 'Escribe un correo válido, por ejemplo nombre@empresa.com.',
        servicio: 'Usa como máximo 120 caracteres.',
        mensaje: 'Usa como máximo 2000 caracteres.',
      },
    })
  })
})

describe('primerCampoConError', () => {
  it('sigue el orden del formulario', () => {
    expect(primerCampoConError({ mensaje: 'x', celular: 'y' })).toBe('celular')
    expect(primerCampoConError({})).toBeNull()
  })
})

describe('textoParaWhatsApp', () => {
  it('arma el mensaje como la v4: nombre, servicio y caso', () => {
    const mensaje = { nombre: 'Ana', celular: '987654321', correo: null, mensaje: 'Hola.' }

    expect(textoParaWhatsApp({ ...mensaje, servicio: 'Asesoría legal' })).toBe(
      'Hola, soy Ana. Necesito: Asesoría legal. Hola.',
    )
    expect(textoParaWhatsApp({ ...mensaje, servicio: null })).toBe('Hola, soy Ana. Hola.')
  })
})
