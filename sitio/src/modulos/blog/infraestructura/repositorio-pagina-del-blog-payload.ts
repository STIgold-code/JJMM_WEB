import { obtenerPayload } from '@/compartido/infraestructura/instancia-payload'

import type { RepositorioPaginaDelBlog } from '../aplicacion/repositorio-pagina-del-blog'
import { mapearPaginaDelBlog } from './repositorio-blog-mapeadores'

// Lee la global con los permisos del público (overrideAccess: false, sin usuario).
export const repositorioPaginaDelBlogPayload: RepositorioPaginaDelBlog = {
  async obtener() {
    const payload = await obtenerPayload()
    const guardada = await payload.findGlobal({
      slug: 'pagina-del-blog',
      depth: 0,
      overrideAccess: false,
    })
    return mapearPaginaDelBlog(guardada)
  },
}
