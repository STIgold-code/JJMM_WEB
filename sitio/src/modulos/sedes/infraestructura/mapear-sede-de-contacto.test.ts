import { describe, expect, it } from 'vitest'

import type { Sede } from '@/payload-types'

import { mapearSedeDeContacto } from './mapear-sede-de-contacto'
import { validarMapaIncrustadoOpcional } from './validar-mapa-incrustado'

const SEDE: Sede = {
  id: 1,
  nombre: 'Sede San Isidro',
  direccion: 'Calle Gorriones 151',
  distrito: 'San Isidro',
  ciudad: 'Lima',
  celulares: [
    { numero: '951965242', tieneWhatsApp: true },
    { numero: '952249102', tieneWhatsApp: null },
  ],
  enlaceDeMapa: ' https://www.google.com/maps/embed?pb=1 ',
  orden: 2,
  activo: true,
  updatedAt: '',
  createdAt: '',
}

describe('mapearSedeDeContacto', () => {
  it('toma los celulares con su marca de WhatsApp y el mapa del panel', () => {
    expect(mapearSedeDeContacto(SEDE)).toEqual({
      nombre: 'Sede San Isidro',
      direccion: 'Calle Gorriones 151',
      distrito: 'San Isidro',
      ciudad: 'Lima',
      celulares: [
        { numero: '951965242', tieneWhatsApp: true },
        { numero: '952249102', tieneWhatsApp: false },
      ],
      mapaIncrustado: 'https://www.google.com/maps/embed?pb=1',
    })
  })

  it('sin mapa ni celulares guardados no inventa datos', () => {
    const sede = mapearSedeDeContacto({ ...SEDE, enlaceDeMapa: '  ', celulares: null })

    expect(sede.mapaIncrustado).toBeNull()
    expect(sede.celulares).toEqual([])
  })
})

describe('validarMapaIncrustadoOpcional', () => {
  it('acepta vacío o la dirección de inserción de Google Maps', () => {
    expect(validarMapaIncrustadoOpcional('')).toBe(true)
    expect(validarMapaIncrustadoOpcional(null)).toBe(true)
    expect(validarMapaIncrustadoOpcional('https://www.google.com/maps/embed?pb=1')).toBe(true)
  })

  it('rechaza cualquier otra dirección con un mensaje para quien edita', () => {
    expect(validarMapaIncrustadoOpcional('https://maps.app.goo.gl/x')).toMatch(
      /^Pega la dirección del mapa insertado de Google Maps/,
    )
  })
})
