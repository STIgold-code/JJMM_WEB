import { describe, expect, it } from 'vitest'

import { repositorioEnMemoria, resumen } from './dobles-de-prueba'
import { crearListarPublicaciones } from './listar-publicaciones'

const varias = (cantidad: number) =>
  Array.from({ length: cantidad }, (_, indice) => resumen(`publicacion-${indice + 1}`))

describe('crearListarPublicaciones', () => {
  it('pide al repositorio la página con nueve por página y el filtro recibido', async () => {
    const repositorio = repositorioEnMemoria(varias(20))

    const listado = await crearListarPublicaciones(repositorio)({ tipo: 'todas' }, 3)

    expect(repositorio.pedidos).toEqual([
      { filtro: { tipo: 'todas' }, pedido: { pagina: 3, porPagina: 9 } },
    ])
    expect(listado?.publicaciones.map(({ slug }) => slug)).toEqual([
      'publicacion-19',
      'publicacion-20',
    ])
    expect(listado?.paginacion).toEqual({
      pagina: 3,
      totalDePaginas: 3,
      anterior: 2,
      siguiente: null,
    })
  })

  it('sin publicaciones devuelve la primera página vacía', async () => {
    const listado = await crearListarPublicaciones(repositorioEnMemoria([]))({ tipo: 'todas' }, 1)

    expect(listado).toEqual({
      publicaciones: [],
      paginacion: { pagina: 1, totalDePaginas: 1, anterior: null, siguiente: null },
    })
  })

  it('devuelve null si la página pedida no existe', async () => {
    const listar = crearListarPublicaciones(repositorioEnMemoria(varias(9)))

    expect(await listar({ tipo: 'categoria', slug: 'laboral' }, 2)).toBeNull()
  })
})
