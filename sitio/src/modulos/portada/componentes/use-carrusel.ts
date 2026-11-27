'use client'

import { useCallback, useState } from 'react'

export interface EstadoDelCarrusel {
  actual: number
  // Cambia en cada avance para reiniciar la barra de progreso.
  vuelta: number
  // false hasta el primer cambio: la primera portada no repite su transición al cargar.
  cambiado: boolean
  pausado: boolean
  pausadoPorUsuario: boolean
  mostrar: (indice: number) => void
  alternarPausa: () => void
  pausarMientras: (activa: boolean) => void
}

// Estado del hero. Por defecto avanza solo, también con movimiento reducido: en ese caso las
// portadas cambian sin transiciones (las desactiva la hoja de estilos global). Lo detiene el
// botón de pausa.
export function useCarrusel(cantidad: number): EstadoDelCarrusel {
  const [actual, setActual] = useState(0)
  const [vuelta, setVuelta] = useState(0)
  const [pausadoPorUsuario, setPausadoPorUsuario] = useState(false)
  const [pausaTemporal, setPausaTemporal] = useState(false)

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
    pausadoPorUsuario,
    mostrar,
    alternarPausa: () => setPausadoPorUsuario((anterior) => !anterior),
    pausarMientras: setPausaTemporal,
  }
}
