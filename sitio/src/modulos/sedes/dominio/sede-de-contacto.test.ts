import { describe, expect, it } from 'vitest'

import { prepararSedeDeContacto, type SedeDeContactoGuardada } from './sede-de-contacto'

const SEDE: SedeDeContactoGuardada = {
  nombre: 'Sede San Martín de Porres',
  direccion: 'Jr. Iquitos 593',
  distrito: 'San Martín de Porres',
  ciudad: 'Lima',
  celulares: [
    { numero: '951 965 242', tieneWhatsApp: true },
    { numero: '952 249 102', tieneWhatsApp: false },
  ],
  mapaIncrustado: null,
}

const MENSAJE = 'Hola, quiero información sobre sus servicios contables.'

describe('prepararSedeDeContacto', () => {
  it('arma la pestaña, la dirección, WhatsApp, llamada, cómo llegar y el mapa', () => {
    const sede = prepararSedeDeContacto(SEDE, MENSAJE)

    expect(sede).toEqual({
      nombre: 'Sede San Martín de Porres',
      pestana: 'San Martín de Porres',
      direccion: 'Jr. Iquitos 593, San Martín de Porres, Lima',
      whatsapp: {
        texto: '951 965 242',
        href: `https://wa.me/51951965242?text=${encodeURIComponent(MENSAJE)}`,
      },
      llamada: { texto: '952 249 102', href: 'tel:+51952249102' },
      comoLlegar: expect.stringMatching(/^https:\/\/www\.google\.com\/maps\/search\/\?api=1&/),
      mapa: expect.stringMatching(/^https:\/\/www\.google\.com\/maps\?q=Jr\.%20Iquitos/),
    })
  })

  it('sin celular con WhatsApp no ofrece WhatsApp y llama al primero', () => {
    const sede = prepararSedeDeContacto(
      { ...SEDE, celulares: [{ numero: '952249102', tieneWhatsApp: false }] },
      MENSAJE,
    )

    expect(sede.whatsapp).toBeNull()
    expect(sede.llamada?.href).toBe('tel:+51952249102')
  })

  it('con un solo celular con WhatsApp lo usa también para llamar', () => {
    const sede = prepararSedeDeContacto(
      { ...SEDE, celulares: [{ numero: '951965242', tieneWhatsApp: true }] },
      MENSAJE,
    )

    expect(sede.whatsapp?.texto).toBe('951 965 242')
    expect(sede.llamada?.href).toBe('tel:+51951965242')
  })

  it('sin celulares no ofrece WhatsApp ni llamada', () => {
    const sede = prepararSedeDeContacto({ ...SEDE, celulares: [] }, MENSAJE)

    expect(sede.whatsapp).toBeNull()
    expect(sede.llamada).toBeNull()
  })

  it('rechaza un teléfono fijo guardado como celular (S9)', () => {
    const conFijo = { ...SEDE, celulares: [{ numero: '014567890', tieneWhatsApp: false }] }

    expect(() => prepararSedeDeContacto(conFijo, MENSAJE)).toThrow('no es un celular')
  })
})
