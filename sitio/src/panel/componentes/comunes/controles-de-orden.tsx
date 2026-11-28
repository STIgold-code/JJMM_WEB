'use client'

import { ArrowDown, ArrowUp, GripVertical } from 'lucide-react'
import type { ComponentProps } from 'react'

import { Button } from '../ui/button'

// Clases de una celda de los listados ordenables; en celulares la fila se apila y la celda pierde
// su relleno.
export const CELDA_DE_LISTADO = 'px-4 py-[0.7rem] align-middle max-sm:p-0'

// Fila de un listado ordenable: en celulares se apila en una rejilla de dos columnas.
export const FILA_DE_LISTADO =
  'border-b transition-colors last:border-b-0 hover:bg-[#f8fafd] data-arrastrada:opacity-50 max-sm:grid max-sm:grid-cols-[minmax(0,1fr)_auto] max-sm:gap-x-3 max-sm:gap-y-[0.35rem] max-sm:px-4 max-sm:py-[0.85rem]'

interface PropsDeBotones {
  nombre: string
  indice: number
  total: number
  alMover: (desde: number, hacia: number, paso: -1 | 1) => void
}

// «Subir» y «Bajar»: el orden con el teclado y en pantallas táctiles. `data-mover` permite
// devolverles el foco cuando la fila cambia de lugar.
export function BotonesDeOrden({ nombre, indice, total, alMover }: PropsDeBotones) {
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        data-mover={-1}
        disabled={indice === 0}
        aria-label={`Subir ${nombre}`}
        onClick={() => alMover(indice, indice - 1, -1)}
      >
        <ArrowUp aria-hidden="true" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        data-mover={1}
        disabled={indice === total - 1}
        aria-label={`Bajar ${nombre}`}
        onClick={() => alMover(indice, indice + 1, 1)}
      >
        <ArrowDown aria-hidden="true" />
      </Button>
    </>
  )
}

// Asa para arrastrar (solo ratón) y posición. En celulares no se muestra.
export function CeldaDeOrden({
  posicion,
  propsDeAsa,
}: {
  posicion: number
  propsDeAsa: ComponentProps<'span'>
}) {
  return (
    <td className={`${CELDA_DE_LISTADO} w-px whitespace-nowrap max-sm:hidden`}>
      <div className="flex items-center gap-1 text-muted-foreground">
        <span
          title="Arrastra para cambiar el orden"
          className="grid size-7 cursor-grab place-items-center rounded-sm hover:bg-muted active:cursor-grabbing"
          {...propsDeAsa}
        >
          <GripVertical aria-hidden="true" className="size-4" />
        </span>
        <span className="min-w-[1.25rem] text-center text-sm font-semibold">{posicion}</span>
      </div>
    </td>
  )
}
