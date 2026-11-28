'use client'

import { ArrowDown, ArrowUp, GripVertical } from 'lucide-react'
import Link from 'next/link'
import type { ComponentProps } from 'react'

import type { PlanDelListado } from '../../aplicacion/consultar-planes'
import { resumenDeInclusiones, rutaDelPlan } from '../../dominio/planes'
import { Button } from '../ui/button'
import { InsigniaDeVisibilidad } from './insignia-de-visibilidad'
import { Interruptor } from './interruptor'

const CELDA = 'px-4 py-[0.7rem] align-middle max-sm:p-0'

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

function BotonesDeOrden({
  plan,
  indice,
  total,
  alMover,
}: Omit<Props, 'propsDeFila' | 'propsDeAsa' | 'caracteristicas' | 'alCambiarVisibilidad'>) {
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        data-mover={-1}
        disabled={indice === 0}
        aria-label={`Subir ${plan.nombre}`}
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
        aria-label={`Bajar ${plan.nombre}`}
        onClick={() => alMover(indice, indice + 1, 1)}
      >
        <ArrowDown aria-hidden="true" />
      </Button>
    </>
  )
}

// Asa para arrastrar (solo ratón) y posición. En celulares no se muestra.
function CeldaDeOrden({
  posicion,
  propsDeAsa,
}: {
  posicion: number
  propsDeAsa: Props['propsDeAsa']
}) {
  return (
    <td className={`${CELDA} w-px whitespace-nowrap max-sm:hidden`}>
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
  const { plan, indice, caracteristicas, alCambiarVisibilidad, propsDeFila, propsDeAsa } = props
  return (
    <tr
      data-plan={plan.id}
      className="border-b transition-colors last:border-b-0 hover:bg-[#f8fafd] data-arrastrada:opacity-50 max-sm:grid max-sm:grid-cols-[minmax(0,1fr)_auto] max-sm:gap-x-3 max-sm:gap-y-[0.35rem] max-sm:px-4 max-sm:py-[0.85rem]"
      {...propsDeFila}
    >
      <CeldaDeOrden posicion={indice + 1} propsDeAsa={propsDeAsa} />
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
          <BotonesDeOrden {...props} />
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
