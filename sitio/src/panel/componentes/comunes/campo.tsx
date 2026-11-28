'use client'

import type { ComponentProps } from 'react'

import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { MensajeDeError } from './mensaje-de-error'

export const CLASE_DE_AYUDA = 'text-[0.8125rem] text-muted-foreground'

type Props = ComponentProps<typeof Input> & {
  id: string
  etiqueta: string
  ayuda?: string
  error?: string
}

// Campo de texto de un formulario del panel: etiqueta, entrada, ayuda opcional y error. La
// ayuda y el error se enlazan con `aria-describedby`.
export function Campo({ id, etiqueta, ayuda, error, className, ...entrada }: Props) {
  const describe = [ayuda && `${id}-ayuda`, error && `${id}-error`].filter(Boolean).join(' ')
  return (
    <div className={className ?? 'grid gap-[0.4rem]'}>
      <Label htmlFor={id} className="font-semibold">
        {etiqueta}
      </Label>
      <Input
        id={id}
        autoComplete="off"
        aria-invalid={error ? true : undefined}
        aria-describedby={describe || undefined}
        className="bg-card"
        {...entrada}
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
