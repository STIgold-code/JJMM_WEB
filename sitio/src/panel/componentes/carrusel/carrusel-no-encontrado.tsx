import { SearchX } from 'lucide-react'
import Link from 'next/link'

import { RUTA_DE_LA_PAGINA_DE_INICIO } from '../../dominio/pagina-de-inicio'
import { EstadoVacio } from '../comunes/estado-vacio'
import { Button } from '../ui/button'

// La página de inicio no tiene ese carrusel (o ninguno): se explica y se vuelve a las secciones,
// en lugar de una página de error.
export function CarruselNoEncontrado() {
  return (
    <section
      aria-labelledby="titulo-carrusel-no-encontrado"
      className="rounded-lg border bg-card text-card-foreground shadow-sm"
    >
      <EstadoVacio
        Icono={SearchX}
        nivel="h1"
        idDelTitulo="titulo-carrusel-no-encontrado"
        titulo="No encontramos el carrusel de portadas"
        texto="La página de inicio no tiene esa sección; puede que alguien la haya quitado. Vuelve a la página de inicio para ver sus secciones."
      >
        <Button asChild variant="outline" className="mt-2 bg-card">
          <Link href={RUTA_DE_LA_PAGINA_DE_INICIO}>Ver la página de inicio</Link>
        </Button>
      </EstadoVacio>
    </section>
  )
}
