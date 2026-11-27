'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { estaEnPantalla } from './en-pantalla'

const SELECTOR = '.revelar:not(.visible):not(.pendiente)'
const UMBRAL = 0.15

// Un solo observador para todo el sitio. El contenido se dibuja visible: lo que ya está en
// pantalla al cargar no espera a JavaScript para verse (así no retrasa el LCP). Solo lo que
// queda más abajo se oculta con `pendiente` y se anima al entrar en pantalla.
// Sin IntersectionObserver o con movimiento reducido no se oculta nada.
// Se vuelve a ejecutar al cambiar de ruta para observar el contenido de la página nueva.
export function ObservadorDeRevelado() {
  const ruta = usePathname()

  useEffect(() => {
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducir || !('IntersectionObserver' in window)) return
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return
          entrada.target.classList.replace('pendiente', 'visible')
          observador.unobserve(entrada.target)
        })
      },
      { threshold: UMBRAL },
    )
    document.querySelectorAll(SELECTOR).forEach((elemento) => {
      if (estaEnPantalla(elemento.getBoundingClientRect(), window.innerHeight)) return
      elemento.classList.add('pendiente')
      observador.observe(elemento)
    })
    return () => observador.disconnect()
  }, [ruta])

  return null
}
