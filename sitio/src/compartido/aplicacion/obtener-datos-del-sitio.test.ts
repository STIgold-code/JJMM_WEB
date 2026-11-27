import { describe, expect, it } from 'vitest'

import type { ConfiguracionDelSitio } from '../dominio/configuracion-del-sitio'
import { crearObtenerDatosDelSitio } from './obtener-datos-del-sitio'
import type { RepositorioConfiguracion } from './repositorio-configuracion'

const CONFIGURACION: ConfiguracionDelSitio = {
  marca: {
    nombreComercial: 'Estudio Contable JJMM',
    razonSocial: 'Estudio Contable JJMM S.A.C.',
    grupo: null,
    lema: null,
    logo: null,
    sello: null,
  },
  contacto: {
    correo: 'contabilidad@jjmm.com.pe',
    celularWhatsApp: '951965242',
    mensajeWhatsApp: 'Hola',
    celularDeLlamadas: '952249102',
    textoDelBotonFlotante: 'Escríbenos',
  },
  redes: [],
  seo: { titulo: 'JJMM', descripcion: 'Estudio contable.' },
}

const repositorioCon = (valor: ConfiguracionDelSitio | null): RepositorioConfiguracion => ({
  obtener: async () => valor,
})

describe('crearObtenerDatosDelSitio', () => {
  it('prepara los canales de contacto con sus enlaces', async () => {
    const datos = await crearObtenerDatosDelSitio(repositorioCon(CONFIGURACION))()

    expect(datos?.canales).toEqual({
      whatsapp: { texto: '951 965 242', href: 'https://wa.me/51951965242?text=Hola' },
      llamadas: { texto: '952 249 102', href: 'tel:+51952249102' },
      correo: { texto: 'contabilidad@jjmm.com.pe', href: 'mailto:contabilidad@jjmm.com.pe' },
      textoDelBotonFlotante: 'Escríbenos',
    })
    expect(datos?.marca).toBe(CONFIGURACION.marca)
  })

  it('devuelve null si la configuración aún no existe', async () => {
    expect(await crearObtenerDatosDelSitio(repositorioCon(null))()).toBeNull()
  })
})
