import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface Props {
  Icono: LucideIcon
  titulo: string
  texto: string
  // Nivel del título: `h1` cuando el estado vacío es toda la página (por ejemplo, «no existe»).
  nivel?: 'h1' | 'h2'
  idDelTitulo?: string
  children?: ReactNode
}

// Estado vacío de un listado o de una página: ícono, título y qué va a aparecer ahí.
export function EstadoVacio({ Icono, titulo, texto, nivel = 'h2', idDelTitulo, children }: Props) {
  const Titulo = nivel
  return (
    <div className="mx-auto grid max-w-[30rem] justify-items-center gap-[0.6rem] px-6 py-12 text-center">
      <span className="mb-1 grid size-12 place-items-center rounded-full bg-accent text-primary">
        <Icono aria-hidden="true" strokeWidth={1.75} className="size-[1.375rem]" />
      </span>
      <Titulo id={idDelTitulo} className="text-[0.9375rem] font-[650]">
        {titulo}
      </Titulo>
      <p className="text-muted-foreground">{texto}</p>
      {children}
    </div>
  )
}
