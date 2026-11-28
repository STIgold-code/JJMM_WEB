import { SearchX } from 'lucide-react'
import Link from 'next/link'

import { RUTA_DE_PLANES } from '../../dominio/planes'
import { Button } from '../ui/button'

// El plan de la URL no existe (por ejemplo, alguien lo eliminó): se explica y se vuelve a la
// lista, en lugar de una página de error.
export function PlanNoEncontrado() {
  return (
    <section
      aria-labelledby="titulo-plan-no-encontrado"
      className="rounded-lg border bg-card text-card-foreground shadow-sm"
    >
      <div className="mx-auto grid max-w-[30rem] justify-items-center gap-[0.6rem] px-6 py-12 text-center">
        <span className="mb-1 grid size-12 place-items-center rounded-full bg-accent text-primary">
          <SearchX aria-hidden="true" strokeWidth={1.75} className="size-[1.375rem]" />
        </span>
        <h1 id="titulo-plan-no-encontrado" className="text-[0.9375rem] font-[650]">
          No encontramos ese plan
        </h1>
        <p className="text-muted-foreground">
          Puede que alguien lo haya eliminado. Vuelve a la lista para ver los planes que existen.
        </p>
        <Button asChild variant="outline" className="mt-2 bg-card">
          <Link href={RUTA_DE_PLANES}>Ver los planes</Link>
        </Button>
      </div>
    </section>
  )
}
