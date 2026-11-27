'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Visible {
  ruta: string
  id: string | null
}

// Franja central de la pantalla, como el scrollspy de la v4.
const FRANJA = '-45% 0px -50% 0px'

// Id de la sección del menú que cruza el centro de la pantalla. Solo observa las secciones
// que existen en la página actual (en la guía o el blog no hay ninguna).
export function useSeccionActiva(ids: readonly string[]): string | null {
  const ruta = usePathname()
  const [visible, setVisible] = useState<Visible>({ ruta, id: null })
  const clave = ids.join(' ')

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const secciones = clave
      .split(' ')
      .map((id) => (id ? document.getElementById(id) : null))
      .filter((seccion): seccion is HTMLElement => seccion !== null)
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach(({ isIntersecting, target }) => {
          setVisible((previo) => {
            if (isIntersecting) return { ruta, id: target.id }
            return previo.id === target.id ? { ruta, id: null } : previo
          })
        })
      },
      { rootMargin: FRANJA },
    )
    secciones.forEach((seccion) => observador.observe(seccion))
    return () => observador.disconnect()
  }, [clave, ruta])

  return visible.ruta === ruta ? visible.id : null
}
