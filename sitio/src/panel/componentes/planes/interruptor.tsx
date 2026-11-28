import { cn } from 'cn'
import type { ComponentProps } from 'react'

type Props = Omit<ComponentProps<'button'>, 'onChange' | 'role' | 'type'> & {
  activo: boolean
  alCambiar: (activo: boolean) => void
}

// Interruptor (switch) de la maqueta: un botón con `role="switch"` y `aria-checked`. El nombre
// accesible llega por `aria-label` o `aria-labelledby`. El `::before` agranda el área táctil sin
// cambiar el dibujo.
export function Interruptor({ activo, alCambiar, className, ...boton }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={activo}
      onClick={() => alCambiar(!activo)}
      className={cn(
        'relative inline-flex h-5 w-9 flex-none cursor-pointer items-center rounded-full bg-input transition-colors duration-150 ease-salida',
        "before:absolute before:-inset-x-1.5 before:-inset-y-2.5 before:content-['']",
        'after:absolute after:left-0.5 after:size-4 after:rounded-full after:bg-white after:shadow-[0_1px_2px_rgb(19_35_58/0.3)] after:transition-transform after:duration-150 after:ease-salida',
        'aria-checked:bg-primary aria-checked:after:translate-x-4',
        'focus-visible:rounded-full disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...boton}
    />
  )
}
