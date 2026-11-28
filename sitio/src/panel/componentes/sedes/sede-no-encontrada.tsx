import { SearchX } from 'lucide-react'
import Link from 'next/link'

import { RUTA_DE_SEDES } from '../../dominio/sedes'
import { EstadoVacio } from '../comunes/estado-vacio'
import { Button } from '../ui/button'

// La sede de la URL no existe (por ejemplo, alguien la eliminó): se explica y se vuelve a la
// lista, en lugar de una página de error.
export function SedeNoEncontrada() {
  return (
    <section
      aria-labelledby="titulo-sede-no-encontrada"
      className="rounded-lg border bg-card text-card-foreground shadow-sm"
    >
      <EstadoVacio
        Icono={SearchX}
        nivel="h1"
        idDelTitulo="titulo-sede-no-encontrada"
        titulo="No encontramos esa sede"
        texto="Puede que alguien la haya eliminado. Vuelve a la lista para ver las sedes que existen."
      >
        <Button asChild variant="outline" className="mt-2 bg-card">
          <Link href={RUTA_DE_SEDES}>Ver las sedes</Link>
        </Button>
      </EstadoVacio>
    </section>
  )
}
