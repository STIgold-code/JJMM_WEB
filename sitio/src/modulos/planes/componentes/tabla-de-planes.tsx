'use client'

import { type MouseEvent, useState } from 'react'

import { propsDeRevelado } from '@/compartido/componentes/revelado/props-de-revelado'

import type { FilaDePlanes } from '../dominio/matriz-de-planes'
import {
  CuerpoDeLaTabla,
  EncabezadoDeLaTabla,
  PieDeLaTabla,
  type PlanDeLaTabla,
} from './partes-de-la-tabla'
import estilos from './planes.module.css'

interface PropsTablaDePlanes {
  etiqueta: string
  encabezado: string
  textoDelBoton: string
  planes: readonly PlanDeLaTabla[]
  filas: readonly FilaDePlanes[]
}

// Índice del plan de la celda bajo el cursor (la columna 0 es la de características).
function planBajoElCursor(evento: MouseEvent<HTMLTableElement>): number | null {
  if (!(evento.target instanceof Element)) return null
  const celda = evento.target.closest('td, th')
  if (!(celda instanceof HTMLTableCellElement) || celda.cellIndex < 1) return null
  return celda.cellIndex - 1
}

interface PropsSelectorDePlan {
  planes: readonly PlanDeLaTabla[]
  elegido: number
  alElegir: (indice: number) => void
}

// En el celular la tabla muestra un plan a la vez; este grupo de botones elige cuál.
function SelectorDePlan({ planes, elegido, alElegir }: PropsSelectorDePlan) {
  return (
    <div
      className={estilos.selector}
      role="group"
      aria-label="Elige un plan para ver lo que incluye"
    >
      {planes.map((plan, indice) => (
        <button
          key={plan.nombre}
          type="button"
          aria-pressed={indice === elegido}
          onClick={() => alElegir(indice)}
        >
          {plan.nombre}
        </button>
      ))}
    </div>
  )
}

// Isla de cliente de «Planes»: selector de plan en el celular y columna resaltada al pasar
// el cursor, como la v4.
export function TablaDePlanes(props: PropsTablaDePlanes) {
  const { etiqueta, encabezado, textoDelBoton, planes, filas } = props
  const [elegido, setElegido] = useState(0)
  const [bajoElCursor, setBajoElCursor] = useState<number | null>(null)
  const claseDe = (indice: number) =>
    [indice !== elegido && estilos.otroPlan, indice === bajoElCursor && estilos.resaltada]
      .filter(Boolean)
      .join(' ') || undefined

  return (
    <>
      <SelectorDePlan planes={planes} elegido={elegido} alElegir={setElegido} />
      <div
        {...propsDeRevelado({ clase: estilos.marco })}
        tabIndex={0}
        role="region"
        aria-label={etiqueta}
      >
        <table
          className={estilos.tabla}
          onMouseOver={(evento) => setBajoElCursor(planBajoElCursor(evento))}
          onMouseLeave={() => setBajoElCursor(null)}
        >
          <EncabezadoDeLaTabla encabezado={encabezado} planes={planes} claseDe={claseDe} />
          <CuerpoDeLaTabla filas={filas} claseDe={claseDe} />
          <PieDeLaTabla planes={planes} textoDelBoton={textoDelBoton} claseDe={claseDe} />
        </table>
      </div>
    </>
  )
}
