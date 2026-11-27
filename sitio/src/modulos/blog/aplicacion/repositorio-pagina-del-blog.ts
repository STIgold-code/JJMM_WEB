import type { PaginaDelBlog } from '../dominio/publicacion'

// Textos del listado /blog. Null si la global nunca se guardó.
export interface RepositorioPaginaDelBlog {
  obtener(): Promise<PaginaDelBlog | null>
}
