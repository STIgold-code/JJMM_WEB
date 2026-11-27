import { describe, expect, it } from 'vitest'

import {
  type DatosDelEstudio,
  datosEstructuradosDelEstudio,
} from './datos-estructurados-del-estudio'

const ORIGEN = new URL('https://sigemype.com')

const SEDE: DatosDelEstudio['sedes'][number] = {
  nombre: 'Sede Lima',
  direccion: 'Av. Ejemplo 123',
  localidad: 'Cercado de Lima, Lima',
  telefonos: ['+51951965242', '+51952249102'],
  correo: null,
}

const DATOS: DatosDelEstudio = {
  nombre: 'Estudio Contable JJMM',
  razonSocial: 'Estudio Contable JJMM S.A.C.',
  logo: '/api/medios/file/logo.webp',
  correo: 'contabilidad@jjmm.com.pe',
  telefonos: ['+51951965242'],
  redes: ['https://www.facebook.com/EstudioContableJJMM/'],
  sedes: [SEDE],
}

describe('datosEstructuradosDelEstudio', () => {
  it('describe el estudio como AccountingService con los datos del panel', () => {
    expect(datosEstructuradosDelEstudio(ORIGEN, DATOS)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'AccountingService',
      '@id': 'https://sigemype.com/#estudio',
      name: 'Estudio Contable JJMM',
      legalName: 'Estudio Contable JJMM S.A.C.',
      url: 'https://sigemype.com/',
      email: 'contabilidad@jjmm.com.pe',
      telephone: ['+51951965242', '+51952249102'],
      logo: 'https://sigemype.com/api/medios/file/logo.webp',
      image: 'https://sigemype.com/api/medios/file/logo.webp',
      sameAs: ['https://www.facebook.com/EstudioContableJJMM/'],
      address: [
        {
          '@type': 'PostalAddress',
          streetAddress: 'Av. Ejemplo 123',
          addressLocality: 'Cercado de Lima, Lima',
          addressCountry: 'PE',
        },
      ],
      department: [
        {
          '@type': 'AccountingService',
          name: 'Sede Lima',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Av. Ejemplo 123',
            addressLocality: 'Cercado de Lima, Lima',
            addressCountry: 'PE',
          },
          telephone: ['+51951965242', '+51952249102'],
        },
      ],
    })
  })

  it('no inventa lo que el panel no tiene: sin logo, redes ni sedes, omite esos campos', () => {
    const datos = datosEstructuradosDelEstudio(ORIGEN, {
      ...DATOS,
      logo: null,
      redes: [],
      sedes: [],
    })

    expect(datos).not.toHaveProperty('logo')
    expect(datos).not.toHaveProperty('image')
    expect(datos).not.toHaveProperty('sameAs')
    expect(datos).not.toHaveProperty('address')
    expect(datos).not.toHaveProperty('department')
    expect(datos.telephone).toEqual(['+51951965242'])
  })

  it('incluye el correo de la sede solo si existe', () => {
    const conCorreo = { ...DATOS, sedes: [{ ...SEDE, correo: 'lima@jjmm.com.pe' }] }

    const { department } = datosEstructuradosDelEstudio(ORIGEN, conCorreo)

    expect(department).toEqual([expect.objectContaining({ email: 'lima@jjmm.com.pe' })])
  })
})
