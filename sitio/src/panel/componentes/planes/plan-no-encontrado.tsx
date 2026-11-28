import { SearchX } from 'lucide-react'
import Link from 'next/link'

import { RUTA_DE_PLANES } from '../../dominio/planes'
import { EstadoVacio } from '../comunes/estado-vacio'
import { Button } from '../ui/button'

// El plan de la URL no existe (por ejemplo, alguien lo eliminó): se explica y se vuelve a la
// lista, en lugar de una página de error.
export function PlanNoEncontrado() {
  return (
    <section
      aria-labelledby="titulo-plan-no-encontrado"
      className="rounded-lg border bg-card text-card-foreground shadow-sm"
    >
      <EstadoVacio
        Icono={SearchX}
        nivel="h1"
        idDelTitulo="titulo-plan-no-encontrado"
        titulo="No encontramos ese plan"
        texto="Puede que alguien lo haya eliminado. Vuelve a la lista para ver los planes que existen."
      >
        <Button asChild variant="outline" className="mt-2 bg-card">
          <Link href={RUTA_DE_PLANES}>Ver los planes</Link>
        </Button>
      </EstadoVacio>
    </section>
  )
}
