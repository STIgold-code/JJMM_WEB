import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ListadoDelBlog } from '@/modulos/blog/componentes/listado-del-blog'
import { metadatosDeListado } from '@/modulos/blog/componentes/metadatos-del-blog'
import { listarPorEtiqueta, obtenerPaginaDelBlog } from '@/modulos/blog/componentes/obtener-blog'
import { leerNumeroDePagina } from '@/modulos/blog/dominio/paginacion'
import { rutaDeEtiqueta } from '@/modulos/blog/dominio/rutas-del-blog'

import type { PropsDeListadoConSlug } from '../../parametros-de-ruta'

const ANTETITULO = 'Etiqueta'

async function leerRuta({ params, searchParams }: PropsDeListadoConSlug) {
  const [{ slug }, busqueda] = await Promise.all([params, searchParams])
  return { slug, pagina: leerNumeroDePagina(busqueda.pagina) }
}

export async function generateMetadata(props: PropsDeListadoConSlug): Promise<Metadata> {
  const { slug, pagina } = await leerRuta(props)
  const resultado = pagina ? await listarPorEtiqueta(slug, pagina) : null
  if (!pagina || !resultado) return {}
  const { nombre } = resultado.etiqueta
  const rutaBase = rutaDeEtiqueta(resultado.etiqueta.slug)
  return metadatosDeListado({
    titulo: `${ANTETITULO}: ${nombre}`,
    descripcion: null,
    rutaBase,
    pagina,
  })
}

// /blog/etiqueta/<slug>: publicaciones publicadas con una etiqueta.
export default async function PaginaDeEtiqueta(props: PropsDeListadoConSlug) {
  const { slug, pagina } = await leerRuta(props)
  if (!pagina) notFound()
  const [textos, resultado] = await Promise.all([
    obtenerPaginaDelBlog(),
    listarPorEtiqueta(slug, pagina),
  ])
  if (!textos || !resultado) notFound()
  return (
    <ListadoDelBlog
      titulo={resultado.etiqueta.nombre}
      antetitulo={ANTETITULO}
      introduccion={null}
      textoVacio={textos.textoSinPublicaciones}
      listado={resultado.listado}
      rutaBase={rutaDeEtiqueta(resultado.etiqueta.slug)}
    />
  )
}
