'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const SELECTOR = '.revelar:not(.visible)'
const UMBRAL = 0.15

function mostrarTodos(elementos: readonly Element[]) {
  elementos.forEach((elemento) => elemento.classList.add('visible'))
}

// Un solo observador para todo el sitio. Sin IntersectionObserver o con movimiento reducido
// muestra todo de inmediato; sin JavaScript, la clase `js` no existe y nada se oculta.
// Se vuelve a ejecutar al cambiar de ruta para observar el contenido de la página nueva.
export function ObservadorDeRevelado() {
  const ruta = usePathname()

  useEffect(() => {
    const elementos = Array.from(document.querySelectorAll(SELECTOR))
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducir || !('IntersectionObserver' in window)) {
      mostrarTodos(elementos)
      return
    }
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return
          entrada.target.classList.add('visible')
          observador.unobserve(entrada.target)
        })
      },
      { threshold: UMBRAL },
    )
    elementos.forEach((elemento) => observador.observe(elemento))
    return () => observador.disconnect()
  }, [ruta])

  return null
}
