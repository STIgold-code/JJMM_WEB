import { describe, expect, it } from 'vitest'

import type { Categoria, Etiqueta } from '../dominio/publicacion'
import { repositorioEnMemoria, resumen } from './dobles-de-prueba'
import { crearListarPorCategoria, crearListarPorEtiqueta } from './listar-por-taxonomia'
import type { RepositorioTaxonomias } from './repositorio-taxonomias'

const LABORAL: Categoria = { nombre: 'Laboral', slug: 'laboral' }
const PLAME: Etiqueta = { nombre: 'PLAME', slug: 'plame', color: 'verde' }

const taxonomias: RepositorioTaxonomias = {
  buscarCategoria: async (slug) => (slug === LABORAL.slug ? LABORAL : null),
  buscarEtiqueta: async (slug) => (slug === PLAME.slug ? PLAME : null),
}

describe('crearListarPorCategoria', () => {
  it('filtra por el slug de la categoría y la devuelve con el listado', async () => {
    const publicaciones = repositorioEnMemoria([resumen('a', 'laboral')])

    const resultado = await crearListarPorCategoria(publicaciones, taxonomias)('laboral', 1)

    expect(resultado?.categoria).toEqual(LABORAL)
    expect(resultado?.listado.publicaciones).toHaveLength(1)
    expect(publicaciones.pedidos[0]?.filtro).toEqual({ tipo: 'categoria', slug: 'laboral' })
  })

  it('devuelve null si la categoría no existe, sin listar publicaciones', async () => {
    const publicaciones = repositorioEnMemoria([])

    expect(await crearListarPorCategoria(publicaciones, taxonomias)('otra', 1)).toBeNull()
    expect(publicaciones.pedidos).toEqual([])
  })

  it('devuelve null si el segmento no puede ser un slug', async () => {
    const listar = crearListarPorCategoria(repositorioEnMemoria([]), taxonomias)

    expect(await listar('Laboral', 1)).toBeNull()
  })

  it('devuelve null si la página no existe', async () => {
    const listar = crearListarPorCategoria(repositorioEnMemoria([]), taxonomias)

    expect(await listar('laboral', 2)).toBeNull()
  })
})

describe('crearListarPorEtiqueta', () => {
  it('filtra por el slug de la etiqueta y la devuelve con el listado', async () => {
    const publicaciones = repositorioEnMemoria([])

    const resultado = await crearListarPorEtiqueta(publicaciones, taxonomias)('plame', 1)

    expect(resultado?.etiqueta).toEqual(PLAME)
    expect(resultado?.listado.publicaciones).toEqual([])
    expect(publicaciones.pedidos[0]?.filtro).toEqual({ tipo: 'etiqueta', slug: 'plame' })
  })

  it('devuelve null si la etiqueta no existe', async () => {
    const listar = crearListarPorEtiqueta(repositorioEnMemoria([]), taxonomias)

    expect(await listar('sunat', 1)).toBeNull()
  })
})
