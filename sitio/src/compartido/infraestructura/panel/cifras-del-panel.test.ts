import { describe, expect, it } from 'vitest'

import { armarCifras, type ConteosDelInicio } from './cifras-del-panel'

const CONTEOS: ConteosDelInicio = {
  mensajesNuevos: 3,
  publicadas: 12,
  borradores: 2,
  avisosVisibles: 1,
  sedesActivas: 2,
}

describe('armarCifras', () => {
  const cifras = armarCifras(CONTEOS, '/admin')
  const cifra = (clave: string) => cifras.find((c) => c.clave === clave)

  it('muestra cuatro cifras reales, en este orden', () => {
    expect(cifras.map(({ clave }) => clave)).toEqual([
      'mensajes',
      'publicaciones',
      'avisos',
      'sedes',
    ])
    expect(cifras.map(({ valor }) => valor)).toEqual([3, 12, 1, 2])
  })

  it('destaca los mensajes nuevos y lleva a la lista filtrada', () => {
    expect(cifra('mensajes')).toMatchObject({
      etiqueta: 'mensajes nuevos',
      detalle: 'Por responder',
      destacada: true,
      href: '/admin/collections/mensajes-de-contacto?where[estado][equals]=nuevo',
    })
  })

  it('sin mensajes nuevos, no destaca nada', () => {
    const sinMensajes = armarCifras({ ...CONTEOS, mensajesNuevos: 0 }, '/admin')
    expect(sinMensajes[0]).toMatchObject({ destacada: false, detalle: 'Todo al día' })
  })

  it('cuenta los borradores junto a las publicaciones', () => {
    expect(cifra('publicaciones')?.detalle).toBe('2 borradores sin publicar')
    const unBorrador = armarCifras({ ...CONTEOS, borradores: 1 }, '/admin')
    expect(unBorrador[1]?.detalle).toBe('1 borrador sin publicar')
    const ninguno = armarCifras({ ...CONTEOS, borradores: 0 }, '/admin')
    expect(ninguno[1]?.detalle).toBe('Ningún borrador pendiente')
  })

  it('usa el singular cuando hay uno', () => {
    expect(cifra('avisos')?.etiqueta).toBe('aviso visible')
    expect(cifra('sedes')?.etiqueta).toBe('sedes activas')
  })

  it('omite lo que la cuenta no puede leer, sin inventar ceros', () => {
    const parcial = armarCifras({ ...CONTEOS, mensajesNuevos: null, sedesActivas: null }, '/admin')
    expect(parcial.map(({ clave }) => clave)).toEqual(['publicaciones', 'avisos'])
  })
})
