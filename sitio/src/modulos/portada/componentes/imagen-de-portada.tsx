import Image, { getImageProps } from 'next/image'
import type { CSSProperties } from 'react'

import type { Imagen } from '@/compartido/dominio/imagen'

import type { PortadaPublica } from '../dominio/portada'
import estilos from './carrusel.module.css'

// Ancho máximo en el que cambia el diseño (igual que las media queries de la v4).
const MEDIA_CELULAR = '(max-width: 45.99rem)'

type EstiloConEncuadre = CSSProperties & { '--movil-x'?: string }

interface PropsImagenDePortada {
  portada: PortadaPublica
  // La primera portada es el LCP de la página: se pide con prioridad alta y sin espera.
  primera: boolean
}

const textoAlternativo = (portada: PortadaPublica) =>
  portada.imagenEsDecorativa ? '' : portada.imagen.alt

const prioridad = (primera: boolean) =>
  primera ? ({ preload: true, fetchPriority: 'high', loading: 'eager' } as const) : {}

// Portada con la imagen a todo el ancho, encuadrada en el celular según el panel.
function ImagenDeFondo({ portada, primera }: PropsImagenDePortada) {
  const encuadre = portada.encuadreEnCelular
  const estilo: EstiloConEncuadre = encuadre === null ? {} : { '--movil-x': `${encuadre}%` }
  return (
    <Image
      className={estilos.fondo}
      src={portada.imagen.url}
      alt={textoAlternativo(portada)}
      fill
      sizes="100vw"
      style={estilo}
      {...prioridad(primera)}
    />
  )
}

function fuenteDeCelular(imagen: Imagen | null, alt: string) {
  if (!imagen) return null
  const { props } = getImageProps({
    src: imagen.url,
    alt,
    width: imagen.ancho,
    height: imagen.alto,
    sizes: '100vw',
  })
  return <source media={MEDIA_CELULAR} srcSet={props.srcSet} sizes={props.sizes} />
}

// Portada cuyo texto está en la imagen: se ve completa sobre una copia desenfocada. En el
// celular puede usar otra imagen (dirección de arte con <picture>).
function ImagenCompleta({ portada, primera }: PropsImagenDePortada) {
  const { imagen } = portada
  const alt = textoAlternativo(portada)
  const { props } = getImageProps({
    src: imagen.url,
    alt,
    width: imagen.ancho,
    height: imagen.alto,
    sizes: '100vw',
    ...prioridad(primera),
  })
  return (
    <>
      <Image className={estilos.fondoDesenfocado} src={imagen.url} alt="" fill sizes="40vw" />
      <picture>
        {fuenteDeCelular(portada.imagenParaCelular, alt)}
        {/* <img> con las props de getImageProps: next/image no admite <picture>. */}
        <img {...props} alt={alt} className={estilos.imagenCompleta} />
      </picture>
    </>
  )
}

export function ImagenDePortada(props: PropsImagenDePortada) {
  return props.portada.disposicion === 'imagen-completa' ? (
    <ImagenCompleta {...props} />
  ) : (
    <ImagenDeFondo {...props} />
  )
}
