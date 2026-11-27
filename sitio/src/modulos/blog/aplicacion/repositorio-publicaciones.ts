import type { DetalleDePublicacion, ResumenDePublicacion } from '../dominio/publicacion'

// Qué publicaciones lista un listado: todas, las de una categoría o las de una etiqueta.
export type FiltroDePublicaciones =
  { tipo: 'todas' } | { tipo: 'categoria'; slug: string } | { tipo: 'etiqueta'; slug: string }

export interface PedidoDePagina {
  pagina: number
  porPagina: number
}

export interface ResultadosDePublicaciones {
  publicaciones: readonly ResumenDePublicacion[]
  // Total de publicaciones que cumplen el filtro, en todas las páginas.
  total: number
}

// Solo publicaciones publicadas (nunca borradores), las más recientes primero.
export interface RepositorioListadoDePublicaciones {
  listar(filtro: FiltroDePublicaciones, pedido: PedidoDePagina): Promise<ResultadosDePublicaciones>
}

export interface RepositorioPublicaciones<Contenido> extends RepositorioListadoDePublicaciones {
  // Null si no existe o no está publicada.
  buscarPorSlug(slug: string): Promise<DetalleDePublicacion<Contenido> | null>
}
