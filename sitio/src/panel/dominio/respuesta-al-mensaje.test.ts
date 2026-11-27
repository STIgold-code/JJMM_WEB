import { describe, expect, it } from 'vitest'

import {
  avisoDeCambioDeEstado,
  enlacesDeRespuesta,
  validarDatosDeContacto,
} from './respuesta-al-mensaje'

describe('enlacesDeRespuesta', () => {
  it('con un celular arma WhatsApp y llamada con el código de Perú', () => {
    expect(enlacesDeRespuesta('951965242')).toEqual({
      celular: '951 965 242',
      whatsapp: 'https://wa.me/51951965242',
      llamada: 'tel:+51951965242',
    })
  })

  it('sin celular, o con uno que no es celular, no hay enlaces (nunca uno roto)', () => {
    expect(enlacesDeRespuesta(null)).toBeNull()
    expect(enlacesDeRespuesta('')).toBeNull()
    expect(enlacesDeRespuesta('014567890')).toBeNull()
  })
})

describe('validarDatosDeContacto', () => {
  it('normaliza el celular al formato de 3 en 3 y limpia el correo', () => {
    expect(validarDatosDeContacto({ celular: ' 951965242 ', correo: ' ana@correo.pe ' })).toEqual({
      valido: true,
      datos: { celular: '951 965 242', correo: 'ana@correo.pe' },
    })
  })

  it('los dos son opcionales: vacíos se guardan como sin dato', () => {
    expect(validarDatosDeContacto({ celular: '', correo: '  ' })).toEqual({
      valido: true,
      datos: { celular: null, correo: null },
    })
  })

  it('rechaza teléfonos fijos y celulares mal escritos', () => {
    for (const celular of ['014567890', '95196524', '851965242', 'abc']) {
      expect(validarDatosDeContacto({ celular, correo: '' })).toEqual({
        valido: false,
        errores: { celular: 'Escribe un celular de 9 dígitos que empiece con 9.' },
      })
    }
  })

  it('rechaza un correo mal escrito', () => {
    expect(validarDatosDeContacto({ celular: '', correo: 'ana@correo' })).toEqual({
      valido: false,
      errores: { correo: 'Escribe un correo válido, por ejemplo nombre@correo.com.' },
    })
  })

  it('rechaza los correos que la validación `email` de Payload rechaza', () => {
    for (const correo of [
      'juan@gmail.c',
      'juan@gmail..com',
      'josé.pérez@gmail.com',
      'juan@mi_empresa.com',
      'juan.@gmail.com',
      'juan@gmail.com,',
    ]) {
      expect(validarDatosDeContacto({ celular: '', correo }).valido).toBe(false)
    }
  })

  it('acepta los formatos de correo habituales', () => {
    for (const correo of ['ana.ruiz+jjmm@correo.com.pe', 'a-b@sub.ex--ample.org', 'X@Y.PE']) {
      expect(validarDatosDeContacto({ celular: '', correo }).valido).toBe(true)
    }
  })

  it('lo que no es texto cuenta como vacío', () => {
    expect(validarDatosDeContacto({ celular: null, correo: 7 })).toEqual({
      valido: true,
      datos: { celular: null, correo: null },
    })
  })
})

describe('avisoDeCambioDeEstado', () => {
  it('dice qué pasó y qué significa para el inicio', () => {
    expect(avisoDeCambioDeEstado('Ana', 'atendido')).toEqual({
      titulo: 'Mensaje de Ana atendido',
      detalle: 'Ya no cuenta como pendiente en el inicio.',
    })
    expect(avisoDeCambioDeEstado('Ana', 'nuevo')).toEqual({
      titulo: 'Mensaje de Ana vuelve a «Nuevo»',
      detalle: 'Vuelve a contar como pendiente.',
    })
  })
})
