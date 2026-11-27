import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ListadoDelBlog } from '@/modulos/blog/componentes/listado-del-blog'
import { metadatosDelBlog } from '@/modulos/blog/componentes/metadatos-del-blog'
import { listarPublicaciones, obtenerPaginaDelBlog } from '@/modulos/blog/componentes/obtener-blog'
import { leerNumeroDePagina } from '@/modulos/blog/dominio/paginacion'
import { RUTA_DEL_BLOG } from '@/modulos/blog/dominio/rutas-del-blog'

import type { PropsDeListado } from './parametros-de-ruta'

export async function generateMetadata({ searchParams }: PropsDeListado): Promise<Metadata> {
  const pagina = leerNumeroDePagina((await searchParams).pagina)
  const textos = await obtenerPaginaDelBlog()
  return pagina && textos ? metadatosDelBlog(textos, pagina) : {}
}

// /blog: publicaciones publicadas, las más recientes primero, nueve por página (?pagina=N).
export default async function PaginaDelBlog({ searchParams }: PropsDeListado) {
  const pagina = leerNumeroDePagina((await searchParams).pagina)
  if (!pagina) notFound()
  const [textos, listado] = await Promise.all([
    obtenerPaginaDelBlog(),
    listarPublicaciones({ tipo: 'todas' }, pagina),
  ])
  if (!textos || !listado) notFound()
  return (
    <ListadoDelBlog
      titulo={textos.titulo}
      introduccion={textos.introduccion}
      textoVacio={textos.textoSinPublicaciones}
      listado={listado}
      rutaBase={RUTA_DEL_BLOG}
    />
  )
}
