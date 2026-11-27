import { describe, expect, it } from 'vitest'

import {
  cambiaLoPublico,
  etiquetaDeColeccion,
  etiquetaDeDocumento,
  etiquetaDeGlobal,
  etiquetasDeCambioEnColeccion,
} from './etiquetas-de-cache'

describe('etiquetas de caché', () => {
  it('nombra cada etiqueta por su tipo y su slug', () => {
    expect(etiquetaDeColeccion('planes')).toBe('coleccion:planes')
    expect(etiquetaDeGlobal('pagina-de-inicio')).toBe('global:pagina-de-inicio')
    expect(etiquetaDeDocumento('publicaciones', 'cierre-2026')).toBe(
      'documento:publicaciones:cierre-2026',
    )
  })

  it('una colección sin etiqueta por documento solo invalida la colección', () => {
    expect(etiquetasDeCambioEnColeccion('planes', ['plan-a'])).toEqual(['coleccion:planes'])
  })

  it('una publicación invalida la colección y cada slug distinto, sin repetir', () => {
    expect(
      etiquetasDeCambioEnColeccion('publicaciones', ['nuevo', 'anterior', 'nuevo', null, '']),
    ).toEqual([
      'coleccion:publicaciones',
      'documento:publicaciones:nuevo',
      'documento:publicaciones:anterior',
    ])
  })

  it('sin slugs, una publicación solo invalida la colección', () => {
    expect(etiquetasDeCambioEnColeccion('publicaciones', [undefined])).toEqual([
      'coleccion:publicaciones',
    ])
  })
})

describe('cambiaLoPublico', () => {
  it('publicar cambia lo público', () => {
    expect(cambiaLoPublico({ estadoNuevo: 'published', estabaPublicada: false })).toBe(true)
  })

  it('un borrador de algo que nunca fue público no cambia lo público', () => {
    expect(cambiaLoPublico({ estadoNuevo: 'draft', estabaPublicada: false })).toBe(false)
  })

  it('despublicar o guardar un borrador sobre lo publicado sí lo cambia', () => {
    expect(cambiaLoPublico({ estadoNuevo: 'draft', estabaPublicada: true })).toBe(true)
  })
})
