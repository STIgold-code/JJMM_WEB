import { cn } from 'cn'

// Código del área (P1 a P9) en la tipografía de la marca, como en la rueda. Decorativo: el texto
// que lo acompaña ya lo nombra.
export function CodigoDeArea({ codigo, enTitulo = false }: { codigo: string; enTitulo?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-grid flex-none place-items-center rounded-md bg-accent px-[0.4rem] font-marca font-semibold tracking-[0.02em] text-primary',
        enTitulo
          ? 'mr-2 px-[0.55rem] py-[0.05rem] align-[0.15rem] text-2xl'
          : 'h-9 min-w-9 text-base',
      )}
    >
      {codigo}
    </span>
  )
}
