import { obtenerPayload } from '@/compartido/infraestructura/instancia-payload'

import type { RepositorioTaxonomias } from '../aplicacion/repositorio-taxonomias'
import { mapearCategoria, mapearEtiqueta } from './repositorio-blog-mapeadores'

// Categorías y etiquetas por slug (único), con los permisos del público.
const CONSULTA_POR_SLUG = (slug: string) =>
  ({
    where: { slug: { equals: slug } },
    limit: 1,
    pagination: false,
    depth: 0,
    overrideAccess: false,
  }) as const

export const repositorioTaxonomiasPayload: RepositorioTaxonomias = {
  async buscarCategoria(slug) {
    const payload = await obtenerPayload()
    const { docs } = await payload.find({ collection: 'categorias', ...CONSULTA_POR_SLUG(slug) })
    const [categoria] = docs
    return categoria ? mapearCategoria(categoria) : null
  },

  async buscarEtiqueta(slug) {
    const payload = await obtenerPayload()
    const { docs } = await payload.find({ collection: 'etiquetas', ...CONSULTA_POR_SLUG(slug) })
    const [etiqueta] = docs
    return etiqueta ? mapearEtiqueta(etiqueta) : null
  },
}
