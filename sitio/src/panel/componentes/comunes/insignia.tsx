import { cn } from 'cn'

// Colores de estado con significado fijo (S2): listo (verde) y pendiente (ámbar).
const TONOS = {
  listo: 'border-listo-borde bg-listo-fondo text-listo',
  pendiente: 'border-pendiente-borde bg-pendiente-fondo text-pendiente',
} as const

export type TonoDeInsignia = keyof typeof TONOS

// Insignia de estado de la maqueta, por ejemplo «Marcada en la rueda» o «Nombre por confirmar».
export function Insignia({ tono, texto }: { tono: TonoDeInsignia; texto: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[0.35rem] rounded-full border px-[0.55rem] py-[0.1rem] text-xs leading-normal font-semibold whitespace-nowrap',
        "before:size-[0.4rem] before:rounded-full before:bg-current before:content-['']",
        TONOS[tono],
      )}
    >
      {texto}
    </span>
  )
}
