import { etiquetaDeGlobal } from '@/compartido/dominio/etiquetas-de-cache'
import { obtenerPayload } from '@/compartido/infraestructura/instancia-payload'
import { leerEnCache } from '@/compartido/infraestructura/lectura-en-cache'

import type { RepositorioPaginaDelBlog } from '../aplicacion/repositorio-pagina-del-blog'
import { mapearPaginaDelBlog } from './repositorio-blog-mapeadores'

// Lee la global con los permisos del público (overrideAccess: false, sin usuario).
export const repositorioPaginaDelBlogPayload: RepositorioPaginaDelBlog = {
  obtener: leerEnCache(
    'pagina-del-blog.obtener',
    [etiquetaDeGlobal('pagina-del-blog')],
    async () => {
      const payload = await obtenerPayload()
      const guardada = await payload.findGlobal({
        slug: 'pagina-del-blog',
        depth: 0,
        overrideAccess: false,
      })
      return mapearPaginaDelBlog(guardada)
    },
  ),
}
