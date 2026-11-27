import type { CollectionSlug, Payload, SanitizedPermissions, TypedUser, Where } from 'payload'

import type { ConteosDelInicio } from './cifras-del-panel'

// Conteos del inicio del panel con la Local API y los permisos de quien entra
// (`overrideAccess: false`): cada uno es un `count`, sin traer documentos. Si la cuenta no puede
// leer la colección, el conteo es `null` y no se consulta.
interface Contexto {
  payload: Payload
  permisos: SanitizedPermissions
  user: TypedUser | null | undefined
}

async function contar(
  { payload, permisos, user }: Contexto,
  collection: CollectionSlug,
  where?: Where,
): Promise<number | null> {
  if (permisos.collections?.[collection]?.read !== true) return null
  const { totalDocs } = await payload.count({
    collection,
    where,
    overrideAccess: false,
    user: user ?? undefined,
  })
  return totalDocs
}

export async function contarPendientes(contexto: Contexto): Promise<ConteosDelInicio> {
  const [mensajesNuevos, borradores] = await Promise.all([
    contar(contexto, 'mensajes-de-contacto', { estado: { equals: 'nuevo' } }),
    // La colección guarda la última versión publicada; `draft` son las que nunca se publicaron.
    contar(contexto, 'publicaciones', { _status: { equals: 'draft' } }),
  ])
  return { mensajesNuevos, borradores }
}

// Total de documentos de cada colección que se muestra en las secciones del inicio.
export async function contarColecciones(
  contexto: Contexto,
  slugs: readonly string[],
): Promise<Record<string, number>> {
  const esColeccion = (slug: string): slug is CollectionSlug => slug in contexto.payload.collections
  const pares = await Promise.all(
    slugs.filter(esColeccion).map(async (slug) => [slug, await contar(contexto, slug)] as const),
  )
  return Object.fromEntries(
    pares.filter((par): par is readonly [CollectionSlug, number] => par[1] !== null),
  )
}
