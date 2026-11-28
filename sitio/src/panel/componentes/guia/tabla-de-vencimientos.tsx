'use client'

import type { VencimientoDelPanel } from '../../dominio/vencimientos-del-panel'
import { FilaDeVencimiento } from './fila-de-vencimiento'

const ENCABEZADO = 'px-4 py-[0.6rem] font-semibold'

interface Props {
  vencimientos: VencimientoDelPanel[]
  // Qué explica la fila vacía (según el filtro o la búsqueda).
  textoVacio: string
  alEditar: (id: number) => void
}

// Tabla de vencimientos de la maqueta: obligación y cuándo vence, periodicidad y estado. En
// celulares se apila y el encabezado se oculta.
export function TablaDeVencimientos({ vencimientos, textoVacio, alEditar }: Props) {
  return (
    <table className="w-full border-collapse text-sm max-sm:block">
      <thead className="max-sm:hidden">
        <tr className="border-b text-left text-[0.8125rem] whitespace-nowrap text-muted-foreground">
          <th scope="col" className={ENCABEZADO}>
            Obligación y cuándo vence
          </th>
          <th scope="col" className={ENCABEZADO}>
            Periodicidad
          </th>
          <th scope="col" className={ENCABEZADO}>
            <span className="sr-only">Estado</span>
          </th>
        </tr>
      </thead>
      <tbody className="max-sm:block">
        {vencimientos.map((vencimiento) => (
          <FilaDeVencimiento key={vencimiento.id} vencimiento={vencimiento} alEditar={alEditar} />
        ))}
        {vencimientos.length === 0 && (
          <tr className="max-sm:block">
            <td colSpan={3} className="px-4 py-10 text-center text-muted-foreground max-sm:block">
              {textoVacio}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
