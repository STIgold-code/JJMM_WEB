import { cn } from 'cn'
import {
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  House,
  Image,
  Inbox,
  Layers,
  List,
  ListChecks,
  type LucideIcon,
  MapPin,
  Newspaper,
  PanelsTopLeft,
  Settings,
  Star,
  Users,
} from 'lucide-react'

import type { NombreDeIcono } from '../../dominio/iconos'

// Trazos de Lucide, los mismos que usó la maqueta aprobada.
const ICONOS: Readonly<Record<NombreDeIcono, LucideIcon>> = {
  casa: House,
  bandeja: Inbox,
  capas: Layers,
  maletin: Briefcase,
  diseno: PanelsTopLeft,
  pin: MapPin,
  edificio: Building2,
  libro: BookOpen,
  periodico: Newspaper,
  imagen: Image,
  usuarios: Users,
  ajustes: Settings,
  lista: List,
  calendario: Calendar,
  tareas: ListChecks,
  estrella: Star,
}

interface Props {
  nombre: NombreDeIcono
  className?: string
}

// Decorativo: el texto que lo acompaña dice lo mismo.
export function IconoDelPanel({ nombre, className }: Props) {
  const Icono = ICONOS[nombre]
  return (
    <Icono
      aria-hidden="true"
      focusable="false"
      strokeWidth={1.75}
      className={cn('size-[1.125rem] shrink-0', className)}
    />
  )
}
