import { cn } from 'cn'
import Link from 'next/link'

import type { FiltroConConteo } from '../../dominio/lista-de-mensajes'
import { type FiltroDeMensajes, rutaDeMensajes } from '../../dominio/mensajes'

interface Props {
  filtros: FiltroConConteo[]
  actual: FiltroDeMensajes
  busqueda: string
}

// Filtros segmentados con conteo. Son enlaces: el filtro vive en la URL y conserva la búsqueda.
export function FiltrosDeMensajes({ filtros, actual, busqueda }: Props) {
  return (
    <nav aria-label="Filtrar por estado" className="max-sm:w-full">
      <ul className="inline-flex flex-wrap gap-[0.2rem] rounded-md bg-muted p-[0.2rem] max-sm:flex max-sm:w-full">
        {filtros.map(({ filtro, texto, cantidad }) => (
          <li key={filtro} className="max-sm:flex-1">
            <Link
              href={rutaDeMensajes({ filtro, busqueda })}
              scroll={false}
              aria-current={filtro === actual ? 'page' : undefined}
              className={cn(
                'group inline-flex min-h-8 items-center gap-[0.4rem] rounded-sm px-3 py-1 text-[0.8125rem] font-semibold text-muted-foreground transition-colors hover:text-foreground max-sm:w-full max-sm:justify-center',
                'aria-[current=page]:bg-card aria-[current=page]:text-foreground aria-[current=page]:shadow-sm',
              )}
            >
              {texto}
              <span className="min-w-[1.3rem] rounded-full bg-foreground/8 px-[0.3rem] text-center text-xs leading-[1.3rem] group-aria-[current=page]:bg-accent group-aria-[current=page]:text-accent-foreground">
                {cantidad}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
