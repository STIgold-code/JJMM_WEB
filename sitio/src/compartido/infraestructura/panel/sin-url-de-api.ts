import type { CollectionConfig, GlobalConfig } from 'payload'

// El equipo del estudio no usa la API: se oculta la pestaña «API» y la URL de cada documento.
export function sinUrlDeApi<T extends CollectionConfig | GlobalConfig>(entidad: T): T {
  return { ...entidad, admin: { ...entidad.admin, hideAPIURL: true } }
}
