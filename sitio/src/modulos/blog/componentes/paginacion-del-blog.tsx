import Link from 'next/link'

import type { Paginacion } from '../dominio/paginacion'
import { rutaDePagina } from '../dominio/rutas-del-blog'
import estilos from './listado-del-blog.module.css'

interface PropsPaginacionDelBlog {
  paginacion: Paginacion
  // Ruta del listado sin parámetros, por ejemplo /blog/categoria/laboral.
  rutaBase: string
}

// Anterior y siguiente con la posición actual. Con una sola página no se dibuja.
export function PaginacionDelBlog({ paginacion, rutaBase }: PropsPaginacionDelBlog) {
  const { pagina, totalDePaginas, anterior, siguiente } = paginacion
  if (totalDePaginas === 1) return null
  return (
    <nav className={estilos.paginacion} aria-label="Paginación">
      {anterior ? (
        <Link className="boton boton-azul" href={rutaDePagina(rutaBase, anterior)} rel="prev">
          Anterior
        </Link>
      ) : null}
      <p>
        Página {pagina} de {totalDePaginas}
      </p>
      {siguiente ? (
        <Link className="boton boton-azul" href={rutaDePagina(rutaBase, siguiente)} rel="next">
          Siguiente
        </Link>
      ) : null}
    </nav>
  )
}
