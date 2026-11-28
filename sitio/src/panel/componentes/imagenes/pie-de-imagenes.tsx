import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

import { type ConsultaDeImagenes, rutaDeImagenes } from '../../dominio/imagenes'
import type { Paginacion } from '../../dominio/lista-de-mensajes'
import { Button } from '../ui/button'

interface Props {
  paginacion: Paginacion
  consulta: ConsultaDeImagenes
}

function EnlaceDePagina(props: {
  consulta: ConsultaDeImagenes
  pagina: number
  siguiente: boolean
}) {
  const { consulta, pagina, siguiente } = props
  return (
    <Button asChild variant="outline" size="sm" className="bg-card">
      <Link href={rutaDeImagenes({ ...consulta, pagina, imagen: null })}>
        {!siguiente && <ChevronLeft aria-hidden="true" />}
        {siguiente ? 'Siguientes' : 'Anteriores'}
        {siguiente && <ChevronRight aria-hidden="true" />}
      </Link>
    </Button>
  )
}

// Pie de la galería: cuántas se ven de cuántas y, si hay más de una página, los enlaces para
// moverse entre ellas (la lista se pagina en el servidor).
export function PieDeImagenes({ paginacion, consulta }: Props) {
  const { desde, hasta, total, anterior, siguiente } = paginacion
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t px-4 py-3 text-[0.8125rem] text-muted-foreground">
      <span>{total === 0 ? 'Sin resultados' : `Mostrando ${desde}–${hasta} de ${total}`}</span>
      {(anterior || siguiente) && (
        <nav aria-label="Páginas de imágenes" className="flex gap-2">
          {anterior && <EnlaceDePagina consulta={consulta} pagina={anterior} siguiente={false} />}
          {siguiente && <EnlaceDePagina consulta={consulta} pagina={siguiente} siguiente />}
        </nav>
      )}
      <span>Las más recientes primero</span>
    </div>
  )
}
