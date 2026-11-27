import { etiquetaDeColeccion, etiquetaDeGlobal } from '@/compartido/dominio/etiquetas-de-cache'
import { obtenerPayload } from '@/compartido/infraestructura/instancia-payload'
import { leerEnCache } from '@/compartido/infraestructura/lectura-en-cache'
import type { PaginaDeInicio } from '@/payload-types'

import type { RepositorioPaginaDeInicio } from '../aplicacion/repositorio-pagina-de-inicio'

export type SeccionDeInicio = NonNullable<PaginaDeInicio['secciones']>[number]

// Lee la global con los permisos del público. Profundidad 1 para poblar las imágenes de las
// portadas y de la rueda, y la sede del mapa: por eso depende también de `medios` y `sedes`.
// Una global que nunca se guardó no tiene secciones.
export const repositorioPaginaDeInicioPayload: RepositorioPaginaDeInicio<SeccionDeInicio> = {
  obtenerSecciones: leerEnCache(
    'pagina-de-inicio.obtenerSecciones',
    [
      etiquetaDeGlobal('pagina-de-inicio'),
      etiquetaDeColeccion('medios'),
      etiquetaDeColeccion('sedes'),
    ],
    async () => {
      const payload = await obtenerPayload()
      const pagina = await payload.findGlobal({
        slug: 'pagina-de-inicio',
        depth: 1,
        overrideAccess: false,
      })
      return pagina.secciones ?? []
    },
  ),
}
