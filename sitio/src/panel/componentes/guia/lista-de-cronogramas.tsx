'use client'

import {
  type CronogramaDelPanel,
  digitosQueFaltan,
  secundarioDeCronograma,
} from '../../dominio/cronogramas-del-panel'
import { CELDA_DE_LISTADO as CELDA } from '../comunes/controles-de-orden'
import { Button } from '../ui/button'

const INSIGNIA =
  "inline-flex items-center gap-[0.35rem] rounded-full border px-[0.55rem] py-[0.1rem] text-xs leading-normal font-semibold whitespace-nowrap before:size-[0.4rem] before:rounded-full before:bg-current before:content-['']"

// «Completo» (listo) o los dígitos que faltan (pendiente): la guía solo muestra los completos.
function Estado({ fechas }: Pick<CronogramaDelPanel, 'fechas'>) {
  const faltan = digitosQueFaltan(fechas)
  if (faltan.length === 0)
    return (
      <span className={`${INSIGNIA} border-listo-borde bg-listo-fondo text-listo`}>Completo</span>
    )
  return (
    <span className={`${INSIGNIA} border-pendiente-borde bg-pendiente-fondo text-pendiente`}>
      Faltan los dígitos {faltan.join(', ')}
    </span>
  )
}

interface PropsDeFila {
  cronograma: CronogramaDelPanel
  alEditar: (id: number) => void
}

// El periodo (abre el panel lateral) y desde cuándo hasta cuándo vence.
function CeldaDelPeriodo({ cronograma, alEditar }: PropsDeFila) {
  return (
    <td className={CELDA}>
      <div className="grid min-w-0 leading-[1.35]">
        <button
          type="button"
          onClick={() => alEditar(cronograma.id)}
          className="truncate text-left font-[650] text-foreground hover:text-primary hover:underline"
        >
          {cronograma.periodo}
        </button>
        <span className="text-[0.8125rem] text-muted-foreground">
          {secundarioDeCronograma(cronograma)}
        </span>
      </div>
    </td>
  )
}

function Fila({
  cronograma,
  alEditar,
}: {
  cronograma: CronogramaDelPanel
  alEditar: (id: number) => void
}) {
  return (
    <tr className="border-b transition-colors last:border-b-0 hover:bg-[#f8fafd] max-sm:grid max-sm:grid-cols-[minmax(0,1fr)_auto] max-sm:gap-x-3 max-sm:gap-y-[0.35rem] max-sm:px-4 max-sm:py-[0.85rem]">
      <CeldaDelPeriodo cronograma={cronograma} alEditar={alEditar} />
      <td className={`${CELDA} max-sm:col-span-full`}>
        <Estado fechas={cronograma.fechas} />
      </td>
      <td
        className={`${CELDA} text-right max-sm:col-start-2 max-sm:row-start-1 max-sm:self-center`}
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="bg-card"
          aria-label={`Editar el cronograma de ${cronograma.periodo}`}
          onClick={() => alEditar(cronograma.id)}
        >
          Editar
        </Button>
      </td>
    </tr>
  )
}

// Periodos cargados, del más reciente al más antiguo.
export function ListaDeCronogramas({
  cronogramas,
  alEditar,
}: {
  cronogramas: CronogramaDelPanel[]
  alEditar: (id: number) => void
}) {
  return (
    <table className="w-full border-collapse text-sm max-sm:block">
      <thead className="max-sm:hidden">
        <tr className="border-b text-left text-[0.8125rem] whitespace-nowrap text-muted-foreground">
          <th scope="col" className="px-4 py-[0.6rem] font-semibold">
            Periodo y fechas
          </th>
          <th scope="col" className="px-4 py-[0.6rem] font-semibold">
            Estado
          </th>
          <th scope="col" className="px-4 py-[0.6rem] font-semibold">
            <span className="sr-only">Acciones</span>
          </th>
        </tr>
      </thead>
      <tbody className="max-sm:block">
        {cronogramas.map((cronograma) => (
          <Fila key={cronograma.id} cronograma={cronograma} alEditar={alEditar} />
        ))}
      </tbody>
    </table>
  )
}
