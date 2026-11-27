import { describe, expect, it } from 'vitest'

import { tarjetasDeAtencion } from './atencion'

describe('tarjetasDeAtencion', () => {
  it('toma color (pendiente) solo cuando hay algo pendiente', () => {
    const tarjetas = tarjetasDeAtencion({ mensajesNuevos: 2, borradores: 0, datosPorCompletar: 1 })
    expect(
      tarjetas.map(({ clave, cantidad, pendiente }) => ({ clave, cantidad, pendiente })),
    ).toEqual([
      { clave: 'mensajes', cantidad: 2, pendiente: true },
      { clave: 'borradores', cantidad: 0, pendiente: false },
      { clave: 'datos', cantidad: 1, pendiente: true },
    ])
  })

  it('el texto de apoyo cambia según haya o no pendientes', () => {
    const [conMensajes] = tarjetasDeAtencion({
      mensajesNuevos: 1,
      borradores: null,
      datosPorCompletar: null,
    })
    const [sinMensajes] = tarjetasDeAtencion({
      mensajesNuevos: 0,
      borradores: null,
      datosPorCompletar: null,
    })
    expect(conMensajes?.detalle).toBe('Respóndelos y márcalos como atendidos')
    expect(sinMensajes?.detalle).toBe('Todos los mensajes están atendidos')
  })

  it('no muestra la tarjeta de lo que la cuenta no puede leer (null), nunca un cero inventado', () => {
    const tarjetas = tarjetasDeAtencion({
      mensajesNuevos: null,
      borradores: 4,
      datosPorCompletar: null,
    })
    expect(tarjetas.map((t) => t.clave)).toEqual(['borradores'])
  })

  it('los mensajes y borradores llevan a su lista filtrada en /admin; los datos, a la lista de abajo', () => {
    const tarjetas = tarjetasDeAtencion({ mensajesNuevos: 1, borradores: 1, datosPorCompletar: 1 })
    expect(tarjetas.map((t) => t.href)).toEqual([
      '/admin/collections/mensajes-de-contacto?where[estado][equals]=nuevo',
      '/admin/collections/publicaciones?where[_status][equals]=draft',
      '#lo-que-falta',
    ])
  })
})
