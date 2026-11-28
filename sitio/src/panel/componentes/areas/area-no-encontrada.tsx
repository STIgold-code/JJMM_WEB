import { SearchX } from 'lucide-react'
import Link from 'next/link'

import { RUTA_DE_AREAS } from '../../dominio/areas-de-servicio'
import { EstadoVacio } from '../comunes/estado-vacio'
import { Button } from '../ui/button'

// El área de la URL no existe: se explica y se vuelve a la lista, en lugar de una página de error.
export function AreaNoEncontrada() {
  return (
    <section
      aria-labelledby="titulo-area-no-encontrada"
      className="rounded-lg border bg-card text-card-foreground shadow-sm"
    >
      <EstadoVacio
        Icono={SearchX}
        nivel="h1"
        idDelTitulo="titulo-area-no-encontrada"
        titulo="No encontramos esa área"
        texto="Revisa el enlace o vuelve a la lista para ver las áreas de la rueda."
      >
        <Button asChild variant="outline" className="mt-2 bg-card">
          <Link href={RUTA_DE_AREAS}>Ver las áreas</Link>
        </Button>
      </EstadoVacio>
    </section>
  )
}
