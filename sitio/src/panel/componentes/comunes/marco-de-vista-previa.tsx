import { Eye } from 'lucide-react'
import type { ReactNode } from 'react'

interface Props {
  // «Vista previa: «Nuestros planes» en el sitio».
  titulo: string
  children: ReactNode
}

// Marco de las vistas previas del sitio (planes, áreas, valores): etiqueta con el ojo y el fondo
// blanco del sitio, fijo al costado en pantallas amplias y con desplazamiento propio.
export function MarcoDeVistaPrevia({ titulo, children }: Props) {
  return (
    <aside
      aria-labelledby="titulo-vista"
      className="overflow-hidden rounded-lg border bg-card amplio:sticky amplio:top-[calc(var(--alto-barra)+1.25rem)]"
    >
      <div className="flex items-center justify-between gap-2 border-b bg-muted px-[0.9rem] py-[0.55rem] text-[0.8125rem] font-semibold text-muted-foreground">
        <span id="titulo-vista">{titulo}</span>
        <Eye aria-hidden="true" className="size-4 shrink-0" />
      </div>
      <div className="overflow-x-auto bg-white px-4 py-5 text-xs text-[#1f2d3d] amplio:max-h-[calc(100vh-var(--alto-barra)-5rem)] amplio:overflow-y-auto">
        {children}
      </div>
    </aside>
  )
}
