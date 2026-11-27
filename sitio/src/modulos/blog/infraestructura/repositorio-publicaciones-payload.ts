import { obtenerPayload } from '@/compartido/infraestructura/instancia-payload'

import type { RepositorioPublicaciones } from '../aplicacion/repositorio-publicaciones'
import { condicionDelFiltro, condicionPorSlug } from './repositorio-blog-condiciones'
import {
  CAMPOS_DEL_RESUMEN,
  type ContenidoDePublicacion,
  mapearDetalle,
  mapearResumen,
} from './repositorio-blog-mapeadores'

// Más recientes primero; el id desempata para que la paginación sea estable.
const ORDEN = ['-fechaDePublicacion', '-id']

// Borradores: el acceso de la colección ya oculta lo no publicado al público
// (overrideAccess: false, sin usuario) y las condiciones filtran `_status` de forma
// explícita. `draft: false` lee la versión publicada, no el último borrador.
const LECTURA_PUBLICA = { overrideAccess: false, draft: false } as const

export const repositorioPublicacionesPayload: RepositorioPublicaciones<ContenidoDePublicacion> = {
  async listar(filtro, { pagina, porPagina }) {
    const payload = await obtenerPayload()
    const { docs, totalDocs } = await payload.find({
      collection: 'publicaciones',
      where: condicionDelFiltro(filtro),
      select: CAMPOS_DEL_RESUMEN,
      sort: ORDEN,
      page: pagina,
      limit: porPagina,
      depth: 1,
      ...LECTURA_PUBLICA,
    })
    return { publicaciones: docs.map(mapearResumen), total: totalDocs }
  },

  async buscarPorSlug(slug) {
    const payload = await obtenerPayload()
    const { docs } = await payload.find({
      collection: 'publicaciones',
      where: condicionPorSlug(slug),
      limit: 1,
      pagination: false,
      depth: 1,
      ...LECTURA_PUBLICA,
    })
    const [publicacion] = docs
    return publicacion ? mapearDetalle(publicacion) : null
  },
}
