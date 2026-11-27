import Image from 'next/image'
import Link from 'next/link'

import type { ResumenDePublicacion } from '../dominio/publicacion'
import { rutaDeCategoria, rutaDePublicacion } from '../dominio/rutas-del-blog'
import { EtiquetasDePublicacion } from './etiquetas-de-publicacion'
import { FechaDePublicacion } from './fecha-de-publicacion'
import estilos from './tarjeta-de-publicacion.module.css'

interface PropsTarjetaDePublicacion {
  publicacion: ResumenDePublicacion
  // La primera tarjeta del listado suele ser el LCP: su imagen se carga de inmediato.
  destacada?: boolean
}

const TAMANOS_DE_IMAGEN = '(min-width: 64rem) 23rem, (min-width: 40rem) 45vw, 100vw'

// Tarjeta del listado: el título enlaza al detalle; categoría y etiquetas, a sus listados.
export function TarjetaDePublicacion({
  publicacion,
  destacada = false,
}: PropsTarjetaDePublicacion) {
  const { titulo, slug, extracto, imagen, categoria, etiquetas, fechaDePublicacion } = publicacion
  return (
    <article className={estilos.tarjeta}>
      {imagen ? (
        <Image
          className={estilos.imagen}
          src={imagen.url}
          alt={imagen.alt}
          width={imagen.ancho}
          height={imagen.alto}
          sizes={TAMANOS_DE_IMAGEN}
          loading={destacada ? 'eager' : 'lazy'}
          fetchPriority={destacada ? 'high' : 'auto'}
        />
      ) : null}
      <div className={estilos.cuerpo}>
        <p className={estilos.datos}>
          {categoria ? (
            <Link href={rutaDeCategoria(categoria.slug)}>{categoria.nombre}</Link>
          ) : null}
          <FechaDePublicacion valor={fechaDePublicacion} />
        </p>
        <h2 className={estilos.titulo}>
          <Link href={rutaDePublicacion(slug)}>{titulo}</Link>
        </h2>
        <p className={estilos.extracto}>{extracto}</p>
        <EtiquetasDePublicacion etiquetas={etiquetas} />
      </div>
    </article>
  )
}
