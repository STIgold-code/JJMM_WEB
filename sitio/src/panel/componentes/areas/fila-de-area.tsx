'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'

import {
  type AreaDelPanel,
  estaEnLaRueda,
  rutaDelArea,
  secundarioDeArea,
} from '../../dominio/areas-de-servicio'
import {
  BotonesDeOrden,
  CELDA_DE_LISTADO as CELDA,
  CeldaDeOrden,
  FILA_DE_LISTADO,
} from '../comunes/controles-de-orden'
import { Insignia } from '../comunes/insignia'
import { Button } from '../ui/button'
import { CodigoDeArea } from './codigo-de-area'

interface Props {
  area: AreaDelPanel
  indice: number
  total: number
  alMover: (desde: number, hacia: number, paso: -1 | 1) => void
  propsDeFila: ComponentProps<'tr'>
  propsDeAsa: ComponentProps<'span'>
}

// Código (decorativo: el enlace lo lee), nombre que abre la edición y dato secundario.
function CeldaDelNombre({ area }: { area: AreaDelPanel }) {
  return (
    <td className={`${CELDA} max-sm:col-span-full`}>
      <div className="flex min-w-0 items-center gap-3">
        <CodigoDeArea codigo={area.codigo} />
        <div className="grid min-w-0 leading-[1.35]">
          <Link
            href={rutaDelArea(area.id)}
            className="truncate font-[650] text-foreground hover:text-primary hover:underline"
          >
            <span className="sr-only">{area.codigo}, </span>
            {area.nombre}
          </Link>
          <span className="truncate text-[0.8125rem] text-muted-foreground">
            {secundarioDeArea(area)}
          </span>
        </div>
      </div>
    </td>
  )
}

// Fila del listado de áreas. En celulares se apila (nombre arriba; estado y acciones debajo) y
// la columna del asa se oculta (el orden sigue con «Subir» y «Bajar»).
export function FilaDeArea(props: Props) {
  const { area, indice, total, alMover } = props
  return (
    <tr data-fila={area.id} className={FILA_DE_LISTADO} {...props.propsDeFila}>
      <CeldaDeOrden posicion={indice + 1} propsDeAsa={props.propsDeAsa} />
      <CeldaDelNombre area={area} />
      <td className={`${CELDA} max-sm:col-span-full`}>
        {estaEnLaRueda(area.poligono) ? (
          <Insignia tono="listo" texto="Marcada en la rueda" />
        ) : (
          <Insignia tono="pendiente" texto="Solo en las pestañas" />
        )}
      </td>
      <td className={`${CELDA} max-sm:col-span-full`}>
        <div className="flex items-center justify-end gap-1 max-sm:justify-start">
          <BotonesDeOrden nombre={area.nombre} indice={indice} total={total} alMover={alMover} />
          <Button asChild variant="outline" size="sm" className="ml-1 bg-card">
            <Link href={rutaDelArea(area.id)} aria-label={`Editar ${area.nombre}`}>
              Editar
            </Link>
          </Button>
        </div>
      </td>
    </tr>
  )
}
