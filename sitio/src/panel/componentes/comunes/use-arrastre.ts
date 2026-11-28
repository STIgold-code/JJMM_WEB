'use client'

import { type DragEvent, useRef, useState } from 'react'

// Orden por arrastre con la API nativa del navegador (sin dependencias): la fila solo se puede
// arrastrar mientras se presiona su asa, así el texto de la fila se sigue pudiendo seleccionar.
// Es un atajo para el ratón; con el teclado y en pantallas táctiles se usan los botones
// «Subir» y «Bajar».
export function useArrastre(alSoltar: (desde: number, hacia: number) => void) {
  const [conAsa, setConAsa] = useState<number | null>(null)
  const [arrastrada, setArrastrada] = useState<number | null>(null)
  const desde = useRef<number | null>(null)

  const terminar = () => {
    desde.current = null
    setArrastrada(null)
    setConAsa(null)
  }

  const propsDeFila = (indice: number) => ({
    draggable: conAsa === indice,
    'data-arrastrada': arrastrada === indice || undefined,
    onDragStart: (evento: DragEvent) => {
      desde.current = indice
      setArrastrada(indice)
      evento.dataTransfer.effectAllowed = 'move'
      // Firefox no inicia el arrastre sin datos.
      evento.dataTransfer.setData('text/plain', String(indice))
    },
    onDragOver: (evento: DragEvent) => {
      if (desde.current !== null) evento.preventDefault()
    },
    onDrop: (evento: DragEvent) => {
      evento.preventDefault()
      if (desde.current !== null) alSoltar(desde.current, indice)
      terminar()
    },
    onDragEnd: terminar,
  })

  const propsDeAsa = (indice: number) => ({
    onPointerDown: () => setConAsa(indice),
    onPointerUp: () => setConAsa(null),
  })

  return { propsDeFila, propsDeAsa }
}
