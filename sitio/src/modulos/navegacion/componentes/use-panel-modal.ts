'use client'

import { useEffect, useRef } from 'react'

// Comportamiento del panel modal abierto: foco inicial en el botón de cerrar, Escape para
// cerrar y sin desplazamiento de la página de fondo. Devuelve la referencia de ese botón.
export function usePanelModal(abierto: boolean, alCerrar: () => void) {
  const botonCerrar = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!abierto) return
    botonCerrar.current?.focus()
    const alPresionar = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') alCerrar()
    }
    document.addEventListener('keydown', alPresionar)
    document.body.classList.add('menu-abierto')
    return () => {
      document.removeEventListener('keydown', alPresionar)
      document.body.classList.remove('menu-abierto')
    }
  }, [abierto, alCerrar])

  return botonCerrar
}
