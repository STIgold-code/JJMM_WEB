'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'

import type { PlanDelListado } from '../../aplicacion/consultar-planes'
import { resumenDeInclusiones, rutaDelPlan } from '../../dominio/planes'
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
  plan: PlanDelListado
  indice: number
  total: number
  caracteristicas: number
  alCambiarVisibilidad: (id: number, visible: boolean) => void
  alMover: (desde: number, hacia: number, paso: -1 | 1) => void
  propsDeFila: ComponentProps<'tr'>
  propsDeAsa: ComponentProps<'span'>
}

function CeldaDelNombre({ plan, caracteristicas }: Pick<Props, 'plan' | 'caracteristicas'>) {
  return (
    <td className={`${CELDA} max-sm:col-start-1`}>
      <div className="grid min-w-0 leading-[1.35]">
        <Link
          href={rutaDelPlan(plan.id)}
          className="truncate font-[650] text-foreground hover:text-primary hover:underline"
        >
          {plan.nombre}
        </Link>
        <span className="truncate text-[0.8125rem] text-muted-foreground">
          {resumenDeInclusiones(plan.incluidas, caracteristicas)}
        </span>
      </div>
    </td>
  )
}

// Fila del listado de planes. En celulares se apila: nombre e interruptor arriba, estado y
// acciones debajo; la columna del asa se oculta (el orden sigue con «Subir» y «Bajar»).
export function FilaDePlan(props: Props) {
  const { plan, indice, total, caracteristicas, alCambiarVisibilidad, alMover } = props
  return (
    <tr data-fila={plan.id} className={FILA_DE_LISTADO} {...props.propsDeFila}>
      <CeldaDeOrden posicion={indice + 1} propsDeAsa={props.propsDeAsa} />
      <CeldaDelNombre plan={plan} caracteristicas={caracteristicas} />
      <td className={`${CELDA} max-sm:col-span-full`}>
        <InsigniaDeVisibilidad visible={plan.visible} />
      </td>
      <td
        className={`${CELDA} max-sm:col-start-2 max-sm:row-start-1 max-sm:self-center max-sm:justify-self-end`}
      >
        <Interruptor
          activo={plan.visible}
          alCambiar={(visible) => alCambiarVisibilidad(plan.id, visible)}
          aria-label={`${plan.nombre} visible en el sitio`}
        />
      </td>
      <td className={`${CELDA} max-sm:col-span-full`}>
        <div className="flex items-center justify-end gap-1 max-sm:justify-start">
          <BotonesDeOrden nombre={plan.nombre} indice={indice} total={total} alMover={alMover} />
          <Button asChild variant="outline" size="sm" className="ml-1 bg-card">
            <Link href={rutaDelPlan(plan.id)} aria-label={`Editar ${plan.nombre}`}>
              Editar
            </Link>
          </Button>
        </div>
      </td>
    </tr>
  )
}
