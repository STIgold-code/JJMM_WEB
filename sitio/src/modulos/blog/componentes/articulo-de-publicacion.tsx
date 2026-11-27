import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

import type { Imagen } from '@/compartido/dominio/imagen'

import type { Categoria, Etiqueta } from '../dominio/publicacion'
import { rutaDeCategoria } from '../dominio/rutas-del-blog'
import estilos from './articulo-de-publicacion.module.css'
import { EtiquetasDePublicacion } from './etiquetas-de-publicacion'
import { FechaDePublicacion } from './fecha-de-publicacion'

interface PropsArticuloDePublicacion {
  titulo: string
  extracto: string
  imagen: Imagen | null
  categoria: Categoria | null
  etiquetas: readonly Etiqueta[]
  fechaDePublicacion: string
  // Contenido enriquecido ya dibujado por la ruta.
  children: ReactNode
}

// Detalle de una publicación: encabezado, imagen principal y contenido.
export function ArticuloDePublicacion(props: PropsArticuloDePublicacion) {
  const { titulo, extracto, imagen, categoria, etiquetas, fechaDePublicacion, children } = props
  return (
    <article className={`${estilos.articulo} contenedor`}>
      <header className={estilos.encabezado}>
        <p className={estilos.datos}>
          {categoria ? (
            <Link href={rutaDeCategoria(categoria.slug)}>{categoria.nombre}</Link>
          ) : null}
          <FechaDePublicacion valor={fechaDePublicacion} />
        </p>
        <h1>{titulo}</h1>
        <p className={estilos.extracto}>{extracto}</p>
        <EtiquetasDePublicacion etiquetas={etiquetas} />
      </header>
      {imagen ? (
        <Image
          className={estilos.imagen}
          src={imagen.url}
          alt={imagen.alt}
          width={imagen.ancho}
          height={imagen.alto}
          sizes="(min-width: 52rem) 48rem, 100vw"
          loading="eager"
          fetchPriority="high"
        />
      ) : null}
      {/* Sin aparición al hacer scroll: el texto puede ser el LCP y se ve de inmediato. */}
      <div className={estilos.contenido}>{children}</div>
    </article>
  )
}
