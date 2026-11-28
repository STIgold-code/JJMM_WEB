'use client'

import { useEffect, useRef } from 'react'

import { enfocar, type FocoPendiente } from './use-lista-ordenable'

// Para listas que se ordenan en el formulario y se guardan después (página de inicio, portadas):
// tras mover una fila con sus flechas, el foco vuelve a la flecha de esa fila en su lugar nuevo.
// `pedir` se llama al mover; `cambio` es lo que cambia al dibujar la lista en el orden nuevo.
export function useFocoTrasMover(cambio: unknown) {
  const foco = useRef<FocoPendiente | null>(null)
  useEffect(() => {
    if (!foco.current) return
    enfocar(foco.current)
    foco.current = null
  }, [cambio])
  return (pendiente: FocoPendiente) => {
    foco.current = pendiente
  }
}
