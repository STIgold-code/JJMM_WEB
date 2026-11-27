import { beforeEach, describe, expect, it, vi } from 'vitest'

const { unstableCache } = vi.hoisted(() => ({
  // Doble de `unstable_cache`: registra la clave y las opciones y ejecuta la lectura.
  unstableCache: vi.fn(
    (leer: () => Promise<unknown>, _claves: string[], _opciones: object) => leer,
  ),
}))

vi.mock('next/cache', () => ({ unstable_cache: unstableCache }))

import { leerEnCache, REVALIDACION_DE_RESPALDO_EN_SEGUNDOS } from './lectura-en-cache'

beforeEach(() => {
  unstableCache.mockClear()
})

describe('leerEnCache', () => {
  it('devuelve lo que lee y lo guarda con su clave, sus argumentos y sus etiquetas', async () => {
    const leer = vi.fn(async (anio: number) => [anio])
    const leerCacheado = leerEnCache('cronogramas.listarDesde', ['coleccion:cronogramas'], leer)

    await expect(leerCacheado(2026)).resolves.toEqual([2026])
    expect(leer).toHaveBeenCalledWith(2026)
    expect(unstableCache).toHaveBeenCalledWith(
      expect.any(Function),
      ['cronogramas.listarDesde', '[2026]'],
      { tags: ['coleccion:cronogramas'], revalidate: REVALIDACION_DE_RESPALDO_EN_SEGUNDOS },
    )
  })

  it('calcula las etiquetas a partir de los argumentos cuando se pasa una función', async () => {
    const leerCacheado = leerEnCache(
      'publicaciones.buscarPorSlug',
      (slug: string) => [`documento:publicaciones:${slug}`],
      async (slug: string) => slug,
    )

    await leerCacheado('cierre')
    expect(unstableCache).toHaveBeenCalledWith(
      expect.any(Function),
      ['publicaciones.buscarPorSlug', '["cierre"]'],
      {
        tags: ['documento:publicaciones:cierre'],
        revalidate: REVALIDACION_DE_RESPALDO_EN_SEGUNDOS,
      },
    )
  })

  it('usa una revalidación de respaldo finita, no infinita', () => {
    expect(REVALIDACION_DE_RESPALDO_EN_SEGUNDOS).toBeGreaterThan(0)
    expect(Number.isFinite(REVALIDACION_DE_RESPALDO_EN_SEGUNDOS)).toBe(true)
  })
})
