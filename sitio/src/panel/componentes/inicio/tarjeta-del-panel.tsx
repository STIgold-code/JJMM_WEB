import { cn } from 'cn'
import type { ReactNode } from 'react'

// Card de shadcn/ui con la cabecera de la maqueta: título, bajada opcional y acción a la derecha.
interface Props {
  id?: string
  idDelTitulo: string
  titulo: string
  bajada?: string
  accion?: ReactNode
  className?: string
  children: ReactNode
}

export function TarjetaDelPanel({
  id,
  idDelTitulo,
  titulo,
  bajada,
  accion,
  className,
  children,
}: Props) {
  return (
    <section
      id={id}
      aria-labelledby={idDelTitulo}
      className={cn(
        'scroll-mt-20 rounded-lg border bg-card text-card-foreground shadow-sm',
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b px-5 py-4">
        <div>
          <h2 id={idDelTitulo} className="text-[1.0625rem] leading-[1.35] font-[650]">
            {titulo}
          </h2>
          {bajada && <p className="text-sm text-muted-foreground">{bajada}</p>}
        </div>
        {accion}
      </div>
      {children}
    </section>
  )
}
