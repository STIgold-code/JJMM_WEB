'use client'

import { GripVertical } from 'lucide-react'
import Link from 'next/link'
import type { ComponentProps } from 'react'

import type { SeccionDelPanel } from '../../dominio/pagina-de-inicio'
import { BotonesDeOrden } from '../comunes/controles-de-orden'
import { IconoDelPanel } from '../iconos/icono-del-panel'
import { Button } from '../ui/button'

interface Props {
  seccion: SeccionDelPanel
  indice: number
  total: number
  // Sin orden (por ejemplo, una sola sección), la fila no lleva asa ni flechas.
  orden: {
    alMover: (desde: number, hacia: number, paso: -1 | 1) => void
    propsDeFila: ComponentProps<'li'>
    propsDeAsa: ComponentProps<'span'>
  } | null
}

function Asa({ propsDeAsa }: { propsDeAsa: ComponentProps<'span'> }) {
  return (
    <span
      title="Arrastra para cambiar el orden"
      className="grid size-7 shrink-0 cursor-grab place-items-center rounded-sm text-muted-foreground hover:bg-muted active:cursor-grabbing max-sm:hidden"
      {...propsDeAsa}
    >
      <GripVertical aria-hidden="true" className="size-4" />
    </span>
  )
}

function Nombre({ seccion }: { seccion: SeccionDelPanel }) {
  return (
    <div className="flex min-w-0 flex-1 basis-56 items-center gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-md bg-accent text-primary">
        <IconoDelPanel nombre={seccion.icono} className="size-4" />
      </span>
      <div className="grid min-w-0 leading-[1.35]">
        <strong className="truncate font-[650]">{seccion.nombre}</strong>
        <span className="truncate text-[0.8125rem] text-muted-foreground">{seccion.detalle}</span>
      </div>
    </div>
  )
}

// «Editar» abre el editor de la sección; las que aún no tienen pantalla quedan deshabilitadas.
function Editar({ seccion }: { seccion: SeccionDelPanel }) {
  if (seccion.editar)
    return (
      <Button asChild variant="outline" size="sm" className="bg-card">
        <Link href={seccion.editar} aria-label={`Editar ${seccion.nombre}`}>
          Editar
        </Link>
      </Button>
    )
  return (
    <span
      aria-disabled="true"
      className="inline-flex h-8 items-center rounded-md border px-3 text-[0.8125rem] font-medium text-muted-foreground opacity-70"
    >
      Próximamente
    </span>
  )
}

// Fila de una sección del inicio (maqueta «Página de inicio»): asa, posición, nombre con lo que
// muestra, flechas, enlace a la lista que muestra y «Editar». En celulares se apila.
export function FilaDeSeccion({ seccion, indice, total, orden }: Props) {
  return (
    <li
      data-fila={seccion.clave}
      className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b bg-card px-4 py-[0.7rem] last:border-b-0 data-arrastrada:opacity-50"
      {...orden?.propsDeFila}
    >
      {orden && <Asa propsDeAsa={orden.propsDeAsa} />}
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
        {indice + 1}
      </span>
      <Nombre seccion={seccion} />
      <div className="flex flex-wrap items-center gap-1 max-sm:w-full max-sm:justify-end">
        {orden && (
          <BotonesDeOrden
            nombre={`«${seccion.nombre}»`}
            indice={indice}
            total={total}
            alMover={orden.alMover}
          />
        )}
        {seccion.irA && (
          <Button asChild variant="ghost" size="sm">
            <Link href={seccion.irA.ruta}>{seccion.irA.texto}</Link>
          </Button>
        )}
        <Editar seccion={seccion} />
      </div>
    </li>
  )
}
