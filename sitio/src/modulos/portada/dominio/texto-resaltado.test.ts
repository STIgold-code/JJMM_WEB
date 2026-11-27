import { describe, expect, it } from 'vitest'

import { segmentarTextoResaltado, validarTextoResaltado } from './texto-resaltado'

describe('segmentarTextoResaltado', () => {
  it('separa la parte entre corchetes como resaltada', () => {
    expect(segmentarTextoResaltado('Contamos con [Sistema de Calidad] Genuino')).toEqual([
      { texto: 'Contamos con ', resaltado: false },
      { texto: 'Sistema de Calidad', resaltado: true },
      { texto: ' Genuino', resaltado: false },
    ])
  })

  it('devuelve un solo segmento cuando no hay corchetes', () => {
    expect(segmentarTextoResaltado('Nuestro plan de trabajo')).toEqual([
      { texto: 'Nuestro plan de trabajo', resaltado: false },
    ])
  })

  it('omite los segmentos vacíos en los extremos', () => {
    expect(segmentarTextoResaltado('Somos más que un [estudio contable]')).toEqual([
      { texto: 'Somos más que un ', resaltado: false },
      { texto: 'estudio contable', resaltado: true },
    ])
  })
})

describe('validarTextoResaltado', () => {
  it('acepta texto sin corchetes o con pares cerrados', () => {
    expect(validarTextoResaltado('Nuestro [plan] de [trabajo]')).toBeNull()
    expect(validarTextoResaltado('Sin resaltado')).toBeNull()
  })

  it.each(['Nuestro [plan', 'Nuestro plan]', '[[plan]]', 'Nuestro [] plan'])(
    'rechaza «%s»',
    (texto) => {
      expect(validarTextoResaltado(texto)).toMatch(/corchetes/)
    },
  )
})
