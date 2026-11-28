'use client'

import { cn } from 'cn'
import type { ComponentProps } from 'react'

import { Label } from '../ui/label'
import { CLASE_DE_AYUDA } from './campo'
import { MensajeDeError } from './mensaje-de-error'

type Props = ComponentProps<'textarea'> & {
  id: string
  etiqueta: string
  ayuda?: string
  error?: string
}

// Mismo dibujo que `Input` de shadcn/ui, para varias líneas.
const CLASE_DEL_AREA =
  'min-h-16 w-full min-w-0 rounded-md border border-input bg-card px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm'

// Campo de varias líneas de un formulario del panel: etiqueta, área, ayuda opcional y error,
// enlazados con `aria-describedby`, como `Campo`.
export function AreaDeTexto({ id, etiqueta, ayuda, error, className, ...area }: Props) {
  const describe = [ayuda && `${id}-ayuda`, error && `${id}-error`].filter(Boolean).join(' ')
  return (
    <div className="grid gap-[0.4rem]">
      <Label htmlFor={id} className="font-semibold">
        {etiqueta}
      </Label>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describe || undefined}
        className={cn(CLASE_DEL_AREA, className)}
        {...area}
      />
      {ayuda && (
        <p id={`${id}-ayuda`} className={CLASE_DE_AYUDA}>
          {ayuda}
        </p>
      )}
      {error && <MensajeDeError id={`${id}-error`} texto={error} />}
    </div>
  )
}
