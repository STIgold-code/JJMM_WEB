import { describe, expect, it } from 'vitest'

import {
  ERROR_DE_ALT_LARGO,
  ERROR_DE_ALT_VACIO,
  ERROR_DE_ARCHIVO_GRANDE,
  ERROR_DE_TIPO,
  esDelMismoOrigen,
  nombreConExtension,
  TAMANO_MAXIMO_DE_IMAGEN,
  tipoRealDeImagen,
  validarSubida,
  validarTextoAlternativo,
} from './subida-de-imagenes'

const bytes = (...valores: number[]) => new Uint8Array([...valores, ...new Array(16).fill(0)])
const texto = (cadena: string) => [...cadena].map((c) => c.charCodeAt(0))

const PNG = bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)
const JPEG = bytes(0xff, 0xd8, 0xff, 0xe0)
const WEBP = bytes(...texto('RIFF'), 0, 0, 0, 0, ...texto('WEBP'))
const AVIF = bytes(0, 0, 0, 0x20, ...texto('ftypavif'))
const SVG = new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg"></svg>')
const HTML = new TextEncoder().encode('<html><script>alert(1)</script></html>')

describe('tipoRealDeImagen', () => {
  it('reconoce JPEG, PNG, WebP y AVIF por su contenido, no por el nombre', () => {
    expect(tipoRealDeImagen(PNG)?.mime).toBe('image/png')
    expect(tipoRealDeImagen(JPEG)?.mime).toBe('image/jpeg')
    expect(tipoRealDeImagen(WEBP)?.mime).toBe('image/webp')
    expect(tipoRealDeImagen(AVIF)?.mime).toBe('image/avif')
  })

  it('rechaza SVG, HTML, GIF y archivos vacíos', () => {
    expect(tipoRealDeImagen(SVG)).toBeNull()
    expect(tipoRealDeImagen(HTML)).toBeNull()
    expect(tipoRealDeImagen(bytes(...texto('GIF89a')))).toBeNull()
    expect(tipoRealDeImagen(new Uint8Array())).toBeNull()
  })
})

describe('nombreConExtension', () => {
  it('pone la extensión del tipo real, aunque el nombre diga otra', () => {
    expect(nombreConExtension('foto.html', 'jpg')).toBe('foto.jpg')
    expect(nombreConExtension('Logo Cadex.PNG', 'png')).toBe('Logo Cadex.png')
    expect(nombreConExtension('sin-extension', 'webp')).toBe('sin-extension.webp')
  })

  it('quita rutas y nombres vacíos', () => {
    expect(nombreConExtension('../../etc/passwd', 'png')).toBe('passwd.png')
    expect(nombreConExtension('C:\\fotos\\a.png', 'png')).toBe('a.png')
    expect(nombreConExtension('   ', 'png')).toBe('imagen.png')
    expect(nombreConExtension('.png', 'png')).toBe('imagen.png')
  })
})

describe('validarTextoAlternativo', () => {
  it('pide un texto y lo devuelve sin espacios sobrantes', () => {
    expect(validarTextoAlternativo('  Logotipo de Cadex ')).toEqual({
      valido: true,
      alt: 'Logotipo de Cadex',
    })
    expect(validarTextoAlternativo('   ')).toEqual({ valido: false, error: ERROR_DE_ALT_VACIO })
    expect(validarTextoAlternativo(7)).toEqual({ valido: false, error: ERROR_DE_ALT_VACIO })
  })

  it('no acepta más de 300 caracteres', () => {
    expect(validarTextoAlternativo('a'.repeat(301))).toEqual({
      valido: false,
      error: ERROR_DE_ALT_LARGO,
    })
  })
})

describe('validarSubida', () => {
  it('acepta una imagen permitida con su texto alternativo', () => {
    expect(validarSubida({ bytes: PNG, nombre: 'logo.png', alt: 'Logotipo' })).toEqual({
      valido: true,
      datos: { bytes: PNG, nombre: 'logo.png', mime: 'image/png', alt: 'Logotipo' },
    })
  })

  it('un tipo no permitido se rechaza aunque el nombre diga .png', () => {
    expect(validarSubida({ bytes: SVG, nombre: 'logo.png', alt: 'Logotipo' })).toEqual({
      valido: false,
      errores: { archivo: ERROR_DE_TIPO },
    })
  })

  it('un archivo de más de 10 MB se rechaza antes de mirar su tipo', () => {
    const grande = new Uint8Array(TAMANO_MAXIMO_DE_IMAGEN + 1)
    expect(validarSubida({ bytes: grande, nombre: 'a.png', alt: 'x' })).toEqual({
      valido: false,
      errores: { archivo: ERROR_DE_ARCHIVO_GRANDE },
    })
  })

  it('junta los errores del archivo y del texto alternativo', () => {
    expect(validarSubida({ bytes: HTML, nombre: 'a.html', alt: '' })).toEqual({
      valido: false,
      errores: { archivo: ERROR_DE_TIPO, alt: ERROR_DE_ALT_VACIO },
    })
  })
})

describe('esDelMismoOrigen', () => {
  it('acepta solo un Origin igual al host que atiende la petición', () => {
    expect(esDelMismoOrigen({ origen: 'https://jjmm.pe', host: 'jjmm.pe' })).toBe(true)
    expect(
      esDelMismoOrigen({
        origen: 'https://jjmm.pe',
        host: 'interno:8080',
        hostReenviado: 'jjmm.pe',
      }),
    ).toBe(true)
  })

  it('rechaza otro origen, un Origin ausente o mal escrito', () => {
    expect(esDelMismoOrigen({ origen: 'https://malo.com', host: 'jjmm.pe' })).toBe(false)
    expect(esDelMismoOrigen({ origen: null, host: 'jjmm.pe' })).toBe(false)
    expect(esDelMismoOrigen({ origen: 'null', host: 'jjmm.pe' })).toBe(false)
    expect(esDelMismoOrigen({ origen: 'https://jjmm.pe', host: null })).toBe(false)
  })
})
