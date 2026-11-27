import type { Where } from 'payload'

import type { FiltroDePublicaciones } from '../aplicacion/repositorio-publicaciones'

// Condiciones de consulta de `publicaciones`. Todas exigen `_status: published`, además del
// acceso de la colección: así un cambio de permisos nunca deja ver un borrador.
export const SOLO_PUBLICADAS: Where = { _status: { equals: 'published' } }

const publicadasY = (condicion: Where): Where => ({ and: [SOLO_PUBLICADAS, condicion] })

export function condicionDelFiltro(filtro: FiltroDePublicaciones): Where {
  if (filtro.tipo === 'categoria') return publicadasY({ 'categoria.slug': { equals: filtro.slug } })
  if (filtro.tipo === 'etiqueta') return publicadasY({ 'etiquetas.slug': { equals: filtro.slug } })
  return SOLO_PUBLICADAS
}

export const condicionPorSlug = (slug: string): Where => publicadasY({ slug: { equals: slug } })
