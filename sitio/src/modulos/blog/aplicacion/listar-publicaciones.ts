import {
  calcularPaginacion,
  type Paginacion,
  PUBLICACIONES_POR_PAGINA,
} from '../dominio/paginacion'
import type { ResumenDePublicacion } from '../dominio/publicacion'
import type {
  FiltroDePublicaciones,
  RepositorioListadoDePublicaciones,
} from './repositorio-publicaciones'

export interface ListadoDePublicaciones {
  publicaciones: readonly ResumenDePublicacion[]
  paginacion: Paginacion
}

// Una página de un listado del blog. Null si la página pedida no existe.
export function crearListarPublicaciones(repositorio: RepositorioListadoDePublicaciones) {
  return async (
    filtro: FiltroDePublicaciones,
    pagina: number,
  ): Promise<ListadoDePublicaciones | null> => {
    const porPagina = PUBLICACIONES_POR_PAGINA
    const { publicaciones, total } = await repositorio.listar(filtro, { pagina, porPagina })
    const paginacion = calcularPaginacion(total, pagina, porPagina)
    return paginacion ? { publicaciones, paginacion } : null
  }
}
