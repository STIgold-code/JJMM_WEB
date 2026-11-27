import { etiquetaDeColeccion, etiquetaDeGlobal } from '../dominio/etiquetas-de-cache'
import type { RepositorioConfiguracion } from '../aplicacion/repositorio-configuracion'
import { obtenerPayload } from './instancia-payload'
import { leerEnCache } from './lectura-en-cache'
import { mapearConfiguracion } from './mapear-configuracion'

// Lee la global con los permisos del público (overrideAccess: false, sin usuario).
// Profundidad 1 para poblar el logo y el sello, por eso también depende de `medios`.
export const repositorioConfiguracionPayload: RepositorioConfiguracion = {
  obtener: leerEnCache(
    'configuracion-del-sitio.obtener',
    [etiquetaDeGlobal('configuracion-del-sitio'), etiquetaDeColeccion('medios')],
    async () => {
      const payload = await obtenerPayload()
      const guardada = await payload.findGlobal({
        slug: 'configuracion-del-sitio',
        depth: 1,
        overrideAccess: false,
      })
      return mapearConfiguracion(guardada)
    },
  ),
}
