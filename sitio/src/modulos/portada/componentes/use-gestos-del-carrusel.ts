'use client'

import type { FocusEvent, KeyboardEvent, PointerEvent } from 'react'
import { useRef } from 'react'

import { debePausarPorFoco } from './pausa-por-foco'
import type { EstadoDelCarrusel } from './use-carrusel'

// Distancia mínima en píxeles para tomar un arrastre como deslizamiento (v4).
const UMBRAL_DESLIZAR = 50

// Teclado (flechas), deslizamiento y pausa mientras el foco del teclado está en el hero.
export function useGestosDelCarrusel(carrusel: EstadoDelCarrusel) {
  const { actual, mostrar, pausarMientras } = carrusel
  const inicioX = useRef<number | null>(null)

  return {
    onKeyDown(evento: KeyboardEvent<HTMLElement>) {
      if (evento.key === 'ArrowRight') mostrar(actual + 1)
      if (evento.key === 'ArrowLeft') mostrar(actual - 1)
    },
    onPointerDown(evento: PointerEvent<HTMLElement>) {
      inicioX.current = evento.clientX
    },
    onPointerUp(evento: PointerEvent<HTMLElement>) {
      if (inicioX.current === null) return
      const recorrido = evento.clientX - inicioX.current
      inicioX.current = null
      if (Math.abs(recorrido) > UMBRAL_DESLIZAR) mostrar(actual + (recorrido < 0 ? 1 : -1))
    },
    // El mouse no pausa: la portada ocupa casi toda la primera pantalla y un cursor quieto
    // sobre ella la dejaba detenida para siempre. Para pausar está el botón.
    onFocus(evento: FocusEvent<HTMLElement>) {
      if (debePausarPorFoco(evento.target)) pausarMientras(true)
    },
    onBlur(evento: FocusEvent<HTMLElement>) {
      if (!evento.currentTarget.contains(evento.relatedTarget)) pausarMientras(false)
    },
  }
}
