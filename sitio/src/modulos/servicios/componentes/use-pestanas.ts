'use client'

import { type KeyboardEvent, useRef, useState } from 'react'

import { pestanaPorTecla } from './pestana-por-tecla'

// Las pestañas forman una rejilla de 3 columnas (P1–P9).
const COLUMNAS = 3

export interface EstadoDePestanas {
  activa: number
  // false hasta el primer cambio: el primer panel no repite su entrada al cargar.
  cambiada: boolean
  elegir: (indice: number) => void
  registrar: (indice: number) => (boton: HTMLButtonElement | null) => void
  alPresionar: (evento: KeyboardEvent, indice: number) => void
}

// Pestaña activa con el teclado del patrón de pestañas: al moverse con flechas, la nueva
// pestaña se activa y recibe el foco.
export function usePestanas(total: number): EstadoDePestanas {
  const [activa, setActiva] = useState(0)
  const [cambiada, setCambiada] = useState(false)
  const botones = useRef<(HTMLButtonElement | null)[]>([])

  const elegir = (indice: number) => {
    setActiva(indice)
    setCambiada(true)
  }

  return {
    activa,
    cambiada,
    elegir,
    registrar: (indice) => (boton) => {
      botones.current[indice] = boton
    },
    alPresionar(evento, indice) {
      const destino = pestanaPorTecla(indice, evento.key, total, COLUMNAS)
      if (destino === null) return
      evento.preventDefault()
      elegir(destino)
      botones.current[destino]?.focus()
    },
  }
}
