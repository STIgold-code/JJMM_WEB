import { describe, expect, it } from 'vitest'

import type { DatosDelSitio } from '@/compartido/aplicacion/obtener-datos-del-sitio'
import { prepararCanalesDeContacto } from '@/compartido/dominio/canales-de-contacto'
import { prepararSede } from '@/modulos/sedes/dominio/sede'

import { datosDelEstudio } from './datos-del-estudio'

const SITIO: DatosDelSitio = {
  marca: {
    nombreComercial: 'Estudio Contable JJMM',
    razonSocial: 'Estudio Contable JJMM S.A.C.',
    grupo: null,
    lema: null,
    logo: { url: '/api/medios/file/logo.webp', alt: 'Logo', ancho: 200, alto: 80 },
    sello: null,
  },
  canales: prepararCanalesDeContacto({
    correo: 'contabilidad@jjmm.com.pe',
    celularWhatsApp: '951965242',
    mensajeWhatsApp: 'Hola',
    celularDeLlamadas: '952 249 102',
    textoDelBotonFlotante: 'Escríbenos',
  }),
  redes: [{ red: 'facebook', url: 'https://www.facebook.com/EstudioContableJJMM/' }],
  seo: { titulo: 'JJMM', descripcion: 'Estudio contable' },
}

const SEDE = prepararSede({
  nombre: 'Sede Lima',
  direccion: 'Av. Ejemplo 123',
  distrito: 'Cercado de Lima',
  ciudad: 'Lima',
  celulares: ['951 965 242'],
  correo: null,
})

describe('datosDelEstudio', () => {
  it('toma la marca, los celulares publicados en formato internacional, las redes y las sedes', () => {
    expect(datosDelEstudio(SITIO, [SEDE])).toEqual({
      nombre: 'Estudio Contable JJMM',
      razonSocial: 'Estudio Contable JJMM S.A.C.',
      logo: '/api/medios/file/logo.webp',
      correo: 'contabilidad@jjmm.com.pe',
      telefonos: ['+51952249102'],
      redes: ['https://www.facebook.com/EstudioContableJJMM/'],
      sedes: [
        {
          nombre: 'Sede Lima',
          direccion: 'Av. Ejemplo 123',
          localidad: 'Cercado de Lima, Lima',
          telefonos: ['+51951965242'],
          correo: null,
        },
      ],
    })
  })

  it('sin logo lo deja nulo', () => {
    const sinLogo = { ...SITIO, marca: { ...SITIO.marca, logo: null } }

    expect(datosDelEstudio(sinLogo, []).logo).toBeNull()
  })
})
