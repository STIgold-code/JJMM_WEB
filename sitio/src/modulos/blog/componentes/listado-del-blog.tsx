import type { ListadoDePublicaciones } from '../aplicacion/listar-publicaciones'
import { ListaDePublicaciones } from './lista-de-publicaciones'
import estilos from './listado-del-blog.module.css'
import { PaginacionDelBlog } from './paginacion-del-blog'

interface PropsListadoDelBlog {
  titulo: string
  // Rótulo sobre el título, por ejemplo «Categoría» en /blog/categoria/<slug>.
  antetitulo?: string
  introduccion: string | null
  textoVacio: string
  listado: ListadoDePublicaciones
  rutaBase: string
}

// Página de listado: encabezado, tarjetas y paginación. Sirve a /blog, categoría y etiqueta.
export function ListadoDelBlog(props: PropsListadoDelBlog) {
  const { titulo, antetitulo, introduccion, textoVacio, listado, rutaBase } = props
  return (
    <section className={`${estilos.listado} contenedor`} aria-labelledby="titulo-del-listado">
      <header className={estilos.encabezado}>
        {antetitulo ? <p className={estilos.antetitulo}>{antetitulo}</p> : null}
        <h1 id="titulo-del-listado">{titulo}</h1>
        {introduccion ? <p className={estilos.introduccion}>{introduccion}</p> : null}
      </header>
      <ListaDePublicaciones publicaciones={listado.publicaciones} textoVacio={textoVacio} />
      <PaginacionDelBlog paginacion={listado.paginacion} rutaBase={rutaBase} />
    </section>
  )
}
