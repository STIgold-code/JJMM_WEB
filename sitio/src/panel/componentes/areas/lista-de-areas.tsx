'use client'

import { ordenarLasAreas } from '../../acciones/areas'
import type { AreaDelPanel } from '../../dominio/areas-de-servicio'
import { useArrastre } from '../comunes/use-arrastre'
import { type AccionesDeLaLista, useListaOrdenable } from '../comunes/use-lista-ordenable'
import { FilaDeArea } from './fila-de-area'

const ENCABEZADO = 'px-4 py-[0.6rem] font-semibold'

const ACCIONES: AccionesDeLaLista = { ordenar: ordenarLasAreas }

// En celulares la tabla se apila y el encabezado se oculta.
function Encabezado() {
  return (
    <thead className="max-sm:hidden">
      <tr className="border-b text-left text-[0.8125rem] whitespace-nowrap text-muted-foreground">
        <th scope="col" className={`${ENCABEZADO} w-px`}>
          <span className="sr-only">Orden</span>
        </th>
        <th scope="col" className={ENCABEZADO}>
          Área
        </th>
        <th scope="col" className={ENCABEZADO}>
          En la rueda
        </th>
        <th scope="col" className={ENCABEZADO}>
          <span className="sr-only">Acciones</span>
        </th>
      </tr>
    </thead>
  )
}

// Áreas en el orden de las pestañas del sitio: asa para arrastrar, «Subir» y «Bajar», guardados
// al instante como en planes y sedes. Las áreas no tienen «Visible».
export function ListaDeAreas({ areas }: { areas: AreaDelPanel[] }) {
  const { elementos, anuncio, mover } = useListaOrdenable(areas, ACCIONES)
  const { propsDeFila, propsDeAsa } = useArrastre((desde, hacia) => mover(desde, hacia))
  return (
    <>
      <table className="w-full border-collapse text-sm max-sm:block">
        <Encabezado />
        <tbody className="max-sm:block">
          {elementos.map((area, indice) => (
            <FilaDeArea
              key={area.id}
              area={area}
              indice={indice}
              total={elementos.length}
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
