import { describe, expect, it } from 'vitest'

import {
  CAMPOS_DEL_MENSAJE,
  type DatosDelFormulario,
  primerCampoConError,
  textoParaWhatsApp,
  validarMensajeDeContacto,
} from './mensaje-de-contacto'

const DATOS: DatosDelFormulario = {
  nombre: '  Ana Torres ',
  servicio: 'Asesoría tributaria',
  mensaje: ' Necesito declarar mi renta anual. ',
}

describe('validarMensajeDeContacto', () => {
  it('pide solo los tres campos de la v5: nombre, servicio y caso', () => {
    expect(CAMPOS_DEL_MENSAJE).toEqual(['nombre', 'servicio', 'mensaje'])
  })

  it('acepta un mensaje completo y lo normaliza', () => {
    expect(validarMensajeDeContacto(DATOS)).toEqual({
      valido: true,
      mensaje: {
        nombre: 'Ana Torres',
        servicio: 'Asesoría tributaria',
        mensaje: 'Necesito declarar mi renta anual.',
      },
    })
  })

  it('exige nombre y mensaje', () => {
    const resultado = validarMensajeDeContacto({ ...DATOS, nombre: ' ', mensaje: '' })

    expect(resultado).toEqual({
      valido: false,
      errores: {
        nombre: 'Escribe tu nombre para saber cómo dirigirnos a ti.',
        mensaje: 'Cuéntanos en una línea qué necesitas.',
      },
    })
  })

  it('el servicio es opcional', () => {
    const resultado = validarMensajeDeContacto({ ...DATOS, servicio: '' })

    expect(resultado.valido && resultado.mensaje.servicio).toBeNull()
  })

  it('limita la longitud de cada campo a lo que guarda el panel', () => {
    const resultado = validarMensajeDeContacto({
      nombre: 'a'.repeat(121),
      servicio: 's'.repeat(121),
      mensaje: 'm'.repeat(2001),
    })

    expect(resultado).toEqual({
      valido: false,
      errores: {
        nombre: 'Usa como máximo 120 caracteres.',
        servicio: 'Usa como máximo 120 caracteres.',
        mensaje: 'Usa como máximo 2000 caracteres.',
      },
    })
  })
})

describe('primerCampoConError', () => {
  it('sigue el orden del formulario', () => {
    expect(primerCampoConError({ mensaje: 'x', nombre: 'y' })).toBe('nombre')
    expect(primerCampoConError({ mensaje: 'x' })).toBe('mensaje')
    expect(primerCampoConError({})).toBeNull()
  })
})

describe('textoParaWhatsApp', () => {
  it('arma el mensaje como la v5: nombre, servicio y caso', () => {
    const mensaje = { nombre: 'Ana', mensaje: 'Hola.' }

    expect(textoParaWhatsApp({ ...mensaje, servicio: 'Asesoría legal' })).toBe(
      'Hola, soy Ana. Necesito: Asesoría legal. Hola.',
    )
    expect(textoParaWhatsApp({ ...mensaje, servicio: null })).toBe('Hola, soy Ana. Hola.')
  })
})
