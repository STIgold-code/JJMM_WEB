import { describe, expect, it } from 'vitest'

import { type ItemDeMenuGuardado, resolverItemDeMenu } from './item-de-menu'

const BASE: ItemDeMenuGuardado = {
  etiqueta: 'Planes',
  tipo: 'seccion',
  destino: '#planes',
  abrirEnNuevaPestana: false,
  imagen: null,
}

describe('resolverItemDeMenu', () => {
  it('lleva una sección al inicio, para que funcione desde cualquier página', () => {
    expect(resolverItemDeMenu(BASE)).toEqual({
      etiqueta: 'Planes',
      href: '/#planes',
      seccion: 'planes',
      externo: false,
      nuevaPestana: false,
      imagen: null,
    })
  })

  it('deja una ruta interna tal cual y sin sección', () => {
    const item = resolverItemDeMenu({
      ...BASE,
      etiqueta: 'Blog',
      tipo: 'interna',
      destino: '/blog',
    })

    expect(item).toMatchObject({ href: '/blog', seccion: null, externo: false })
  })

  it('marca como externo un sitio https y respeta la pestaña nueva y el logo', () => {
    const imagen = { url: '/api/medios/file/sigefact.png', alt: 'SIGEFact', ancho: 160, alto: 40 }
    const item = resolverItemDeMenu({
      etiqueta: 'SIGEFact',
      tipo: 'externa',
      destino: 'https://sigefact.pse.pe/',
      abrirEnNuevaPestana: true,
      imagen,
    })

    expect(item).toEqual({
      etiqueta: 'SIGEFact',
      href: 'https://sigefact.pse.pe/',
      seccion: null,
      externo: true,
      nuevaPestana: true,
      imagen,
    })
  })

  it('descarta un ítem sin destino', () => {
    expect(resolverItemDeMenu({ ...BASE, destino: null })).toBeNull()
    expect(resolverItemDeMenu({ ...BASE, destino: '' })).toBeNull()
  })

  it('descarta un destino que no corresponde a su tipo', () => {
    expect(
      resolverItemDeMenu({ ...BASE, tipo: 'externa', destino: 'http://inseguro.pe' }),
    ).toBeNull()
    expect(resolverItemDeMenu({ ...BASE, tipo: 'interna', destino: '//otro.pe' })).toBeNull()
  })
})
