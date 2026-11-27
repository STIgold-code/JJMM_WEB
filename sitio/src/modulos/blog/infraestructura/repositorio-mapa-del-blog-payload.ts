import { obtenerPayload } from '@/compartido/infraestructura/instancia-payload'

import type { RepositorioMapaDelBlog } from '../aplicacion/listar-rutas-del-mapa'
import { SOLO_PUBLICADAS } from './repositorio-blog-condiciones'
import {
  CAMPOS_DEL_MAPA,
  mapearPublicacionDelMapa,
  RELACIONES_DEL_MAPA,
} from './repositorio-mapa-del-blog-mapeador'

// Mismas garantías que el listado público: acceso del público (overrideAccess: false, sin
// usuario), `_status: published` explícito y la versión publicada, nunca un borrador.
export const repositorioMapaDelBlogPayload: RepositorioMapaDelBlog = {
  async listarParaElMapa() {
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
}
