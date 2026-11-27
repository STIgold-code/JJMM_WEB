'use client'

import { useSyncExternalStore } from 'react'

function suscribir(avisar: () => void) {
  window.addEventListener('scroll', avisar, { passive: true })
  return () => window.removeEventListener('scroll', avisar)
}

// true cuando la página se desplazó más de `umbral` píxeles. En el servidor, false.
export function useDesplazado(umbral: number): boolean {
  return useSyncExternalStore(
    suscribir,
    () => window.scrollY > umbral,
    () => false,
  )
}
