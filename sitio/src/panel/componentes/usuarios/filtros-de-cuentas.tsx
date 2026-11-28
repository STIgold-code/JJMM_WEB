'use client'

import type { FiltroDeUsuarios, FiltroDeUsuariosConConteo } from '../../dominio/usuarios'

interface Props {
  filtros: FiltroDeUsuariosConConteo[]
  actual: FiltroDeUsuarios
  alElegir: (filtro: FiltroDeUsuarios) => void
}

// Filtros segmentados con conteo, como los de mensajes. Son botones (`aria-pressed`): la lista
// de cuentas es corta y se filtra en el navegador.
export function FiltrosDeCuentas({ filtros, actual, alElegir }: Props) {
  return (
    <div
      role="group"
      aria-label="Filtrar por rol"
      className="inline-flex flex-wrap gap-[0.2rem] rounded-md bg-muted p-[0.2rem] max-sm:flex max-sm:w-full"
    >
      {filtros.map(({ filtro, texto, cantidad }) => (
        <button
          key={filtro}
          type="button"
          aria-pressed={filtro === actual}
          onClick={() => alElegir(filtro)}
          className="group inline-flex min-h-8 items-center gap-[0.4rem] rounded-sm px-3 py-1 text-[0.8125rem] font-semibold text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-pressed:bg-card aria-pressed:text-foreground aria-pressed:shadow-sm max-sm:flex-1 max-sm:justify-center max-sm:px-2"
        >
          {texto}
          <span className="min-w-[1.3rem] rounded-full bg-foreground/8 px-[0.3rem] text-center text-xs leading-[1.3rem] group-aria-pressed:bg-accent group-aria-pressed:text-accent-foreground">
            {cantidad}
          </span>
        </button>
      ))}
    </div>
  )
}
