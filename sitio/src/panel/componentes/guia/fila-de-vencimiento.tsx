'use client'

import {
  NOMBRES_DE_PERIODICIDAD,
  sinFechaPublicada,
  type VencimientoDelPanel,
} from '../../dominio/vencimientos-del-panel'
import { CELDA_DE_LISTADO as CELDA } from '../comunes/controles-de-orden'

const INSIGNIA =
  'inline-flex items-center gap-[0.35rem] rounded-full border px-[0.55rem] py-[0.1rem] text-xs leading-normal font-semibold whitespace-nowrap'

// Fila de vencimientos como la maqueta: obligación (abre el panel lateral) con cuándo vence,
// periodicidad y, si «Cuándo vence» es el texto de «sin fecha», «Fecha por confirmar» (pendiente).
// En celulares se apila: obligación y periodicidad arriba, el estado debajo.
export function FilaDeVencimiento({
  vencimiento,
  alEditar,
}: {
  vencimiento: VencimientoDelPanel
  alEditar: (id: number) => void
}) {
  return (
    <tr className="border-b transition-colors last:border-b-0 hover:bg-[#f8fafd] max-sm:grid max-sm:grid-cols-[minmax(0,1fr)_auto] max-sm:gap-x-3 max-sm:gap-y-[0.35rem] max-sm:px-4 max-sm:py-[0.85rem]">
      <td className={CELDA}>
        <div className="grid min-w-0 leading-[1.35]">
          <button
            type="button"
            onClick={() => alEditar(vencimiento.id)}
            className="truncate text-left font-[650] text-foreground hover:text-primary hover:underline"
          >
            {vencimiento.obligacion}
          </button>
          <span className="text-[0.8125rem] text-muted-foreground">{vencimiento.cuandoVence}</span>
        </div>
      </td>
      <td className={`${CELDA} max-sm:self-start`}>
        <span className={`${INSIGNIA} border-border bg-muted text-muted-foreground`}>
          {NOMBRES_DE_PERIODICIDAD[vencimiento.periodicidad]}
        </span>
      </td>
      <td className={`${CELDA} max-sm:col-span-full max-sm:empty:hidden`}>
        {sinFechaPublicada(vencimiento.cuandoVence) && (
          <span
            className={`${INSIGNIA} border-pendiente-borde bg-pendiente-fondo text-pendiente before:size-[0.4rem] before:rounded-full before:bg-current before:content-['']`}
          >
            Fecha por confirmar
          </span>
        )}
      </td>
    </tr>
  )
}
