import { describe, expect, it } from 'vitest'

import { seleccionarSimilares } from './similares'

const conSlug = (slug: string) => ({ slug })

describe('seleccionarSimilares', () => {
  it('excluye la publicación actual y conserva el orden recibido', () => {
    const candidatas = ['a', 'actual', 'b'].map(conSlug)

    expect(seleccionarSimilares('actual', candidatas)).toEqual([conSlug('a'), conSlug('b')])
  })

  it('devuelve como máximo tres', () => {
    const candidatas = ['a', 'b', 'c', 'd'].map(conSlug)

    expect(seleccionarSimilares('actual', candidatas).map(({ slug }) => slug)).toEqual([
      'a',
      'b',
      'c',
    ])
  })

  it('devuelve tres aunque la actual esté entre las cuatro primeras', () => {
    const candidatas = ['a', 'actual', 'b', 'c'].map(conSlug)

    expect(seleccionarSimilares('actual', candidatas)).toHaveLength(3)
  })

  it('sin otras publicaciones de la categoría no hay similares', () => {
    expect(seleccionarSimilares('actual', [conSlug('actual')])).toEqual([])
  })
})
