import type { Categoria, Etiqueta } from '../dominio/publicacion'
import { leerSlug } from '../dominio/rutas-del-blog'
import { crearListarPublicaciones, type ListadoDePublicaciones } from './listar-publicaciones'
import type { RepositorioListadoDePublicaciones } from './repositorio-publicaciones'
import type { RepositorioTaxonomias } from './repositorio-taxonomias'

export interface ListadoDeCategoria {
  categoria: Categoria
  listado: ListadoDePublicaciones
}

export interface ListadoDeEtiqueta {
  etiqueta: Etiqueta
  listado: ListadoDePublicaciones
}

// Listados filtrados de /blog/categoria/<slug> y /blog/etiqueta/<slug>. Null (404) si el
// segmento no es un slug, si la categoría o etiqueta no existe o si la página no existe.
export function crearListarPorCategoria(
  publicaciones: RepositorioListadoDePublicaciones,
  taxonomias: RepositorioTaxonomias,
) {
  const listar = crearListarPublicaciones(publicaciones)
  return async (segmento: string, pagina: number): Promise<ListadoDeCategoria | null> => {
    const slug = leerSlug(segmento)
    const categoria = slug ? await taxonomias.buscarCategoria(slug) : null
    if (!categoria) return null
    const listado = await listar({ tipo: 'categoria', slug: categoria.slug }, pagina)
    return listado ? { categoria, listado } : null
  }
}

export function crearListarPorEtiqueta(
  publicaciones: RepositorioListadoDePublicaciones,
  taxonomias: RepositorioTaxonomias,
) {
  const listar = crearListarPublicaciones(publicaciones)
  return async (segmento: string, pagina: number): Promise<ListadoDeEtiqueta | null> => {
    const slug = leerSlug(segmento)
    const etiqueta = slug ? await taxonomias.buscarEtiqueta(slug) : null
    if (!etiqueta) return null
    const listado = await listar({ tipo: 'etiqueta', slug: etiqueta.slug }, pagina)
    return listado ? { etiqueta, listado } : null
  }
}
