import { describe, expect, it } from 'vitest'

import { armarPendientes, type ConteosDelInicio } from './cifras-del-panel'

const CONTEOS: ConteosDelInicio = { mensajesNuevos: 3, borradores: 2 }

describe('armarPendientes', () => {
  it('lista lo que pide acción: primero los mensajes por responder y luego los borradores', () => {
    const pendientes = armarPendientes(CONTEOS, '/admin')

    expect(pendientes).toEqual([
      {
        clave: 'mensajes',
        texto: '3 mensajes nuevos por responder',
        accion: 'Ver los mensajes',
        href: '/admin/collections/mensajes-de-contacto?where[estado][equals]=nuevo',
        icono: 'mensaje',
        urgente: true,
      },
      {
        clave: 'borradores',
        texto: '2 borradores sin publicar en el blog',
        accion: 'Ver las publicaciones',
        href: '/admin/collections/publicaciones',
        icono: 'pluma',
        urgente: false,
      },
    ])
  })

  it('usa el singular cuando hay uno', () => {
    const [mensaje, borrador] = armarPendientes({ mensajesNuevos: 1, borradores: 1 }, '/admin')

    expect(mensaje?.texto).toBe('1 mensaje nuevo por responder')
    expect(borrador?.texto).toBe('1 borrador sin publicar en el blog')
  })

  it('no lista lo que está en cero: sin pendientes, la lista queda vacía', () => {
    expect(armarPendientes({ mensajesNuevos: 0, borradores: 0 }, '/admin')).toEqual([])
    expect(
      armarPendientes({ mensajesNuevos: 0, borradores: 4 }, '/admin').map(({ clave }) => clave),
    ).toEqual(['borradores'])
  })

  it('omite lo que la cuenta no puede leer, sin inventar ceros', () => {
    const parcial = armarPendientes({ mensajesNuevos: null, borradores: 2 }, '/admin')

    expect(parcial.map(({ clave }) => clave)).toEqual(['borradores'])
  })
})
