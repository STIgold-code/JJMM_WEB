'use client'

import type { ComponentProps } from 'react'

import { secundarioDeValor, type ValorDelPanel } from '../../dominio/valores'
import {
  BotonesDeOrden,
  CELDA_DE_LISTADO as CELDA,
  CeldaDeOrden,
  FILA_DE_LISTADO,
} from '../comunes/controles-de-orden'
import { Button } from '../ui/button'
import { IconoDeValor } from './icono-de-valor'

interface Props {
  valor: ValorDelPanel
  indice: number
  total: number
  alEditar: (id: number) => void
  alMover: (desde: number, hacia: number, paso: -1 | 1) => void
  propsDeFila: ComponentProps<'tr'>
  propsDeAsa: ComponentProps<'span'>
}

// Ícono, nombre (abre el panel lateral) y qué ícono es.
function CeldaDelNombre({ valor, alEditar }: Pick<Props, 'valor' | 'alEditar'>) {
  return (
    <td className={`${CELDA} max-sm:col-span-full`}>
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-accent text-primary">
          <IconoDeValor icono={valor.icono} />
        </span>
        <div className="grid min-w-0 leading-[1.35]">
          <button
            type="button"
            onClick={() => alEditar(valor.id)}
            className="truncate text-left font-[650] text-foreground hover:text-primary hover:underline"
          >
            {valor.nombre}
          </button>
          <span className="truncate text-[0.8125rem] text-muted-foreground">
            {secundarioDeValor(valor)}
          </span>
        </div>
      </div>
    </td>
  )
}

// Fila del listado de valores. En celulares se apila y el asa se oculta (el orden sigue con
// «Subir» y «Bajar»).
export function FilaDeValor(props: Props) {
  const { valor, indice, total, alMover, alEditar } = props
  return (
    <tr data-fila={valor.id} className={FILA_DE_LISTADO} {...props.propsDeFila}>
      <CeldaDeOrden posicion={indice + 1} propsDeAsa={props.propsDeAsa} />
      <CeldaDelNombre valor={valor} alEditar={alEditar} />
      <td className={`${CELDA} max-sm:col-span-full`}>
        <div className="flex items-center justify-end gap-1 max-sm:justify-start">
          <BotonesDeOrden nombre={valor.nombre} indice={indice} total={total} alMover={alMover} />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="ml-1 bg-card"
            aria-label={`Editar ${valor.nombre}`}
            onClick={() => alEditar(valor.id)}
          >
            Editar
          </Button>
        </div>
      </td>
    </tr>
  )
}
