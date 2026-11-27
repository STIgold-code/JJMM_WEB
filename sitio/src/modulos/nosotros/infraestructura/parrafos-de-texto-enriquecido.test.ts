import { describe, expect, it } from 'vitest'

import type { BloqueQuienesSomos } from '@/payload-types'

import { parrafosDeTextoEnriquecido } from './parrafos-de-texto-enriquecido'

type Raiz = BloqueQuienesSomos['presentacion']

const texto = (contenido: string, format = 0) => ({
  type: 'text',
  text: contenido,
  format,
  version: 1,
})

const raiz = (children: Raiz['root']['children']): Raiz => ({
  root: { type: 'root', children, direction: 'ltr', format: '', indent: 0, version: 1 },
})

describe('parrafosDeTextoEnriquecido', () => {
  it('convierte cada párrafo en segmentos y marca las negritas como resaltadas', () => {
    const parrafos = parrafosDeTextoEnriquecido(
      raiz([
        {
          type: 'paragraph',
          version: 1,
          children: [texto('Somos el '), texto('Estudio Contable JJMM', 1), texto('.')],
        },
        { type: 'paragraph', version: 1, children: [texto('Segundo párrafo.')] },
      ]),
    )

    expect(parrafos).toEqual([
      [
        { texto: 'Somos el ', resaltado: false },
        { texto: 'Estudio Contable JJMM', resaltado: true },
        { texto: '.', resaltado: false },
      ],
      [{ texto: 'Segundo párrafo.', resaltado: false }],
    ])
  })

  it('reconoce la negrita combinada con otros formatos', () => {
    const parrafos = parrafosDeTextoEnriquecido(
      raiz([{ type: 'paragraph', version: 1, children: [texto('negrita y cursiva', 3)] }]),
    )

    expect(parrafos).toEqual([[{ texto: 'negrita y cursiva', resaltado: true }]])
  })

  it('toma el texto de los nodos anidados (por ejemplo, un enlace)', () => {
    const parrafos = parrafosDeTextoEnriquecido(
      raiz([
        {
          type: 'paragraph',
          version: 1,
          children: [{ type: 'link', version: 1, children: [texto('SIGE Mype')] }],
        },
      ]),
    )

    expect(parrafos).toEqual([[{ texto: 'SIGE Mype', resaltado: false }]])
  })

  it('omite los párrafos vacíos', () => {
    const parrafos = parrafosDeTextoEnriquecido(
      raiz([{ type: 'paragraph', version: 1, children: [] }]),
    )

    expect(parrafos).toEqual([])
  })
})
