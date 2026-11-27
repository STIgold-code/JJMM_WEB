import type { RepositorioConfiguracion } from '../aplicacion/repositorio-configuracion'
import { obtenerPayload } from './instancia-payload'
import { mapearConfiguracion } from './mapear-configuracion'

// Lee la global con los permisos del público (overrideAccess: false, sin usuario).
// Profundidad 1 para poblar el logo y el sello.
export const repositorioConfiguracionPayload: RepositorioConfiguracion = {
  async obtener() {
    const payload = await obtenerPayload()
    const guardada = await payload.findGlobal({
      slug: 'configuracion-del-sitio',
      depth: 1,
      overrideAccess: false,
    })
    return mapearConfiguracion(guardada)
  },
}
