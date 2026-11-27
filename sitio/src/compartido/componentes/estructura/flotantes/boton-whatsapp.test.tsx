import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { metadatosPorDefecto } from '../metadatos-por-defecto'
import { BotonWhatsApp } from './boton-whatsapp'

describe('BotonWhatsApp', () => {
  it('enlaza al chat con el texto de la configuración y un nombre accesible completo', () => {
    const html = renderToStaticMarkup(
      <BotonWhatsApp href="https://wa.me/51951965242?text=Hola" texto="Escríbenos" />,
    )

    expect(html).toContain('href="https://wa.me/51951965242?text=Hola"')
    expect(html).toContain('>Escríbenos</span>')
    expect(html).toContain('<span class="oculto"> por WhatsApp</span>')
  })
})

describe('metadatosPorDefecto', () => {
  it('usa el título como valor por defecto y como plantilla con el nombre comercial', () => {
    const metadatos = metadatosPorDefecto({
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
    })

    expect(metadatos).toEqual({
      title: { default: 'JJMM | Estudio Contable', template: '%s | Estudio Contable JJMM' },
      description: 'Outsourcing contable.',
    })
  })

  it('no define nada si la configuración no existe', () => {
    expect(metadatosPorDefecto(null)).toEqual({})
  })
})
