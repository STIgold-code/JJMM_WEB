'use client'

import type { CSSProperties, ReactNode } from 'react'

import type { Disposicion, Transicion } from '../dominio/portada'
import estilos from './carrusel.module.css'
import { ControlesDelCarrusel } from './controles-del-carrusel'
import { useCarrusel } from './use-carrusel'
import { useGestosDelCarrusel } from './use-gestos-del-carrusel'

// Contenido de una portada ya dibujado en el servidor; la isla solo decide cuál se ve.
export interface Diapositiva {
  disposicion: Disposicion
  transicion: Transicion
  contenido: ReactNode
}

interface PropsCarruselInteractivo {
  diapositivas: readonly Diapositiva[]
  segundosPorPortada: number
  etiqueta: string
}

type EstiloConDuracion = CSSProperties & { '--duracion': string }

const CLASE_POR_DISPOSICION: Record<Disposicion, string> = {
  'texto-izquierda': '',
  'texto-derecha': estilos.textoDerecha ?? '',
  'imagen-completa': estilos.completa ?? '',
}

// Isla de cliente del hero (S5, S6): avance por la barra de progreso, pausa, flechas,
// deslizamiento y teclado. Las portadas ocultas quedan `inert` para el teclado.
export function CarruselInteractivo(props: PropsCarruselInteractivo) {
  const { diapositivas, segundosPorPortada, etiqueta } = props
  const carrusel = useCarrusel(diapositivas.length)
  const gestos = useGestosDelCarrusel(carrusel)
  const estilo: EstiloConDuracion = { '--duracion': `${segundosPorPortada}s` }

  return (
    <section
      id="inicio"
      className={`${estilos.hero} oscuro`}
      style={estilo}
      aria-roledescription="carrusel"
      aria-label={etiqueta}
      {...gestos}
    >
      {diapositivas.map((diapositiva, indice) => {
        const esActual = indice === carrusel.actual
        return (
          <div
            key={indice}
            className={`${estilos.portada} ${CLASE_POR_DISPOSICION[diapositiva.disposicion]} ${esActual ? estilos.actual : ''}`}
            data-actual={esActual}
            data-disposicion={diapositiva.disposicion}
            data-transicion={carrusel.cambiado ? diapositiva.transicion : undefined}
            role="group"
            aria-roledescription="diapositiva"
            aria-label={`${indice + 1} de ${diapositivas.length}`}
            aria-hidden={!esActual}
            inert={!esActual}
          >
            {diapositiva.contenido}
          </div>
        )
      })}
      {diapositivas.length > 1 ? (
        <ControlesDelCarrusel cantidad={diapositivas.length} carrusel={carrusel} />
      ) : null}
    </section>
  )
}
