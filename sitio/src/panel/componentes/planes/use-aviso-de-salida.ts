'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Clic principal sin teclas que abran otra pestaña o ventana.
function esClicSimple(evento: MouseEvent): boolean {
  const modificado = evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey
  return !evento.defaultPrevented && evento.button === 0 && !modificado
}

// Enlace que navegaría en esta pestaña (no `_blank` ni descarga), o `null`.
function enlaceDelClic(evento: MouseEvent): HTMLAnchorElement | null {
  const enlace = evento.target instanceof Element ? evento.target.closest('a[href]') : null
  if (!(enlace instanceof HTMLAnchorElement)) return null
  return enlace.target === '_blank' || enlace.download ? null : enlace
}

// Destino interno de un clic en un enlace, o `null` si el navegador debe seguir solo (otra
// pestaña, descarga, otro sitio, tecla modificadora o la misma página).
function destinoInterno(evento: MouseEvent): string | null {
  const enlace = esClicSimple(evento) ? enlaceDelClic(evento) : null
  if (!enlace) return null
  const url = new URL(enlace.href)
  const destino = `${url.pathname}${url.search}${url.hash}`
  const actual = `${location.pathname}${location.search}${location.hash}`
  return url.origin === location.origin && destino !== actual ? destino : null
}

// Con cambios sin guardar: el navegador pregunta antes de cerrar o recargar (`beforeunload`) y
// los enlaces del panel abren un diálogo propio antes de salir. El clic se intercepta en la
// fase de captura del documento, antes de que lo reciba `next/link`.
export function useAvisoDeSalida(activo: boolean) {
  const router = useRouter()
  const [destino, setDestino] = useState<string | null>(null)

  useEffect(() => {
    if (!activo) return
    const antesDeSalir = (evento: BeforeUnloadEvent) => evento.preventDefault()
    const alPulsar = (evento: MouseEvent) => {
      const interno = destinoInterno(evento)
      if (!interno) return
      evento.preventDefault()
      evento.stopPropagation()
      setDestino(interno)
    }
    window.addEventListener('beforeunload', antesDeSalir)
    document.addEventListener('click', alPulsar, true)
    return () => {
      window.removeEventListener('beforeunload', antesDeSalir)
      document.removeEventListener('click', alPulsar, true)
    }
  }, [activo])

  return {
    destino,
    seguirEditando: () => setDestino(null),
    salirSinGuardar: () => {
      if (destino) router.push(destino)
      setDestino(null)
    },
  }
}
