'use client'

import { useCallback, useState } from 'react'

import { useReducirMovimiento } from './use-reducir-movimiento'

export interface EstadoDelCarrusel {
  actual: number
  // Cambia en cada avance para reiniciar la barra de progreso.
  vuelta: number
  // false hasta el primer cambio: la primera portada no repite su transición al cargar.
  cambiado: boolean
  pausado: boolean
  // Sin avance automático porque se pidió reducir el movimiento y la pausa sigue puesta.
  sinAvance: boolean
  pausadoPorUsuario: boolean
  mostrar: (indice: number) => void
  alternarPausa: () => void
  pausarMientras: (activa: boolean) => void
}

// Estado del hero. Con movimiento reducido arranca pausado, como la v4.
export function useCarrusel(cantidad: number): EstadoDelCarrusel {
  const reducir = useReducirMovimiento()
  const [actual, setActual] = useState(0)
  const [vuelta, setVuelta] = useState(0)
  const [eleccion, setEleccion] = useState<boolean | null>(null)
  const [pausaTemporal, setPausaTemporal] = useState(false)
  const pausadoPorUsuario = eleccion ?? reducir

  const mostrar = useCallback(
    (indice: number) => {
      setActual(((indice % cantidad) + cantidad) % cantidad)
      setVuelta((anterior) => anterior + 1)
    },
    [cantidad],
  )

  return {
    actual,
    vuelta,
    cambiado: vuelta > 0,
    pausado: pausadoPorUsuario || pausaTemporal,
    sinAvance: reducir && pausadoPorUsuario,
    pausadoPorUsuario,
    mostrar,
    alternarPausa: () => setEleccion(!pausadoPorUsuario),
    pausarMientras: setPausaTemporal,
  }
}
