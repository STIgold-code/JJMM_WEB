import { describe, expect, it } from 'vitest'

import { crearLimitadorEnMemoria } from './limitador-en-memoria'

const VENTANA = 60_000

describe('crearLimitadorEnMemoria', () => {
  it('permite hasta el máximo de envíos por clave dentro de la ventana', () => {
    const limitador = crearLimitadorEnMemoria({ maximo: 2, ventanaMs: VENTANA })

    expect(limitador.permitir('a', 0)).toBe(true)
    expect(limitador.permitir('a', 1_000)).toBe(true)
    expect(limitador.permitir('a', 2_000)).toBe(false)
  })

  it('cuenta cada clave por separado', () => {
    const limitador = crearLimitadorEnMemoria({ maximo: 1, ventanaMs: VENTANA })

    expect(limitador.permitir('a', 0)).toBe(true)
    expect(limitador.permitir('b', 0)).toBe(true)
    expect(limitador.permitir('a', 0)).toBe(false)
  })

  it('vuelve a permitir cuando los envíos anteriores salen de la ventana', () => {
    const limitador = crearLimitadorEnMemoria({ maximo: 1, ventanaMs: VENTANA })

    limitador.permitir('a', 0)

    expect(limitador.permitir('a', VENTANA - 1)).toBe(false)
    expect(limitador.permitir('a', VENTANA)).toBe(true)
  })

  it('olvida las claves vencidas para no crecer sin límite', () => {
    const limitador = crearLimitadorEnMemoria({ maximo: 1, ventanaMs: VENTANA, maximoDeClaves: 2 })

    limitador.permitir('a', 0)
    limitador.permitir('b', 0)
    limitador.permitir('c', VENTANA)

    expect(limitador.cantidadDeClaves()).toBeLessThanOrEqual(2)
    expect(limitador.permitir('a', VENTANA)).toBe(true)
  })
})
