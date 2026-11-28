import { describe, expect, it } from 'vitest'

import {
  ERROR_DE_RESPUESTA,
  leerImagenElegida,
  leerRespuestaDeSubida,
  prevalidarArchivo,
  puedeQuitarImagen,
  resumenDeImagen,
  tamanoLegible,
} from './selector-de-imagen'
import { ERROR_DE_ARCHIVO_GRANDE, ERROR_DE_TIPO } from './subida-de-imagenes'

const IMAGEN = {
  id: 4,
  url: '/api/medios/file/hero-plan.webp',
  alt: 'Profesional frente a un mapamundi',
  nombre: 'hero-plan.webp',
  ancho: 1920,
  alto: 1080,
}

describe('leerImagenElegida', () => {
  it('acepta una imagen de la biblioteca con su miniatura', () => {
    expect(leerImagenElegida(IMAGEN)).toEqual(IMAGEN)
  })

  it('rechaza una dirección fuera de los archivos de medios o un id inválido', () => {
    expect(leerImagenElegida({ ...IMAGEN, url: 'https://otro.com/a.png' })).toBeNull()
    expect(leerImagenElegida({ ...IMAGEN, url: '/api/medios/file/../../secreto' })).toBeNull()
    expect(leerImagenElegida({ ...IMAGEN, id: 0 })).toBeNull()
    expect(leerImagenElegida(null)).toBeNull()
  })
})

describe('leerRespuestaDeSubida', () => {
  it('lee una subida correcta', () => {
    expect(leerRespuestaDeSubida({ estado: 'subida', imagen: IMAGEN })).toEqual({
      estado: 'subida',
      imagen: IMAGEN,
    })
  })

  it('lee los errores por campo y el error general', () => {
    expect(
      leerRespuestaDeSubida({ estado: 'invalido', errores: { alt: 'Falta', otro: 1 } }),
    ).toEqual({ estado: 'invalido', errores: { alt: 'Falta' } })
    expect(leerRespuestaDeSubida({ estado: 'error', error: 'Sin sesión' })).toEqual({
      estado: 'error',
      error: 'Sin sesión',
    })
  })

  it('cualquier otra forma es un error con un texto propio', () => {
    expect(leerRespuestaDeSubida('<html>')).toEqual({ estado: 'error', error: ERROR_DE_RESPUESTA })
    expect(leerRespuestaDeSubida({ estado: 'subida', imagen: {} })).toEqual({
      estado: 'error',
      error: ERROR_DE_RESPUESTA,
    })
  })
})

describe('prevalidarArchivo', () => {
  it('avisa en el navegador lo que el servidor rechazaría', () => {
    expect(prevalidarArchivo({ tamano: 1000, tipo: 'image/webp' })).toBeNull()
    expect(prevalidarArchivo({ tamano: 1000, tipo: 'image/svg+xml' })).toBe(ERROR_DE_TIPO)
    expect(prevalidarArchivo({ tamano: 11 * 1024 * 1024, tipo: 'image/png' })).toBe(
      ERROR_DE_ARCHIVO_GRANDE,
    )
  })
})

describe('puedeQuitarImagen', () => {
  it('solo un campo opcional con imagen ofrece «Quitar»', () => {
    expect(puedeQuitarImagen({ opcional: true, valor: IMAGEN })).toBe(true)
    expect(puedeQuitarImagen({ opcional: false, valor: IMAGEN })).toBe(false)
    expect(puedeQuitarImagen({ opcional: true, valor: null })).toBe(false)
  })
})

describe('resumenDeImagen y tamanoLegible', () => {
  it('muestra las medidas de la imagen elegida', () => {
    expect(resumenDeImagen(IMAGEN)).toBe('1920 × 1080 px')
    expect(resumenDeImagen({ ...IMAGEN, ancho: null, alto: null })).toBe('Medidas desconocidas')
  })

  it('muestra el peso en KB o MB', () => {
    expect(tamanoLegible(512)).toBe('1 KB')
    expect(tamanoLegible(245_000)).toBe('239 KB')
    expect(tamanoLegible(3_400_000)).toBe('3,2 MB')
  })
})
