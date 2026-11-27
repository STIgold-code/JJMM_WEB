import { cache } from 'react'

import { crearListarPorCategoria, crearListarPorEtiqueta } from '../aplicacion/listar-por-taxonomia'
import { crearListarPublicaciones } from '../aplicacion/listar-publicaciones'
import { crearObtenerPaginaDelBlog } from '../aplicacion/obtener-pagina-del-blog'
import { crearObtenerPublicacion } from '../aplicacion/obtener-publicacion'
import { repositorioPaginaDelBlogPayload } from '../infraestructura/repositorio-pagina-del-blog-payload'
import { repositorioPublicacionesPayload } from '../infraestructura/repositorio-publicaciones-payload'
import { repositorioTaxonomiasPayload } from '../infraestructura/repositorio-taxonomias-payload'

// Raíz de composición del blog: cada caso de uso con su adaptador de Payload. `cache` hace
// una sola lectura por petición aunque la página y sus metadatos pidan lo mismo.
export const obtenerPaginaDelBlog = cache(
  crearObtenerPaginaDelBlog(repositorioPaginaDelBlogPayload),
)

export const listarPublicaciones = cache(crearListarPublicaciones(repositorioPublicacionesPayload))

export const obtenerPublicacion = cache(crearObtenerPublicacion(repositorioPublicacionesPayload))

export const listarPorCategoria = cache(
  crearListarPorCategoria(repositorioPublicacionesPayload, repositorioTaxonomiasPayload),
)

export const listarPorEtiqueta = cache(
  crearListarPorEtiqueta(repositorioPublicacionesPayload, repositorioTaxonomiasPayload),
)
