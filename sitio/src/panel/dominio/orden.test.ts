import { describe, expect, it } from 'vitest'

import { avisoDeOrden, moverEnLista, ordenAlFinal, ordenesAActualizar } from './orden'

describe('moverEnLista', () => {
  it('sube y baja un elemento sin tocar la lista original', () => {
    const lista = ['a', 'b', 'c', 'd']
    expect(moverEnLista(lista, 2, 1)).toEqual(['a', 'c', 'b', 'd'])
    expect(moverEnLista(lista, 0, 3)).toEqual(['b', 'c', 'd', 'a'])
    expect(lista).toEqual(['a', 'b', 'c', 'd'])
  })

  it('fuera de los bordes no cambia nada', () => {
    expect(moverEnLista(['a', 'b'], 0, -1)).toEqual(['a', 'b'])
    expect(moverEnLista(['a', 'b'], 1, 2)).toEqual(['a', 'b'])
    expect(moverEnLista(['a', 'b'], 5, 0)).toEqual(['a', 'b'])
  })
})

describe('ordenesAActualizar', () => {
  const GUARDADOS = [
    { id: 1, orden: 0 },
    { id: 2, orden: 1 },
    { id: 3, orden: 2 },
  ]

  it('devuelve solo los documentos cuyo orden cambia, numerados desde cero', () => {
    expect(ordenesAActualizar(GUARDADOS, [2, 1, 3])).toEqual([
      { id: 2, orden: 0 },
      { id: 1, orden: 1 },
    ])
  })

  it('acepta los ids como texto y no cambia nada si el orden es el mismo', () => {
    expect(ordenesAActualizar(GUARDADOS, ['1', '2', '3'])).toEqual([])
  })

  it('corrige órdenes repetidos aunque la posición no cambie', () => {
    const repetidos = [
      { id: 1, orden: 0 },
      { id: 2, orden: 0 },
    ]
    expect(ordenesAActualizar(repetidos, [1, 2])).toEqual([{ id: 2, orden: 1 }])
  })

  it.each([
    ['no es una lista', 'uno,dos'],
    ['falta un documento', [1, 2]],
    ['sobra un documento', [1, 2, 3, 4]],
    ['un documento repetido', [1, 1, 3]],
    ['un id inválido', [1, 2, 'x']],
    ['un documento que no existe', [1, 2, 9]],
  ])('rechaza la lista si %s', (_, ids) => {
    expect(ordenesAActualizar(GUARDADOS, ids)).toBeNull()
  })
})

describe('ordenAlFinal', () => {
  it('es uno más que el mayor orden guardado, o cero en una lista vacía', () => {
    expect(
      ordenAlFinal([
        { id: 1, orden: 0 },
        { id: 2, orden: 4 },
      ]),
    ).toBe(5)
    expect(ordenAlFinal([])).toBe(0)
  })
})

describe('avisoDeOrden', () => {
  it('dice en qué posición quedó, contando desde uno', () => {
    expect(avisoDeOrden('Emprende', 2)).toEqual({
      titulo: 'Orden actualizado',
      detalle: 'Emprende quedó en la posición 2.',
    })
  })
})
