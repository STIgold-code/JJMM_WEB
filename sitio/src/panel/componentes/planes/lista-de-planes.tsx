'use client'

import { cambiarVisibilidadDelPlan, ordenarLosPlanes } from '../../acciones/planes'
import type { PlanDelListado } from '../../aplicacion/consultar-planes'
import { useArrastre } from '../comunes/use-arrastre'
import { type AccionesDeLaLista, useListaOrdenable } from '../comunes/use-lista-ordenable'
import { FilaDePlan } from './fila-de-plan'

interface Props {
  planes: PlanDelListado[]
  caracteristicas: number
}

const ENCABEZADO = 'px-4 py-[0.6rem] font-semibold'

const ACCIONES: AccionesDeLaLista = {
  cambiarVisibilidad: cambiarVisibilidadDelPlan,
  ordenar: ordenarLosPlanes,
}

// En celulares la tabla se apila y el encabezado se oculta.
function Encabezado() {
  return (
    <thead className="max-sm:hidden">
      <tr className="border-b text-left text-[0.8125rem] whitespace-nowrap text-muted-foreground">
        <th scope="col" className={`${ENCABEZADO} w-px`}>
          <span className="sr-only">Orden</span>
        </th>
        <th scope="col" className={ENCABEZADO}>
          Plan
        </th>
        <th scope="col" className={ENCABEZADO}>
          En el sitio
        </th>
        <th scope="col" className={ENCABEZADO}>
          Visible
        </th>
        <th scope="col" className={ENCABEZADO}>
          <span className="sr-only">Acciones</span>
        </th>
      </tr>
    </thead>
  )
}

// Listado de planes en el orden de la tabla del sitio: interruptor «Visible» y orden (asa para
// arrastrar, botones «Subir» y «Bajar»), los dos guardados al instante.
export function ListaDePlanes({ planes: delServidor, caracteristicas }: Props) {
  const lista = useListaOrdenable(delServidor, ACCIONES)
  const { elementos: planes, anuncio, cambiarVisibilidad, mover } = lista
  const { propsDeFila, propsDeAsa } = useArrastre((desde, hacia) => mover(desde, hacia))
  return (
    <>
      <table className="w-full border-collapse text-sm max-sm:block">
        <Encabezado />
        <tbody className="max-sm:block">
          {planes.map((plan, indice) => (
            <FilaDePlan
              key={plan.id}
              plan={plan}
              indice={indice}
              total={planes.length}
              caracteristicas={caracteristicas}
              alCambiarVisibilidad={cambiarVisibilidad}
              alMover={mover}
              propsDeFila={propsDeFila(indice)}
              propsDeAsa={propsDeAsa(indice)}
            />
          ))}
        </tbody>
      </table>
      <p aria-live="assertive" className="sr-only">
        {anuncio}
      </p>
    </>
  )
}
