'use client'

import type { ComponentProps } from 'react'

import {
  type ClienteDelPanel,
  nombrePorConfirmar,
  secundarioDeCliente,
} from '../../dominio/clientes'
import {
  BotonesDeOrden,
  CELDA_DE_LISTADO as CELDA,
  CeldaDeOrden,
  FILA_DE_LISTADO,
} from '../comunes/controles-de-orden'
import { Insignia } from '../comunes/insignia'
import { InsigniaDeVisibilidad } from '../comunes/insignia-de-visibilidad'
import { Interruptor } from '../comunes/interruptor'
import { MiniaturaDeImagen } from '../comunes/miniatura-de-imagen'
import { Button } from '../ui/button'

export interface PropsDeFilaDeCliente {
  cliente: ClienteDelPanel
  posicion: number
  // Sin orden (hay un filtro o una búsqueda), la fila no lleva asa ni flechas.
  orden: {
    indice: number
    total: number
    alMover: (desde: number, hacia: number, paso: -1 | 1) => void
    propsDeFila: ComponentProps<'tr'>
    propsDeAsa: ComponentProps<'span'>
  } | null
  alEditar: (id: number) => void
  alCambiarVisibilidad: (id: number, visible: boolean) => void
}

// Logotipo (decorativo: el nombre lo nombra), nombre que abre el panel lateral y su sitio web.
function CeldaDelNombre({ cliente, alEditar }: Pick<PropsDeFilaDeCliente, 'cliente' | 'alEditar'>) {
  return (
    <td className={`${CELDA} max-sm:col-start-1`}>
      <div className="flex min-w-0 items-center gap-3">
        <MiniaturaDeImagen
          url={cliente.logo?.url ?? null}
          alt=""
          sizes="4rem"
          entera
          className="h-10 w-16 shrink-0 rounded-sm border [&_img]:p-1"
        />
        <div className="grid min-w-0 leading-[1.35]">
          <button
            type="button"
            onClick={() => alEditar(cliente.id)}
            className="truncate text-left font-[650] text-foreground hover:text-primary hover:underline"
          >
            {cliente.nombre}
          </button>
          <span className="flex min-w-0 flex-wrap items-center gap-x-2 text-[0.8125rem] text-muted-foreground">
            <span className="truncate">{secundarioDeCliente(cliente)}</span>
            {nombrePorConfirmar(cliente.nombre) && (
              <Insignia tono="pendiente" texto="Nombre por confirmar" />
            )}
          </span>
        </div>
      </div>
    </td>
  )
}

function CeldaDeAcciones({ cliente, orden, alEditar }: PropsDeFilaDeCliente) {
  return (
    <td className={`${CELDA} max-sm:col-span-full`}>
      <div className="flex items-center justify-end gap-1 max-sm:justify-start">
        {orden && (
          <BotonesDeOrden
            nombre={cliente.nombre}
            indice={orden.indice}
            total={orden.total}
            alMover={orden.alMover}
          />
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="ml-1 bg-card"
          aria-label={`Editar ${cliente.nombre}`}
          onClick={() => alEditar(cliente.id)}
        >
          Editar
        </Button>
      </div>
    </td>
  )
}

// Fila del listado de clientes, como la de planes y sedes: en celulares se apila (nombre e
// interruptor arriba; estado y acciones debajo) y el asa se oculta.
export function FilaDeCliente(props: PropsDeFilaDeCliente) {
  const { cliente, posicion, orden } = props
  return (
    <tr data-fila={cliente.id} className={FILA_DE_LISTADO} {...orden?.propsDeFila}>
      {orden ? (
        <CeldaDeOrden posicion={posicion} propsDeAsa={orden.propsDeAsa} />
      ) : (
        <td
          className={`${CELDA} w-px text-center text-sm font-semibold text-muted-foreground max-sm:hidden`}
        >
          {posicion}
        </td>
      )}
      <CeldaDelNombre cliente={cliente} alEditar={props.alEditar} />
      <td className={`${CELDA} max-sm:col-span-full`}>
        <InsigniaDeVisibilidad visible={cliente.visible} />
      </td>
      <td
        className={`${CELDA} max-sm:col-start-2 max-sm:row-start-1 max-sm:self-center max-sm:justify-self-end`}
      >
        <Interruptor
          activo={cliente.visible}
          alCambiar={(visible) => props.alCambiarVisibilidad(cliente.id, visible)}
          aria-label={`${cliente.nombre} visible en el sitio`}
        />
      </td>
      <CeldaDeAcciones {...props} />
    </tr>
  )
}
