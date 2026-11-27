import type { DetalleDePublicacion, ResumenDePublicacion } from '../dominio/publicacion'
import { leerSlug } from '../dominio/rutas-del-blog'
import { CANDIDATAS_A_SIMILARES, seleccionarSimilares } from '../dominio/similares'
import type {
  RepositorioListadoDePublicaciones,
  RepositorioPublicaciones,
} from './repositorio-publicaciones'

export interface PublicacionConSimilares<Contenido> {
  publicacion: DetalleDePublicacion<Contenido>
  similares: readonly ResumenDePublicacion[]
}

async function buscarSimilares(
  repositorio: RepositorioListadoDePublicaciones,
  publicacion: ResumenDePublicacion,
): Promise<ResumenDePublicacion[]> {
  if (!publicacion.categoria) return []
  const { publicaciones } = await repositorio.listar(
    { tipo: 'categoria', slug: publicacion.categoria.slug },
    { pagina: 1, porPagina: CANDIDATAS_A_SIMILARES },
  )
  return seleccionarSimilares(publicacion.slug, publicaciones)
}

// Detalle de una publicación publicada y sus similares. Null si no existe o es un borrador.
export function crearObtenerPublicacion<Contenido>(
  repositorio: RepositorioPublicaciones<Contenido>,
) {
  return async (segmento: string): Promise<PublicacionConSimilares<Contenido> | null> => {
    const slug = leerSlug(segmento)
    if (!slug) return null
    const publicacion = await repositorio.buscarPorSlug(slug)
    if (!publicacion) return null
    return { publicacion, similares: await buscarSimilares(repositorio, publicacion) }
  }
}
