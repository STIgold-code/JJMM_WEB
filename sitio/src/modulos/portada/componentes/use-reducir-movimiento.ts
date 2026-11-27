'use client'

import { useSyncExternalStore } from 'react'

const CONSULTA = '(prefers-reduced-motion: reduce)'

function suscribir(avisar: () => void) {
  const medio = window.matchMedia(CONSULTA)
  medio.addEventListener('change', avisar)
  return () => medio.removeEventListener('change', avisar)
}

// true si la persona pidió reducir el movimiento. En el servidor, false.
export function useReducirMovimiento(): boolean {
  return useSyncExternalStore(
    suscribir,
    () => window.matchMedia(CONSULTA).matches,
    () => false,
  )
}
