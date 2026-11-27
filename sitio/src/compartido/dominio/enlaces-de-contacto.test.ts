import { describe, expect, it } from 'vitest'

import {
  CelularNoPublicableError,
  enlaceDeCorreo,
  enlaceDeLlamada,
  enlaceDeWhatsApp,
  formatearCelular,
} from './enlaces-de-contacto'

describe('formatearCelular', () => {
  it('agrupa los nueve dígitos de a tres, como los publica el sitio', () => {
    expect(formatearCelular('951965242')).toBe('951 965 242')
    expect(formatearCelular(' 952 249102 ')).toBe('952 249 102')
  })

  it('rechaza un teléfono fijo (S9)', () => {
    expect(() => formatearCelular('01 4567890')).toThrow(CelularNoPublicableError)
  })
})

describe('enlaceDeWhatsApp', () => {
  it('arma el enlace wa.me con el código de Perú y el mensaje codificado', () => {
    const enlace = enlaceDeWhatsApp(
      '951 965 242',
      'Hola, quiero información sobre sus servicios contables.',
    )

    expect(enlace).toEqual({
      texto: '951 965 242',
      href: 'https://wa.me/51951965242?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20sus%20servicios%20contables.',
    })
  })

  it('omite el parámetro text si el mensaje está vacío', () => {
    expect(enlaceDeWhatsApp('951965242', '  ').href).toBe('https://wa.me/51951965242')
  })

  it('rechaza un teléfono fijo (S9)', () => {
    expect(() => enlaceDeWhatsApp('01 4567890', 'Hola')).toThrow(
      'El número «01 4567890» no es un celular y no se puede publicar.',
    )
  })
})

describe('enlaceDeLlamada', () => {
  it('arma un enlace tel: internacional', () => {
    expect(enlaceDeLlamada('952 249 102')).toEqual({
      texto: '952 249 102',
      href: 'tel:+51952249102',
    })
  })

  it('rechaza un teléfono fijo (S9)', () => {
    expect(() => enlaceDeLlamada('014567890')).toThrow(CelularNoPublicableError)
  })
})

describe('enlaceDeCorreo', () => {
  it('arma un enlace mailto: sin espacios', () => {
    expect(enlaceDeCorreo(' contabilidad@jjmm.com.pe ')).toEqual({
      texto: 'contabilidad@jjmm.com.pe',
      href: 'mailto:contabilidad@jjmm.com.pe',
    })
  })
})
