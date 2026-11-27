import { obtenerPayload } from '@/compartido/infraestructura/instancia-payload'
import type { PaginaDeInicio } from '@/payload-types'

import type { RepositorioPaginaDeInicio } from '../aplicacion/repositorio-pagina-de-inicio'

export type SeccionDeInicio = NonNullable<PaginaDeInicio['secciones']>[number]

// Lee la global con los permisos del público. Profundidad 1 para poblar las imágenes de las
// portadas y de la rueda, y la sede del mapa. Una global que nunca se guardó no tiene secciones.
export const repositorioPaginaDeInicioPayload: RepositorioPaginaDeInicio<SeccionDeInicio> = {
  async obtenerSecciones() {
    const payload = await obtenerPayload()
    const pagina = await payload.findGlobal({
      slug: 'pagina-de-inicio',
      depth: 1,
      overrideAccess: false,
    })
    return pagina.secciones ?? []
  },
}
