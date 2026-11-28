'use client'

import { GripVertical, Trash2 } from 'lucide-react'
import type { ComponentProps } from 'react'

import type { FilaDelFormulario } from '../../dominio/filas-de-la-tabla'
import { Campo } from '../comunes/campo'
import { BotonesDeOrden } from '../comunes/controles-de-orden'
import { Button } from '../ui/button'

export const idDeLaFila = (clave: number) => `fila-${clave}`

interface Props {
  fila: FilaDelFormulario
  indice: number
  total: number
  // «Incluida en 3 de 4 planes»: lo que tiene guardado la fila.
  resumen: string
  error?: string
  // Solo el administrador quita filas.
  puedeQuitar: boolean
  alRenombrar: (nombre: string) => void
  alMover: (desde: number, hacia: number, paso: -1 | 1) => void
  alQuitar: () => void
  propsDeFila: ComponentProps<'li'>
  propsDeAsa: ComponentProps<'span'>
}

function Asa({ propsDeAsa, posicion }: { propsDeAsa: Props['propsDeAsa']; posicion: number }) {
  return (
    <div className="mt-1 flex shrink-0 items-center gap-1 text-muted-foreground">
      <span
        title="Arrastra para cambiar el orden"
        className="grid size-7 cursor-grab place-items-center rounded-sm hover:bg-muted active:cursor-grabbing max-sm:hidden"
        {...propsDeAsa}
      >
        <GripVertical aria-hidden="true" className="size-4" />
      </span>
      <span className="min-w-[1.25rem] text-center text-sm font-semibold">{posicion}</span>
    </div>
  )
}

// Una fila de la tabla (maqueta «Filas de la tabla»): asa, posición, nombre editable en la misma
// fila con lo que tiene guardado debajo, «Subir», «Bajar» y, para el administrador, «Eliminar».
export function FilaDeLaTabla(props: Props) {
  const { fila, indice, resumen, error } = props
  const nombre = fila.nombre.trim() || 'sin nombre'
  return (
    <li
      data-fila={fila.clave}
      className="flex flex-wrap items-start gap-x-3 gap-y-2 border-b bg-card px-4 py-3 last:border-b-0 data-arrastrada:opacity-50"
      {...props.propsDeFila}
    >
      <Asa propsDeAsa={props.propsDeAsa} posicion={indice + 1} />
      <Campo
        id={idDeLaFila(fila.clave)}
        etiqueta={`Nombre de la fila ${indice + 1}`}
        className="grid min-w-0 flex-1 basis-56 gap-[0.4rem] [&>label]:sr-only"
        required
        maxLength={200}
        ayuda={resumen}
        error={error}
        value={fila.nombre}
        onChange={(evento) => props.alRenombrar(evento.target.value)}
      />
      <Acciones {...props} nombre={nombre} />
    </li>
  )
}

function Acciones(props: Props & { nombre: string }) {
  const { nombre, indice, total } = props
  return (
    <div className="flex items-center gap-1 max-sm:w-full max-sm:justify-end">
      <BotonesDeOrden
        nombre={`«${nombre}»`}
        indice={indice}
        total={total}
        alMover={props.alMover}
      />
      {props.puedeQuitar && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Eliminar la fila «${nombre}»`}
          onClick={props.alQuitar}
        >
          <Trash2 aria-hidden="true" />
        </Button>
      )}
    </div>
  )
}
