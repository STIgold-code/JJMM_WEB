import { obtenerPayload } from '@/compartido/infraestructura/instancia-payload'

import type { RepositorioGuiaDeClientes } from '../aplicacion/repositorio-guia-de-clientes'

// Lee la global con los permisos del público (overrideAccess: false, sin usuario).
export const repositorioGuiaDeClientesPayload: RepositorioGuiaDeClientes = {
  async obtener() {
    const payload = await obtenerPayload()
    const guia = await payload.findGlobal({
      slug: 'guia-de-clientes',
      depth: 0,
      overrideAccess: false,
    })
    return {
      titulo: guia.titulo,
      introduccion: guia.introduccion,
      tituloDeAvisos: guia.tituloDeAvisos,
      tituloDeVencimientos: guia.tituloDeVencimientos,
      tituloDelCronograma: guia.tituloDelCronograma,
      // Una global que nunca se guardó puede llegar sin el grupo `seo`.
      seoTitulo: guia.seo?.titulo,
      seoDescripcion: guia.seo?.descripcion,
    }
  },
}
