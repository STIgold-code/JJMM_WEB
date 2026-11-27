import { etiquetaDeColeccion } from '@/compartido/dominio/etiquetas-de-cache'
import { obtenerPayload } from '@/compartido/infraestructura/instancia-payload'
import { leerEnCache } from '@/compartido/infraestructura/lectura-en-cache'

import type { RepositorioMapaDelBlog } from '../aplicacion/listar-rutas-del-mapa'
import { SOLO_PUBLICADAS } from './repositorio-blog-condiciones'
import {
  CAMPOS_DEL_MAPA,
  mapearPublicacionDelMapa,
  RELACIONES_DEL_MAPA,
} from './repositorio-mapa-del-blog-mapeador'

// Mismas garantías que el listado público: acceso del público (overrideAccess: false, sin
// usuario), `_status: published` explícito y la versión publicada, nunca un borrador.
// Se invalida con las mismas etiquetas que el listado del blog.
export const repositorioMapaDelBlogPayload: RepositorioMapaDelBlog = {
  listarParaElMapa: leerEnCache(
    'publicaciones.listarParaElMapa',
    ['publicaciones', 'categorias', 'etiquetas'].map(etiquetaDeColeccion),
    async () => {
      const payload = await obtenerPayload()
      const { docs } = await payload.find({
        collection: 'publicaciones',
        where: SOLO_PUBLICADAS,
        select: CAMPOS_DEL_MAPA,
        populate: RELACIONES_DEL_MAPA,
        sort: ['-fechaDePublicacion', '-id'],
        pagination: false,
        depth: 1,
        overrideAccess: false,
        draft: false,
      })
      return docs.map(mapearPublicacionDelMapa)
    },
  ),
}
