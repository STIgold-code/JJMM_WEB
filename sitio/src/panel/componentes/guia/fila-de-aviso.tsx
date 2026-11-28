'use client'

import type { ComponentProps } from 'react'

import { type AvisoDelPanel, secundarioDeAviso } from '../../dominio/avisos-para-clientes'
import {
  BotonesDeOrden,
  CELDA_DE_LISTADO as CELDA,
  CeldaDeOrden,
  FILA_DE_LISTADO,
} from '../comunes/controles-de-orden'
import { InsigniaDeVisibilidad } from '../comunes/insignia-de-visibilidad'
import { Interruptor } from '../comunes/interruptor'
import { Button } from '../ui/button'

interface Props {
  aviso: AvisoDelPanel
  indice: number
  total: number
  alEditar: (id: number) => void
  alCambiarVisibilidad: (id: number, visible: boolean) => void
  alMover: (desde: number, hacia: number, paso: -1 | 1) => void
  propsDeFila: ComponentProps<'tr'>
  propsDeAsa: ComponentProps<'span'>
}

// Título (abre el panel lateral) y dato secundario.
function CeldaDelTitulo({ aviso, alEditar }: Pick<Props, 'aviso' | 'alEditar'>) {
  return (
    <td className={`${CELDA} max-sm:col-start-1`}>
      <div className="grid min-w-0 leading-[1.35]">
        <button
          type="button"
          onClick={() => alEditar(aviso.id)}
          className="truncate text-left font-[650] text-foreground hover:text-primary hover:underline"
        >
          {aviso.titulo}
        </button>
        <span className="truncate text-[0.8125rem] text-muted-foreground">
          {secundarioDeAviso(aviso)}
        </span>
      </div>
    </td>
  )
}

function CeldaDeAcciones({ aviso, indice, total, alMover, alEditar }: Props) {
  return (
    <td className={`${CELDA} max-sm:col-span-full`}>
      <div className="flex items-center justify-end gap-1 max-sm:justify-start">
        <BotonesDeOrden nombre={aviso.titulo} indice={indice} total={total} alMover={alMover} />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="ml-1 bg-card"
          aria-label={`Editar «${aviso.titulo}»`}
          onClick={() => alEditar(aviso.id)}
        >
          Editar
        </Button>
      </div>
    </td>
  )
}

// Fila del listado de avisos, como la de sedes: en celulares se apila (título e interruptor
// arriba; estado y acciones debajo) y el asa se oculta.
export function FilaDeAviso(props: Props) {
  const { aviso, indice } = props
  return (
    <tr data-fila={aviso.id} className={FILA_DE_LISTADO} {...props.propsDeFila}>
      <CeldaDeOrden posicion={indice + 1} propsDeAsa={props.propsDeAsa} />
      <CeldaDelTitulo aviso={aviso} alEditar={props.alEditar} />
      <td className={`${CELDA} max-sm:col-span-full`}>
        <InsigniaDeVisibilidad visible={aviso.visible} />
      </td>
      <td
        className={`${CELDA} max-sm:col-start-2 max-sm:row-start-1 max-sm:self-center max-sm:justify-self-end`}
      >
        <Interruptor
          activo={aviso.visible}
          alCambiar={(visible) => props.alCambiarVisibilidad(aviso.id, visible)}
          aria-label={`«${aviso.titulo}» visible en la guía`}
        />
      </td>
      <CeldaDeAcciones {...props} />
    </tr>
  )
}
