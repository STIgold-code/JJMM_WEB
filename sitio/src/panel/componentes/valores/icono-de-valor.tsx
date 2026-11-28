import { cn } from 'cn'
import { Lightbulb, Lock, type LucideIcon, Scale, ThumbsUp, Trophy, Users } from 'lucide-react'

import type { IconoDeValor as Nombre } from '../../dominio/valores'

// Los mismos trazos que el sprite del sitio y la maqueta (Lucide).
const ICONOS: Readonly<Record<Nombre, LucideIcon>> = {
  pulgar: ThumbsUp,
  trofeo: Trophy,
  foco: Lightbulb,
  candado: Lock,
  balanza: Scale,
  equipo: Users,
}

// Decorativo: el texto que lo acompaña nombra el valor o el ícono.
export function IconoDeValor({ icono, className }: { icono: Nombre; className?: string }) {
  const Icono = ICONOS[icono]
  return (
    <Icono
      aria-hidden="true"
      focusable="false"
      strokeWidth={1.75}
      className={cn('size-[1.125rem] shrink-0', className)}
    />
  )
}
