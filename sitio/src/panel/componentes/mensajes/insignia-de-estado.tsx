import { cn } from 'cn'

import type { EstadoDeMensaje } from '../../dominio/mensajes'

// Estado con significado fijo (S2): «Nuevo» es pendiente (ámbar) y «Atendido», listo (verde).
const ESTILOS: Readonly<Record<EstadoDeMensaje, { texto: string; clases: string }>> = {
  nuevo: { texto: 'Nuevo', clases: 'border-pendiente-borde bg-pendiente-fondo text-pendiente' },
  atendido: { texto: 'Atendido', clases: 'border-listo-borde bg-listo-fondo text-listo' },
}

export function InsigniaDeEstado({ estado }: { estado: EstadoDeMensaje }) {
  const { texto, clases } = ESTILOS[estado]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[0.35rem] rounded-full border px-[0.55rem] py-[0.1rem] text-xs leading-normal font-semibold whitespace-nowrap',
        "before:size-[0.4rem] before:rounded-full before:bg-current before:content-['']",
        clases,
      )}
    >
      {texto}
    </span>
  )
}
