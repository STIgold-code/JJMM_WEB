import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ArticuloDePublicacion } from '@/modulos/blog/componentes/articulo-de-publicacion'
import { metadatosDePublicacion } from '@/modulos/blog/componentes/metadatos-del-blog'
import { obtenerPublicacion } from '@/modulos/blog/componentes/obtener-blog'
import { PublicacionesSimilares } from '@/modulos/blog/componentes/publicaciones-similares'

import type { PropsConSlug } from '../parametros-de-ruta'
import { ContenidoEnriquecido } from './contenido-enriquecido'

export async function generateMetadata({ params }: PropsConSlug): Promise<Metadata> {
  const resultado = await obtenerPublicacion((await params).slug)
  return resultado ? metadatosDePublicacion(resultado.publicacion) : {}
}

// /blog/<slug>: detalle de una publicación publicada. Un borrador o un slug desconocido da 404.
export default async function PaginaDePublicacion({ params }: PropsConSlug) {
  const resultado = await obtenerPublicacion((await params).slug)
  if (!resultado) notFound()
  const { publicacion, similares } = resultado
  return (
    <>
      <ArticuloDePublicacion
        titulo={publicacion.titulo}
        extracto={publicacion.extracto}
        imagen={publicacion.imagen}
        categoria={publicacion.categoria}
        etiquetas={publicacion.etiquetas}
        fechaDePublicacion={publicacion.fechaDePublicacion}
      >
        <ContenidoEnriquecido contenido={publicacion.contenido} />
      </ArticuloDePublicacion>
      <PublicacionesSimilares publicaciones={similares} />
    </>
  )
}
