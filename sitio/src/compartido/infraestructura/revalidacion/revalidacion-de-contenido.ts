import { revalidateTag } from 'next/cache'
import type {
  CollectionConfig,
  CollectionSlug,
  GlobalConfig,
  PayloadRequest,
  TypeWithID,
} from 'payload'

import { crearHooksDeRevalidacion, type EstadoPublico } from './hooks-de-revalidacion'

// `{ expire: 0 }`: la siguiente visita lee de nuevo de la base en lugar de recibir la versión
// vieja mientras se renueva. Es lo que la documentación de Next 16 indica para invalidar desde
// un Route Handler (las peticiones REST del panel), donde `updateTag` no está disponible.
const revalidarConNext = (etiqueta: string) => revalidateTag(etiqueta, { expire: 0 })

type FilaPrincipal = TypeWithID & { _status?: unknown; slug?: unknown }

const esSlugDeColeccion = (req: PayloadRequest, slug: string): slug is CollectionSlug =>
  slug in req.payload.collections

// Lee la fila principal (la versión pública), no la última versión, dentro de la misma
// transacción del cambio.
async function leerEstadoPublicoPayload(
  req: PayloadRequest,
  coleccion: string,
  id: number | string,
): Promise<EstadoPublico | null> {
  if (!esSlugDeColeccion(req, coleccion)) return null
  const fila = await req.payload.db.findOne<FilaPrincipal>({
    collection: coleccion,
    where: { id: { equals: id } },
    req,
  })
  if (!fila) return null
  return {
    publicada: fila._status === 'published',
    slug: typeof fila.slug === 'string' ? fila.slug : null,
  }
}

const hooks = crearHooksDeRevalidacion<PayloadRequest>({
  revalidar: revalidarConNext,
  leerEstadoPublico: leerEstadoPublicoPayload,
})

const tieneBorradores = ({ versions }: CollectionConfig): boolean =>
  typeof versions === 'object' && Boolean(versions.drafts)

// Agrega a una colección los hooks que invalidan la caché pública, sin tocar los suyos.
export function conRevalidacion(coleccion: CollectionConfig): CollectionConfig {
  const { antesDeCambiar, despuesDeCambiar, despuesDeBorrar } = hooks.paraColeccion({
    slug: coleccion.slug,
    conBorradores: tieneBorradores(coleccion),
  })
  const actuales = coleccion.hooks ?? {}
  return {
    ...coleccion,
    hooks: {
      ...actuales,
      beforeChange: [...(actuales.beforeChange ?? []), ...(antesDeCambiar ? [antesDeCambiar] : [])],
      afterChange: [...(actuales.afterChange ?? []), despuesDeCambiar],
      afterDelete: [...(actuales.afterDelete ?? []), despuesDeBorrar],
    },
  }
}

export function globalConRevalidacion(global: GlobalConfig): GlobalConfig {
  const actuales = global.hooks ?? {}
  return {
    ...global,
    hooks: {
      ...actuales,
      afterChange: [...(actuales.afterChange ?? []), hooks.paraGlobal(global.slug)],
    },
  }
}
