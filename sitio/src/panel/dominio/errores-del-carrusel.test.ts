import { describe, expect, it } from 'vitest'

import {
  ERROR_DE_DESTINO,
  ERROR_DE_SEGUNDOS,
  ERROR_IMAGEN_INEXISTENTE,
  ERROR_SIN_PORTADAS,
  erroresDePayloadDelCarrusel,
  primeraPortadaConErrores,
} from './errores-del-carrusel'

describe('erroresDePayloadDelCarrusel', () => {
  it('lleva cada campo rechazado por Payload a su portada y a su botón', () => {
    expect(
      erroresDePayloadDelCarrusel([
        'segundosPorPortada',
        'portadas',
        'portadas.1.imagen',
        'portadas.0.acciones.1.destino',
      ]),
    ).toEqual({
      segundos: ERROR_DE_SEGUNDOS,
      portadas: ERROR_SIN_PORTADAS,
      portada: {
        1: { imagen: ERROR_IMAGEN_INEXISTENTE },
        0: { boton: { 1: { destino: ERROR_DE_DESTINO } } },
      },
    })
  })

  it('une los errores de una misma portada', () => {
    expect(
      erroresDePayloadDelCarrusel(['portadas.0.sello', 'portadas.0.acciones.0.etiqueta']),
    ).toEqual({
      portada: {
        0: { sello: ERROR_IMAGEN_INEXISTENTE, boton: { 0: { etiqueta: expect.any(String) } } },
      },
    })
  })

  it('un campo que el panel no conoce (por ejemplo, de otra sección) no tiene dónde mostrarse', () => {
    expect(erroresDePayloadDelCarrusel(['secciones.3.titulo'])).toBeNull()
    expect(erroresDePayloadDelCarrusel(['portadas.0.disposicion'])).toBeNull()
  })
})

describe('primeraPortadaConErrores', () => {
  it('es la de menor posición, o null si ninguna tiene errores', () => {
    expect(primeraPortadaConErrores({ portada: { 3: { titulo: 'T' }, 1: { imagen: 'I' } } })).toBe(
      1,
    )
    expect(primeraPortadaConErrores({ segundos: 'S' })).toBeNull()
  })
})
