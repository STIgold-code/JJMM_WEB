import Image from 'next/image'
import Link from 'next/link'

import { propsDeRevelado } from '@/compartido/componentes/revelado/props-de-revelado'

import type { ResumenDePublicacion } from '../dominio/publicacion'
import { rutaDePublicacion } from '../dominio/rutas-del-blog'
import { FechaDePublicacion } from './fecha-de-publicacion'
import estilos from './publicaciones-similares.module.css'

interface PropsPublicacionesSimilares {
  publicaciones: readonly ResumenDePublicacion[]
}

// Otras publicaciones de la misma categoría. Sin ninguna, la sección no se dibuja.
export function PublicacionesSimilares({ publicaciones }: PropsPublicacionesSimilares) {
  if (publicaciones.length === 0) return null
  return (
    <section className={`${estilos.similares} contenedor`} aria-labelledby="titulo-similares">
      <h2 id="titulo-similares">Publicaciones similares</h2>
      <ul className={estilos.lista}>
        {publicaciones.map(({ slug, titulo, imagen, fechaDePublicacion }, indice) => (
          <li key={slug} {...propsDeRevelado({ retraso: indice * 0.15, clase: estilos.item })}>
            {imagen ? (
              <Image
                src={imagen.url}
                alt=""
                width={imagen.ancho}
                height={imagen.alto}
                sizes="(min-width: 46rem) 14rem, 100vw"
              />
            ) : null}
            <h3>
              <Link href={rutaDePublicacion(slug)}>{titulo}</Link>
            </h3>
            <FechaDePublicacion valor={fechaDePublicacion} clase={estilos.fecha} />
          </li>
        ))}
      </ul>
    </section>
  )
}
