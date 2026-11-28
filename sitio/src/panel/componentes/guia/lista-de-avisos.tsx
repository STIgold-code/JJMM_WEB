'use client'

import { cambiarVisibilidadDelAviso, ordenarLosAvisos } from '../../acciones/avisos'
import type { AvisoDelPanel } from '../../dominio/avisos-para-clientes'
import { useArrastre } from '../comunes/use-arrastre'
import { type AccionesDeLaLista, useListaOrdenable } from '../comunes/use-lista-ordenable'
import { FilaDeAviso } from './fila-de-aviso'

const ENCABEZADO = 'px-4 py-[0.6rem] font-semibold'

const ACCIONES: AccionesDeLaLista = {
  cambiarVisibilidad: cambiarVisibilidadDelAviso,
  ordenar: ordenarLosAvisos,
}

// En celulares la tabla se apila y el encabezado se oculta.
function Encabezado() {
  return (
    <thead className="max-sm:hidden">
      <tr className="border-b text-left text-[0.8125rem] whitespace-nowrap text-muted-foreground">
        <th scope="col" className={`${ENCABEZADO} w-px`}>
          <span className="sr-only">Orden</span>
        </th>
        {['Aviso', 'En la guía', 'Visible'].map((titulo) => (
          <th key={titulo} scope="col" className={ENCABEZADO}>
            {titulo}
          </th>
        ))}
        <th scope="col" className={ENCABEZADO}>
          <span className="sr-only">Acciones</span>
        </th>
      </tr>
    </thead>
  )
}

interface Props {
  avisos: AvisoDelPanel[]
  alEditar: (id: number) => void
}

// Avisos en el orden de la guía: interruptor «Visible» y orden (asa para arrastrar, «Subir» y
// «Bajar»), los dos guardados al instante, como planes y sedes.
export function ListaDeAvisos({ avisos, alEditar }: Props) {
  const { elementos, anuncio, cambiarVisibilidad, mover } = useListaOrdenable(
    avisos.map((aviso) => ({ ...aviso, nombre: aviso.titulo })),
    ACCIONES,
  )
  const { propsDeFila, propsDeAsa } = useArrastre((desde, hacia) => mover(desde, hacia))
  return (
    <>
      <table className="w-full border-collapse text-sm max-sm:block">
        <Encabezado />
        <tbody className="max-sm:block">
          {elementos.map((aviso, indice) => (
            <FilaDeAviso
              key={aviso.id}
              aviso={aviso}
              indice={indice}
              total={elementos.length}
              alEditar={alEditar}
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
