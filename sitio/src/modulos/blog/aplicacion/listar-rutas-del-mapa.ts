import {
  type PublicacionDelMapa,
  type RutaDelMapa,
  rutasDelMapaDelBlog,
} from '../dominio/mapa-del-blog'

// Todas las publicaciones publicadas (nunca borradores), solo con lo que pide el sitemap.
export interface RepositorioMapaDelBlog {
  listarParaElMapa(): Promise<readonly PublicacionDelMapa[]>
}

export function crearListarRutasDelMapa(repositorio: RepositorioMapaDelBlog) {
  return async (): Promise<RutaDelMapa[]> =>
    rutasDelMapaDelBlog(await repositorio.listarParaElMapa())
}
