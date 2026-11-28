'use client'

import type { FiltroDeUsuarios, FiltroDeUsuariosConConteo } from '../../dominio/usuarios'
import { FiltrosSegmentados } from '../comunes/filtros-segmentados'

interface Props {
  filtros: FiltroDeUsuariosConConteo[]
  actual: FiltroDeUsuarios
  alElegir: (filtro: FiltroDeUsuarios) => void
}

// Filtros segmentados con conteo, como los de mensajes. La lista de cuentas es corta y se filtra
// en el navegador.
export function FiltrosDeCuentas({ filtros, actual, alElegir }: Props) {
  return (
    <FiltrosSegmentados
      aria-label="Filtrar por rol"
      opciones={filtros.map(({ filtro, texto, cantidad }) => ({ valor: filtro, texto, cantidad }))}
      actual={actual}
      alElegir={alElegir}
    />
  )
}
