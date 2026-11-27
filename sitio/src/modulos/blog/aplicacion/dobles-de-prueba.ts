import type { DetalleDePublicacion, ResumenDePublicacion } from '../dominio/publicacion'
import type {
  FiltroDePublicaciones,
  PedidoDePagina,
  RepositorioPublicaciones,
} from './repositorio-publicaciones'

// Dobles en memoria para probar los casos de uso sin base de datos.
export const resumen = (slug: string, categoria = 'tributacion'): ResumenDePublicacion => ({
  titulo: `Título ${slug}`,
  slug,
  extracto: 'Extracto',
  imagen: null,
  categoria: { nombre: 'Tributación', slug: categoria },
  etiquetas: [],
  fechaDePublicacion: '2026-11-27T15:00:00.000Z',
})

export const detalle = (slug: string): DetalleDePublicacion<string> => ({
  ...resumen(slug),
  contenido: 'contenido',
  seo: { titulo: null, descripcion: null },
})

export interface RepositorioEnMemoria extends RepositorioPublicaciones<string> {
  pedidos: { filtro: FiltroDePublicaciones; pedido: PedidoDePagina }[]
}

// Devuelve las publicaciones de la página pedida y registra cada pedido.
export function repositorioEnMemoria(
  publicaciones: readonly ResumenDePublicacion[],
  detalles: readonly DetalleDePublicacion<string>[] = [],
): RepositorioEnMemoria {
  const pedidos: RepositorioEnMemoria['pedidos'] = []
  return {
    pedidos,
    async listar(filtro, pedido) {
      pedidos.push({ filtro, pedido })
      const inicio = (pedido.pagina - 1) * pedido.porPagina
      return {
        publicaciones: publicaciones.slice(inicio, inicio + pedido.porPagina),
        total: publicaciones.length,
      }
    },
    async buscarPorSlug(slug) {
      return detalles.find((publicacion) => publicacion.slug === slug) ?? null
    },
  }
}
