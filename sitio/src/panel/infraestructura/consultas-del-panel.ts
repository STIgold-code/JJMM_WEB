import type { CollectionSlug, Where } from 'payload'

import type { SesionDelPanel } from './sesion-del-panel'

// Lecturas del panel con la Local API y los permisos de quien entra: `overrideAccess: false`
// y el `user` de la sesión, así rigen las reglas de acceso de cada colección. Si la cuenta no
// puede leer una colección, no se consulta y el resultado es `null` (nunca un cero inventado).
export function crearConsultas({ payload, usuario, permisos }: SesionDelPanel) {
  const puedeLeer = (slug: CollectionSlug): boolean => permisos.collections?.[slug]?.read === true

  async function contar(slug: CollectionSlug, where?: Where): Promise<number | null> {
    if (!puedeLeer(slug)) return null
    const { totalDocs } = await payload.count({
      collection: slug,
      where,
      overrideAccess: false,
      user: usuario,
    })
    return totalDocs
  }

  // Opciones comunes de `find`: permisos de la cuenta y sin poblar relaciones.
  const lectura = { overrideAccess: false, user: usuario, depth: 0 } as const

  return { puedeLeer, contar, lectura }
}
