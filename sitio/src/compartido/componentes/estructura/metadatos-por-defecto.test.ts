import { describe, expect, it } from 'vitest'

import type { DatosDelSitio } from '@/compartido/aplicacion/obtener-datos-del-sitio'

import { metadatosDeInicio, metadatosPorDefecto } from './metadatos-por-defecto'

const ORIGEN = new URL('https://sigemype.com')

const DATOS: DatosDelSitio = {
  marca: {
    nombreComercial: 'Estudio Contable JJMM',
    razonSocial: 'Estudio Contable JJMM S.A.C.',
    grupo: null,
    lema: null,
    logo: null,
    sello: null,
  },
  canales: {
    whatsapp: { texto: '', href: '' },
    llamadas: { texto: '', href: '' },
    correo: { texto: '', href: '' },
    textoDelBotonFlotante: '',
  },
  redes: [],
  seo: { titulo: 'JJMM | Estudio Contable', descripcion: 'Outsourcing contable.' },
}

describe('metadatosPorDefecto', () => {
  it('define la base de las URL, el título con plantilla y Open Graph del sitio', () => {
    expect(metadatosPorDefecto(ORIGEN, DATOS)).toEqual({
      metadataBase: ORIGEN,
      title: { default: 'JJMM | Estudio Contable', template: '%s | Estudio Contable JJMM' },
      description: 'Outsourcing contable.',
      openGraph: {
        type: 'website',
        siteName: 'Estudio Contable JJMM',
        locale: 'es_PE',
        title: 'JJMM | Estudio Contable',
        description: 'Outsourcing contable.',
      },
    })
  })

  it('sin configuración guardada solo define la base de las URL', () => {
    expect(metadatosPorDefecto(ORIGEN, null)).toEqual({ metadataBase: ORIGEN })
  })
})

describe('metadatosDeInicio', () => {
  it('fija el canonical en / y la URL de Open Graph', () => {
    expect(metadatosDeInicio(DATOS)).toEqual({
      alternates: { canonical: '/' },
      openGraph: {
        type: 'website',
        siteName: 'Estudio Contable JJMM',
        locale: 'es_PE',
        title: 'JJMM | Estudio Contable',
        description: 'Outsourcing contable.',
        url: '/',
      },
    })
  })

  it('sin configuración igual fija el canonical', () => {
    expect(metadatosDeInicio(null)).toEqual({ alternates: { canonical: '/' } })
  })
})
