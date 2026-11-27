import type { Categoria, Etiqueta } from '../dominio/publicacion'

// Categorías y etiquetas por su slug. Null si no existen.
export interface RepositorioTaxonomias {
  buscarCategoria(slug: string): Promise<Categoria | null>
  buscarEtiqueta(slug: string): Promise<Etiqueta | null>
}
