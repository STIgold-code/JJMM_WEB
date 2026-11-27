import { describe, expect, it } from 'vitest'

import { detalle, repositorioEnMemoria, resumen } from './dobles-de-prueba'
import { crearObtenerPublicacion } from './obtener-publicacion'

describe('crearObtenerPublicacion', () => {
  it('devuelve la publicación y hasta tres similares de su categoría, sin ella misma', async () => {
    const candidatas = ['a', 'actual', 'b', 'c'].map((slug) => resumen(slug))
    const repositorio = repositorioEnMemoria(candidatas, [detalle('actual')])

    const resultado = await crearObtenerPublicacion(repositorio)('actual')

    expect(resultado?.publicacion.slug).toBe('actual')
    expect(resultado?.similares.map(({ slug }) => slug)).toEqual(['a', 'b', 'c'])
    expect(repositorio.pedidos).toEqual([
      {
        filtro: { tipo: 'categoria', slug: 'tributacion' },
        pedido: { pagina: 1, porPagina: 4 },
      },
    ])
  })

  it('devuelve null si la publicación no existe o no está publicada', async () => {
    const repositorio = repositorioEnMemoria([], [detalle('otra')])

    expect(await crearObtenerPublicacion(repositorio)('borrador')).toBeNull()
    expect(repositorio.pedidos).toEqual([])
  })

  it('no consulta la base si el segmento no puede ser un slug', async () => {
    const repositorio = repositorioEnMemoria([], [detalle('actual')])

    expect(await crearObtenerPublicacion(repositorio)('Actual')).toBeNull()
  })

  it('sin categoría no hay similares', async () => {
    const sinCategoria = { ...detalle('actual'), categoria: null }
    const repositorio = repositorioEnMemoria([resumen('a')], [sinCategoria])

    const resultado = await crearObtenerPublicacion(repositorio)('actual')

    expect(resultado?.similares).toEqual([])
    expect(repositorio.pedidos).toEqual([])
  })
})
