import Image from 'next/image'
import Link from 'next/link'

import type { Imagen } from '@/compartido/dominio/imagen'

import estilos from './cabecera.module.css'

interface PropsMarca {
  logo: Imagen | null
  nombreComercial: string
}

// Logo que lleva al inicio. Sin logo cargado, el nombre comercial ocupa su lugar.
export function Marca({ logo, nombreComercial }: PropsMarca) {
  return (
    <Link className={estilos.marca} href="/">
      {logo ? (
        <Image
          src={logo.url}
          alt={`${logo.alt || nombreComercial}: inicio`}
          width={logo.ancho}
          height={logo.alto}
          loading="eager"
        />
      ) : (
        <>
          {nombreComercial}
          <span className="oculto">: inicio</span>
        </>
      )}
    </Link>
  )
}

// Sello SIGE Mype, solo en pantallas anchas.
export function Sello({ sello }: { sello: Imagen | null }) {
  if (!sello) return null
  return (
    <Image
      className={estilos.sello}
      src={sello.url}
      alt={sello.alt}
      width={sello.ancho}
      height={sello.alto}
    />
  )
}
