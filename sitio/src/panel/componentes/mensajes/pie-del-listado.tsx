import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

import type { Paginacion } from '../../dominio/lista-de-mensajes'
import { type ConsultaDeMensajes, rutaDeMensajes } from '../../dominio/mensajes'
import { Button } from '../ui/button'

interface Props {
  paginacion: Paginacion
  consulta: ConsultaDeMensajes
}

function EnlaceDePagina({
  consulta,
  pagina,
  siguiente,
}: {
  consulta: ConsultaDeMensajes
  pagina: number
  siguiente: boolean
}) {
  return (
    <Button asChild variant="outline" size="sm" className="bg-card">
      <Link href={rutaDeMensajes({ ...consulta, pagina, mensaje: null })}>
        {!siguiente && <ChevronLeft aria-hidden="true" />}
        {siguiente ? 'Siguientes' : 'Anteriores'}
        {siguiente && <ChevronRight aria-hidden="true" />}
      </Link>
    </Button>
  )
}

// Pie del listado: cuántos se ven de cuántos, el orden y, si hay más de una página, los enlaces
// para moverse entre ellas.
export function PieDelListado({ paginacion, consulta }: Props) {
  const { desde, hasta, total, anterior, siguiente } = paginacion
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t px-4 py-3 text-[0.8125rem] text-muted-foreground">
      <span>{total === 0 ? 'Sin resultados' : `Mostrando ${desde}–${hasta} de ${total}`}</span>
      {(anterior || siguiente) && (
        <nav aria-label="Páginas de mensajes" className="flex gap-2">
          {anterior && <EnlaceDePagina consulta={consulta} pagina={anterior} siguiente={false} />}
          {siguiente && <EnlaceDePagina consulta={consulta} pagina={siguiente} siguiente />}
        </nav>
      )}
      <span>Los más recientes primero</span>
    </div>
  )
}
