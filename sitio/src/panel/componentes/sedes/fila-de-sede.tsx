'use client'

import { MapPin } from 'lucide-react'
import Link from 'next/link'
import type { ComponentProps } from 'react'

import { rutaDeLaSede, secundarioDeSede, type SedeDelPanel } from '../../dominio/sedes'
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
  sede: SedeDelPanel
  indice: number
  total: number
  alCambiarVisibilidad: (id: number, visible: boolean) => void
  alMover: (desde: number, hacia: number, paso: -1 | 1) => void
  propsDeFila: ComponentProps<'tr'>
  propsDeAsa: ComponentProps<'span'>
}

function CeldaDelNombre({ sede }: { sede: SedeDelPanel }) {
  return (
    <td className={`${CELDA} max-sm:col-start-1`}>
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-md bg-accent text-primary max-sm:hidden">
          <MapPin aria-hidden="true" className="size-4" />
        </span>
        <div className="grid min-w-0 leading-[1.35]">
          <Link
            href={rutaDeLaSede(sede.id)}
            className="truncate font-[650] text-foreground hover:text-primary hover:underline"
          >
            {sede.nombre}
          </Link>
          <span className="truncate text-[0.8125rem] text-muted-foreground">
            {secundarioDeSede(sede)}
          </span>
        </div>
      </div>
    </td>
  )
}

// «951 965 242 (WhatsApp) · 952 249 102», como la maqueta.
function CeldaDeCelulares({ sede }: { sede: SedeDelPanel }) {
  return (
    <td className={`${CELDA} text-[0.8125rem] max-sm:col-span-full`}>
      {sede.celulares.length === 0 ? (
        <span className="font-semibold text-error">Sin celulares</span>
      ) : (
        sede.celulares.map(({ numero, tieneWhatsApp }, indice) => (
          <span key={indice} className="whitespace-nowrap">
            {indice > 0 && ' · '}
            {numero}
            {tieneWhatsApp && <span className="text-muted-foreground"> (WhatsApp)</span>}
          </span>
        ))
      )}
    </td>
  )
}

// Fila del listado de sedes. En celulares se apila: nombre e interruptor arriba; celulares,
// estado y acciones debajo. La columna del asa se oculta (el orden sigue con «Subir» y «Bajar»).
export function FilaDeSede(props: Props) {
  const { sede, indice, total, alCambiarVisibilidad, alMover } = props
  return (
    <tr data-fila={sede.id} className={FILA_DE_LISTADO} {...props.propsDeFila}>
      <CeldaDeOrden posicion={indice + 1} propsDeAsa={props.propsDeAsa} />
      <CeldaDelNombre sede={sede} />
      <CeldaDeCelulares sede={sede} />
      <td className={`${CELDA} max-sm:col-span-full`}>
        <InsigniaDeVisibilidad visible={sede.visible} oculto="Oculta" />
      </td>
      <td
        className={`${CELDA} max-sm:col-start-2 max-sm:row-start-1 max-sm:self-center max-sm:justify-self-end`}
      >
        <Interruptor
          activo={sede.visible}
          alCambiar={(visible) => alCambiarVisibilidad(sede.id, visible)}
          aria-label={`${sede.nombre} visible en el sitio`}
        />
      </td>
      <td className={`${CELDA} max-sm:col-span-full`}>
        <div className="flex items-center justify-end gap-1 max-sm:justify-start">
          <BotonesDeOrden nombre={sede.nombre} indice={indice} total={total} alMover={alMover} />
          <Button asChild variant="outline" size="sm" className="ml-1 bg-card">
            <Link href={rutaDeLaSede(sede.id)} aria-label={`Editar ${sede.nombre}`}>
              Editar
            </Link>
          </Button>
        </div>
      </td>
    </tr>
  )
}
