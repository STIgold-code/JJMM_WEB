import { describe, expect, it } from 'vitest'

import { prepararSede, type SedeGuardada } from './sede'

const SEDE: SedeGuardada = {
  nombre: 'Sede San Isidro',
  direccion: 'Calle Gorriones 151',
  distrito: 'San Isidro',
  ciudad: 'Lima',
  celulares: ['951965242', '952 249 102'],
  correo: 'contabilidad@jjmm.com.pe',
}

describe('prepararSede', () => {
  it('arma la localidad y los enlaces de llamada y correo', () => {
    expect(prepararSede(SEDE)).toEqual({
      nombre: 'Sede San Isidro',
      direccion: 'Calle Gorriones 151',
      localidad: 'San Isidro, Lima',
      celulares: [
        { texto: '951 965 242', href: 'tel:+51951965242' },
        { texto: '952 249 102', href: 'tel:+51952249102' },
      ],
      correo: { texto: 'contabilidad@jjmm.com.pe', href: 'mailto:contabilidad@jjmm.com.pe' },
    })
  })

  it('no inventa un correo si la sede no tiene', () => {
    expect(prepararSede({ ...SEDE, correo: null }).correo).toBeNull()
  })

  it('rechaza un teléfono fijo guardado como celular (S9)', () => {
    expect(() => prepararSede({ ...SEDE, celulares: ['014567890'] })).toThrow('no es un celular')
  })
})
