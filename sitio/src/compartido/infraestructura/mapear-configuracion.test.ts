import { describe, expect, it } from 'vitest'

import type { ConfiguracionDelSitio as ConfiguracionPayload, Medio } from '@/payload-types'

import { mapearConfiguracion } from './mapear-configuracion'

const LOGO: Medio = {
  id: 1,
  alt: 'JJMM, Estudio Contable',
  url: '/api/medios/file/logo-jjmm.png',
  width: 223,
  height: 125,
  updatedAt: '',
  createdAt: '',
}

const GUARDADA: ConfiguracionPayload = {
  id: 1,
  marca: {
    nombreComercial: 'Estudio Contable JJMM',
    razonSocial: 'Estudio Contable JJMM S.A.C.',
    grupo: 'Grupo JJMM',
    lema: null,
    logo: LOGO,
    sello: 4,
  },
  contacto: {
    correo: 'contabilidad@jjmm.com.pe',
    celularWhatsApp: '951 965 242',
    mensajeWhatsApp: 'Hola',
    celularDeLlamadas: '952 249 102',
    textoDelBotonFlotante: 'Escríbenos',
  },
  redesSociales: [{ red: 'facebook', url: 'https://www.facebook.com/jjmm', id: 'a' }],
  seo: { titulo: 'JJMM | Estudio Contable', descripcion: 'Outsourcing contable.' },
}

describe('mapearConfiguracion', () => {
  it('convierte la global guardada al modelo del sitio', () => {
    expect(mapearConfiguracion(GUARDADA)).toEqual({
      marca: {
        nombreComercial: 'Estudio Contable JJMM',
        razonSocial: 'Estudio Contable JJMM S.A.C.',
        grupo: 'Grupo JJMM',
        lema: null,
        logo: { url: LOGO.url, alt: LOGO.alt, ancho: 223, alto: 125 },
        sello: null,
      },
      contacto: GUARDADA.contacto,
      redes: [{ red: 'facebook', url: 'https://www.facebook.com/jjmm' }],
      seo: { titulo: 'JJMM | Estudio Contable', descripcion: 'Outsourcing contable.' },
    })
  })

  it('devuelve null si la global nunca se guardó', () => {
    expect(mapearConfiguracion({ id: 1 })).toBeNull()
  })

  it('devuelve null si falta un dato obligatorio de contacto', () => {
    const sinCorreo = { ...GUARDADA, contacto: { ...GUARDADA.contacto, correo: '' } }

    expect(mapearConfiguracion(sinCorreo)).toBeNull()
  })

  it('trata la lista de redes vacía o ausente como ninguna red', () => {
    expect(mapearConfiguracion({ ...GUARDADA, redesSociales: null })?.redes).toEqual([])
  })
})
