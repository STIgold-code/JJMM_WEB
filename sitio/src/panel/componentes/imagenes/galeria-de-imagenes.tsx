import Link from 'next/link'

import type { ImagenConUsos } from '../../aplicacion/consultar-imagenes'
import { type ConsultaDeImagenes, rutaDeImagenes } from '../../dominio/imagenes'
import { esLogotipo, textoDeUsos } from '../../dominio/usos-de-imagenes'
import { MiniaturaDeImagen } from '../comunes/miniatura-de-imagen'
import { idDeLaImagen } from './ids-de-imagenes'

interface Props {
  imagenes: ImagenConUsos[]
  consulta: ConsultaDeImagenes
  textoVacio: string
}

// Ancho con que se dibuja cada miniatura: dos columnas en el celular y columnas de ~11rem desde
// la tableta. `next/image` pide al optimizador solo ese ancho, nunca el original.
const TAMANOS = '(max-width: 640px) 50vw, 14rem'

// Cuadrícula de la maqueta: miniatura, nombre del archivo y dónde se usa. Cada tarjeta es un
// enlace que abre la imagen en el panel lateral (`?imagen=<id>`).
export function GaleriaDeImagenes({ imagenes, consulta, textoVacio }: Props) {
  if (imagenes.length === 0)
    return <p className="px-4 py-12 text-center text-muted-foreground">{textoVacio}</p>
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-4 p-4 max-sm:grid-cols-2 max-sm:gap-3 max-sm:p-3">
      {imagenes.map((imagen) => (
        <li key={imagen.id} className="min-w-0">
          <Link
            id={idDeLaImagen(imagen.id)}
            href={rutaDeImagenes({ ...consulta, imagen: imagen.id })}
            scroll={false}
            className="grid w-full gap-2 overflow-hidden rounded-lg border bg-card text-left transition-shadow outline-none hover:shadow-md focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <MiniaturaDeImagen
              url={imagen.url}
              alt={imagen.alt}
              sizes={TAMANOS}
              entera={esLogotipo(imagen.usos, imagen.mime)}
              className="border-b"
            />
            <span className="grid min-w-0 px-3 pb-[0.7rem] leading-[1.35]">
              <strong className="truncate text-[0.8125rem]">{imagen.nombre}</strong>
              <span className="line-clamp-2 text-xs text-muted-foreground">
                {textoDeUsos(imagen.usos)}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
