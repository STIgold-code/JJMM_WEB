import { describe, expect, it } from 'vitest'

import type { ContactoDelSitio } from '@/compartido/dominio/configuracion-del-sitio'

import { type AccionGuardada, resolverAccion } from './accion-de-portada'

const CONTACTO: ContactoDelSitio = {
  correo: 'contabilidad@jjmm.com.pe',
  celularWhatsApp: '951965242',
  mensajeWhatsApp: 'Hola, quiero información.',
  celularDeLlamadas: '952 249 102',
  textoDelBotonFlotante: 'Escríbenos',
}

const accion = (cambios: Partial<AccionGuardada>): AccionGuardada => ({
  etiqueta: 'Asesoría gratuita',
  tipo: 'whatsapp',
  mensaje: null,
  destino: null,
  estilo: 'principal',
  ...cambios,
})

describe('resolverAccion', () => {
  it('lleva a WhatsApp con el mensaje del botón y el celular de la configuración', () => {
    const resuelta = resolverAccion(accion({ mensaje: 'Hola, quiero un diagnóstico.' }), CONTACTO)

    expect(resuelta).toEqual({
      etiqueta: 'Asesoría gratuita',
      estilo: 'principal',
      href: 'https://wa.me/51951965242?text=Hola%2C%20quiero%20un%20diagn%C3%B3stico.',
      icono: 'whatsapp',
      externo: false,
    })
  })

  it('usa el mensaje por defecto si el botón de WhatsApp no tiene uno', () => {
    expect(resolverAccion(accion({}), CONTACTO)?.href).toBe(
      'https://wa.me/51951965242?text=Hola%2C%20quiero%20informaci%C3%B3n.',
    )
  })

  it('llama al celular de llamadas de la configuración', () => {
    const resuelta = resolverAccion(accion({ tipo: 'llamada', estilo: 'secundario' }), CONTACTO)

    expect(resuelta?.href).toBe('tel:+51952249102')
    expect(resuelta?.icono).toBe('telefono')
    expect(resuelta?.estilo).toBe('secundario')
  })

  it('enlaza una sección, una página interna o un sitio externo', () => {
    expect(resolverAccion(accion({ tipo: 'seccion', destino: '#planes' }), CONTACTO)).toMatchObject(
      { href: '#planes', icono: null, externo: false },
    )
    expect(resolverAccion(accion({ tipo: 'interna', destino: '/guia' }), CONTACTO)?.href).toBe(
      '/guia',
    )
    expect(
      resolverAccion(accion({ tipo: 'externa', destino: 'https://sigefact.pse.pe/' }), CONTACTO),
    ).toMatchObject({ href: 'https://sigefact.pse.pe/', externo: true })
  })

  it('no publica un botón sin destino o con un destino inválido para su tipo', () => {
    expect(resolverAccion(accion({ tipo: 'seccion', destino: null }), CONTACTO)).toBeNull()
    expect(resolverAccion(accion({ tipo: 'seccion', destino: '/guia' }), CONTACTO)).toBeNull()
    expect(resolverAccion(accion({ tipo: 'externa', destino: 'http://x.pe' }), CONTACTO)).toBeNull()
  })
})
