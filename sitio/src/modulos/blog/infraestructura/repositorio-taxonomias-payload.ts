import { etiquetaDeColeccion } from '@/compartido/dominio/etiquetas-de-cache'
import { obtenerPayload } from '@/compartido/infraestructura/instancia-payload'
import { leerEnCache } from '@/compartido/infraestructura/lectura-en-cache'

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
  buscarCategoria: leerEnCache(
    'categorias.buscarPorSlug',
    [etiquetaDeColeccion('categorias')],
    async (slug: string) => {
      const payload = await obtenerPayload()
      const { docs } = await payload.find({ collection: 'categorias', ...CONSULTA_POR_SLUG(slug) })
      const [categoria] = docs
      return categoria ? mapearCategoria(categoria) : null
    },
  ),

  buscarEtiqueta: leerEnCache(
    'etiquetas.buscarPorSlug',
    [etiquetaDeColeccion('etiquetas')],
    async (slug: string) => {
      const payload = await obtenerPayload()
      const { docs } = await payload.find({ collection: 'etiquetas', ...CONSULTA_POR_SLUG(slug) })
      const [etiqueta] = docs
      return etiqueta ? mapearEtiqueta(etiqueta) : null
    },
  ),
}
