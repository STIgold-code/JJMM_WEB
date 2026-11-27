'use client'

import Image from 'next/image'
import { useState } from 'react'

import { Icono } from '@/compartido/componentes/iconos/icono'
import type { Imagen } from '@/compartido/dominio/imagen'

import estilos from './contacto.module.css'

interface PropsMapaDeSede {
  nombre: string
  mapa: string
  // Sin texto del botón no hay forma de pedir el mapa: queda solo la fachada.
  textoDelBoton: string | null
  foto: Imagen | null
}

// Al aparecer, el mapa recibe el foco: el botón que lo pidió ya no existe.
const enfocar = (marco: HTMLIFrameElement | null) => marco?.focus()

// Fachada del mapa (v5): foto con el pin y «Ver mapa». Google Maps se carga solo cuando la
// persona lo pide, así la página no descarga terceros que nadie pidió (S3). La foto queda
// debajo de la primera pantalla: carga diferida y prioridad baja.
export function MapaDeSede({ nombre, mapa, textoDelBoton, foto }: PropsMapaDeSede) {
  const [abierto, setAbierto] = useState(false)
  return (
    <div className={estilos.mapa}>
      {foto ? (
        <Image
          className={estilos.fotoDelMapa}
          src={foto.url}
          alt=""
          fill
          sizes="(min-width: 46rem) 34rem, 100vw"
          loading="lazy"
          fetchPriority="low"
        />
      ) : null}
      {abierto ? (
        <iframe
          ref={enfocar}
          title={`Mapa de la ${nombre}`}
          src={mapa}
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div>
          <Icono nombre="pin" />
          {textoDelBoton ? (
            <button type="button" className="boton boton-contacto" onClick={() => setAbierto(true)}>
              {textoDelBoton}
              <span className="oculto"> de la {nombre}</span>
            </button>
          ) : null}
        </div>
      )}
    </div>
  )
}
