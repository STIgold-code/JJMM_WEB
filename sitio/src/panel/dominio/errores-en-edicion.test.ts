import { describe, expect, it } from 'vitest'

import type { ErroresDelCarrusel } from './errores-del-carrusel'
import { sinErroresDeBotones, sinErroresDeCampos, sinErroresDePortadas } from './errores-en-edicion'

const ERRORES: ErroresDelCarrusel = {
  segundos: 'S',
  portadas: 'P',
  portada: {
    0: { imagen: 'I', encuadre: 'E', boton: { 0: { destino: 'D' } } },
    2: { titulo: 'T' },
  },
}

describe('errores mientras se edita', () => {
  it('corregir un campo borra solo su error', () => {
    expect(sinErroresDeCampos(ERRORES, 0, ['encuadreEnCelular'])).toEqual({
      ...ERRORES,
      portada: { 0: { imagen: 'I', boton: { 0: { destino: 'D' } } }, 2: { titulo: 'T' } },
    })
  })

  it('una portada sin errores deja de figurar', () => {
    expect(sinErroresDeCampos(ERRORES, 2, ['titulo']).portada).toEqual({ 0: ERRORES.portada?.[0] })
  })

  it('tocar los botones borra los errores de los botones de esa portada', () => {
    expect(sinErroresDeBotones(ERRORES, 0).portada?.[0]).toEqual({ imagen: 'I', encuadre: 'E' })
  })

  it('agregar, quitar o mover portadas borra los errores por posición', () => {
    expect(sinErroresDePortadas(ERRORES)).toEqual({ segundos: 'S' })
  })
})
