import { describe, expect, it } from 'vitest'

import {
  leerUrlDelSitio,
  resolverUrlDelSitio,
  URL_DE_DESARROLLO,
  urlAbsoluta,
  UrlDelSitioInvalidaError,
} from './url-del-sitio'

describe('leerUrlDelSitio', () => {
  it('acepta un origen http o https y lo normaliza sin barra final', () => {
    expect(leerUrlDelSitio('https://sigemype.com').origin).toBe('https://sigemype.com')
    expect(leerUrlDelSitio(' https://sigemype.com/ ').href).toBe('https://sigemype.com/')
    expect(leerUrlDelSitio('http://localhost:3000').origin).toBe('http://localhost:3000')
  })

  it('rechaza un valor vacío con un mensaje que nombra la variable', () => {
    for (const valor of [undefined, '', '   ']) {
      expect(() => leerUrlDelSitio(valor)).toThrow(UrlDelSitioInvalidaError)
    }
    expect(() => leerUrlDelSitio(undefined)).toThrow(/NEXT_PUBLIC_SITE_URL/)
  })

  it('rechaza lo que no es una URL http(s) de origen', () => {
    for (const valor of [
      'sigemype.com',
      'ftp://sigemype.com',
      'https://sigemype.com/blog',
      'https://sigemype.com/?a=1',
      'https://sigemype.com/#inicio',
    ]) {
      expect(() => leerUrlDelSitio(valor), valor).toThrow(UrlDelSitioInvalidaError)
    }
  })
})

describe('resolverUrlDelSitio', () => {
  it('en producción exige la variable', () => {
    expect(() => resolverUrlDelSitio(undefined, true)).toThrow(UrlDelSitioInvalidaError)
    expect(resolverUrlDelSitio('https://sigemype.com', true).origin).toBe('https://sigemype.com')
  })

  it('fuera de producción usa el servidor local si falta', () => {
    expect(resolverUrlDelSitio(undefined, false).href).toBe(`${URL_DE_DESARROLLO}/`)
    expect(resolverUrlDelSitio('', false).href).toBe(`${URL_DE_DESARROLLO}/`)
  })

  it('fuera de producción también rechaza un valor mal escrito', () => {
    expect(() => resolverUrlDelSitio('sigemype.com', false)).toThrow(UrlDelSitioInvalidaError)
  })
})

describe('urlAbsoluta', () => {
  const origen = new URL('https://sigemype.com')

  it('une una ruta relativa con el origen', () => {
    expect(urlAbsoluta(origen, '/blog/que-es-el-igv')).toBe(
      'https://sigemype.com/blog/que-es-el-igv',
    )
    expect(urlAbsoluta(origen, '/')).toBe('https://sigemype.com/')
  })

  it('respeta una dirección que ya es absoluta', () => {
    expect(urlAbsoluta(origen, 'https://s3.wasabisys.com/logo.webp')).toBe(
      'https://s3.wasabisys.com/logo.webp',
    )
  })
})
