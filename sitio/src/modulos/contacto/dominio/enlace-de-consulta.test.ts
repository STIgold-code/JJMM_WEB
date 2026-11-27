import { describe, expect, it } from 'vitest'

import { enlaceDeConsulta } from './enlace-de-consulta'

const CONTACTO = {
  celularWhatsApp: '951 965 242',
  mensajeWhatsApp: 'Hola, quiero información sobre sus servicios contables.',
}

describe('enlaceDeConsulta', () => {
  it('arma el enlace de WhatsApp con el mensaje propio de la consulta', () => {
    const enlace = enlaceDeConsulta(CONTACTO, 'Hola, quiero información del plan Emprende.')

    expect(enlace.href).toBe(
      'https://wa.me/51951965242?text=Hola%2C%20quiero%20informaci%C3%B3n%20del%20plan%20Emprende.',
    )
    expect(enlace.texto).toBe('951 965 242')
  })

  it('usa el mensaje de la configuración si la consulta no trae uno', () => {
    expect(enlaceDeConsulta(CONTACTO, null).href).toContain('sobre%20sus%20servicios')
    expect(enlaceDeConsulta(CONTACTO, '   ').href).toContain('sobre%20sus%20servicios')
    expect(enlaceDeConsulta(CONTACTO).href).toContain('sobre%20sus%20servicios')
  })

  it('no publica un teléfono fijo', () => {
    expect(() => enlaceDeConsulta({ ...CONTACTO, celularWhatsApp: '014567890' }, 'Hola')).toThrow(
      'no es un celular',
    )
  })
})
