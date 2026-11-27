import type { PaginaDelBlog } from '../dominio/publicacion'
import type { RepositorioPaginaDelBlog } from './repositorio-pagina-del-blog'

// Textos del listado /blog. Null si la global nunca se guardó: el blog responde 404.
export function crearObtenerPaginaDelBlog(repositorio: RepositorioPaginaDelBlog) {
  return (): Promise<PaginaDelBlog | null> => repositorio.obtener()
}
