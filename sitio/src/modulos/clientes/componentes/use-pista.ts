'use client'

import { type PointerEvent, type RefObject, useEffect, useRef, useState } from 'react'

// Margen en píxeles para considerar que la pista llegó a un extremo (v4).
const MARGEN = 8
// Cada flecha avanza el 80 % del ancho visible.
const AVANCE = 0.8

type RefDePista = RefObject<HTMLUListElement | null>

const reducirMovimiento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Si la pista está al inicio o al final, para desactivar la flecha que no avanza.
function useExtremos(pista: RefDePista) {
  const [extremos, setExtremos] = useState({ alInicio: true, alFinal: false })

  useEffect(() => {
    const elemento = pista.current
    if (!elemento) return
    const medir = () => {
      const { scrollLeft, clientWidth, scrollWidth } = elemento
      setExtremos({
        alInicio: scrollLeft < MARGEN,
        alFinal: scrollLeft + clientWidth > scrollWidth - MARGEN,
      })
    }
    const marco = requestAnimationFrame(medir)
    elemento.addEventListener('scroll', medir, { passive: true })
    window.addEventListener('resize', medir)
    return () => {
      cancelAnimationFrame(marco)
      elemento.removeEventListener('scroll', medir)
      window.removeEventListener('resize', medir)
    }
  }, [pista])

  return extremos
}

// Arrastre con el mouse; el táctil y el teclado usan el desplazamiento nativo.
function useArrastre(pista: RefDePista) {
  const arrastre = useRef<{ x: number; inicio: number } | null>(null)
  const [arrastrando, setArrastrando] = useState(false)
  const soltar = () => {
    arrastre.current = null
    setArrastrando(false)
  }
  const gestos = {
    onPointerDown(evento: PointerEvent<HTMLUListElement>) {
      if (evento.pointerType !== 'mouse' || !pista.current) return
      arrastre.current = { x: evento.clientX, inicio: pista.current.scrollLeft }
      setArrastrando(true)
    },
    onPointerMove(evento: PointerEvent<HTMLUListElement>) {
      if (!arrastre.current || !pista.current) return
      const left = arrastre.current.inicio - (evento.clientX - arrastre.current.x)
      pista.current.scrollTo({ left, behavior: 'instant' })
    },
    onPointerUp: soltar,
    onPointerLeave: soltar,
  }
  return { arrastrando, gestos }
}

export function usePista() {
  const pista = useRef<HTMLUListElement>(null)
  const extremos = useExtremos(pista)
  const { arrastrando, gestos } = useArrastre(pista)
  const mover = (sentido: 1 | -1) => {
    const elemento = pista.current
    if (!elemento) return
    const left = sentido * elemento.clientWidth * AVANCE
    elemento.scrollBy({ left, behavior: reducirMovimiento() ? 'auto' : 'smooth' })
  }
  return { pista, extremos, arrastrando, mover, gestos }
}
