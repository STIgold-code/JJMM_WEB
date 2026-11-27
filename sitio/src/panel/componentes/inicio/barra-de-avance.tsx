'use client'

import { cn } from 'cn'

import { Progress } from '../ui/progress'

interface Props {
  porcentaje: number
  etiqueta: string
  descripcion: string
  completo: boolean
}

// Progress de shadcn/ui (role="progressbar"). El lector de pantalla lee «3 de 10 dígitos», no
// un porcentaje. Es de cliente porque `getValueLabel` es una función.
export function BarraDeAvance({ porcentaje, etiqueta, descripcion, completo }: Props) {
  return (
    <Progress
      value={porcentaje}
      getValueLabel={() => etiqueta}
      aria-label={descripcion}
      className={cn('h-1.5 bg-muted', completo && '[&>[data-slot=progress-indicator]]:bg-listo')}
    />
  )
}
