import { cn } from 'cn'

// «Visible» es listo (verde); el oculto, neutro: no es un error ni algo pendiente. `oculto` es el
// texto del estado apagado, en el género de lo que se muestra («Oculto», «Oculta»).
export function InsigniaDeVisibilidad({
  visible,
  oculto = 'Oculto',
}: {
  visible: boolean
  oculto?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[0.35rem] rounded-full border px-[0.55rem] py-[0.1rem] text-xs leading-normal font-semibold whitespace-nowrap',
        "before:size-[0.4rem] before:rounded-full before:bg-current before:content-['']",
        visible
          ? 'border-listo-borde bg-listo-fondo text-listo'
          : 'border-border bg-muted text-muted-foreground',
      )}
    >
      {visible ? 'Visible' : oculto}
    </span>
  )
}
