import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ListadoDelBlog } from '@/modulos/blog/componentes/listado-del-blog'
import { metadatosDeListado } from '@/modulos/blog/componentes/metadatos-del-blog'
import { listarPorCategoria, obtenerPaginaDelBlog } from '@/modulos/blog/componentes/obtener-blog'
import { leerNumeroDePagina } from '@/modulos/blog/dominio/paginacion'
import { rutaDeCategoria } from '@/modulos/blog/dominio/rutas-del-blog'

import type { PropsDeListadoConSlug } from '../../parametros-de-ruta'

const ANTETITULO = 'Categoría'

async function leerRuta({ params, searchParams }: PropsDeListadoConSlug) {
  const [{ slug }, busqueda] = await Promise.all([params, searchParams])
  return { slug, pagina: leerNumeroDePagina(busqueda.pagina) }
}

export async function generateMetadata(props: PropsDeListadoConSlug): Promise<Metadata> {
  const { slug, pagina } = await leerRuta(props)
  const resultado = pagina ? await listarPorCategoria(slug, pagina) : null
  if (!pagina || !resultado) return {}
  const { nombre } = resultado.categoria
  const rutaBase = rutaDeCategoria(resultado.categoria.slug)
  return metadatosDeListado({
    titulo: `${ANTETITULO}: ${nombre}`,
    descripcion: null,
    rutaBase,
    pagina,
  })
}

// /blog/categoria/<slug>: publicaciones publicadas de una categoría.
export default async function PaginaDeCategoria(props: PropsDeListadoConSlug) {
  const { slug, pagina } = await leerRuta(props)
  if (!pagina) notFound()
  const [textos, resultado] = await Promise.all([
    obtenerPaginaDelBlog(),
    listarPorCategoria(slug, pagina),
  ])
  if (!textos || !resultado) notFound()
  return (
    <ListadoDelBlog
      titulo={resultado.categoria.nombre}
      antetitulo={ANTETITULO}
      introduccion={null}
      textoVacio={textos.textoSinPublicaciones}
      listado={resultado.listado}
      rutaBase={rutaDeCategoria(resultado.categoria.slug)}
    />
  )
}
