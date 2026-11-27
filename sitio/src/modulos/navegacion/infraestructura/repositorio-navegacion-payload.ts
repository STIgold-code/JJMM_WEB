import { etiquetaDeColeccion, etiquetaDeGlobal } from '@/compartido/dominio/etiquetas-de-cache'
import { aImagen } from '@/compartido/infraestructura/imagen-de-medio'
import { obtenerPayload } from '@/compartido/infraestructura/instancia-payload'
import { leerEnCache } from '@/compartido/infraestructura/lectura-en-cache'
import type { Navegacion } from '@/payload-types'

import type { RepositorioNavegacion } from '../aplicacion/repositorio-navegacion'
import type { ItemDeMenuGuardado } from '../dominio/item-de-menu'

type ItemPayload = NonNullable<Navegacion['items']>[number]

export function mapearItemDeMenu(item: ItemPayload): ItemDeMenuGuardado {
  return {
    etiqueta: item.etiqueta,
    tipo: item.tipo,
    destino: item.destino ?? null,
    abrirEnNuevaPestana: item.abrirEnNuevaPestana === true,
    imagen: aImagen(item.imagen),
  }
}

// Lee el menú con los permisos del público; profundidad 1 para poblar los logos.
export const repositorioNavegacionPayload: RepositorioNavegacion = {
  obtenerItems: leerEnCache(
    'navegacion.obtenerItems',
    [etiquetaDeGlobal('navegacion'), etiquetaDeColeccion('medios')],
    async () => {
      const payload = await obtenerPayload()
      const navegacion = await payload.findGlobal({
        slug: 'navegacion',
        depth: 1,
        overrideAccess: false,
      })
      return (navegacion.items ?? []).map(mapearItemDeMenu)
    },
  ),
}
