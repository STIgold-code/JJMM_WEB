'use client'

import { cn } from 'cn'
import { GripVertical, Trash2 } from 'lucide-react'
import type { ComponentProps } from 'react'

import type { PortadaDelFormulario } from '../../dominio/carrusel-de-portadas'
import { detalleDePortada, nombreDePortada } from '../../dominio/vista-previa-de-portada'
import { BotonesDeOrden } from '../comunes/controles-de-orden'
import { MiniaturaDeImagen } from '../comunes/miniatura-de-imagen'
import { Button } from '../ui/button'

interface Props {
  portada: PortadaDelFormulario
  indice: number
  total: number
  abierta: boolean
  conErrores: boolean
  alMover: (desde: number, hacia: number, paso: -1 | 1) => void
  alEditar: () => void
  alQuitar: () => void
  propsDeFila: ComponentProps<'li'>
  propsDeAsa: ComponentProps<'span'>
}

function Estado({
  abierta,
  conErrores,
  detalle,
}: {
  abierta: boolean
  conErrores: boolean
  detalle: string
}) {
  if (conErrores)
    return (
      <span className="truncate text-[0.8125rem] font-semibold text-error">
        Revisa esta portada
      </span>
    )
  return (
    <span className="truncate text-[0.8125rem] text-muted-foreground">
      {detalle}
      {abierta && ' · editando abajo'}
    </span>
  )
}

function Acciones(props: Props & { nombre: string }) {
  const { indice, total, abierta, nombre } = props
  return (
    <div className="flex items-center gap-1 max-sm:w-full max-sm:justify-end">
      <BotonesDeOrden
        nombre={`la portada «${nombre}»`}
        indice={indice}
        total={total}
        alMover={props.alMover}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={total <= 1}
        aria-label={`Quitar la portada «${nombre}»`}
        title={total <= 1 ? 'El carrusel necesita al menos una portada' : undefined}
        onClick={props.alQuitar}
      >
        <Trash2 aria-hidden="true" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-pressed={abierta}
        aria-controls="editor-de-portada"
        aria-label={`Editar la portada «${nombre}»`}
        onClick={props.alEditar}
        className="ml-1 bg-card aria-pressed:border-primary aria-pressed:text-primary"
      >
        {abierta ? 'Editando' : 'Editar'}
      </Button>
    </div>
  )
}

// Fila de una portada (maqueta «Portadas»): asa, posición, miniatura, título y qué lleva, flechas,
// quitar y «Editar». La portada abierta se resalta. En celulares se apila.
export function FilaDePortada(props: Props) {
  const { portada, indice, abierta, conErrores } = props
  const nombre = nombreDePortada(portada, indice)
  return (
    <li
      data-fila={portada.clave}
      className={cn(
        'flex flex-wrap items-center gap-x-3 gap-y-2 border-b px-4 py-[0.7rem] last:border-b-0 data-arrastrada:opacity-50',
        abierta ? 'bg-accent' : 'bg-card',
      )}
      {...props.propsDeFila}
    >
      <span
        title="Arrastra para cambiar el orden"
        className="grid size-7 shrink-0 cursor-grab place-items-center rounded-sm text-muted-foreground hover:bg-muted active:cursor-grabbing max-sm:hidden"
        {...props.propsDeAsa}
      >
        <GripVertical aria-hidden="true" className="size-4" />
      </span>
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
        {indice + 1}
      </span>
      <div className="flex min-w-0 flex-1 basis-56 items-center gap-3">
        <MiniaturaDeImagen
          url={portada.imagen?.url ?? null}
          alt=""
          sizes="56px"
          className="h-10 w-14 shrink-0 rounded-sm border"
        />
        <div className="grid min-w-0 leading-[1.35]">
          <strong className="truncate font-[650]">{nombre}</strong>
          <Estado abierta={abierta} conErrores={conErrores} detalle={detalleDePortada(portada)} />
        </div>
      </div>
      <Acciones {...props} nombre={nombre} />
    </li>
  )
}
