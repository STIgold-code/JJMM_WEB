'use client'

import type { ClienteDelPanel } from '../../dominio/clientes'
import { useArrastre } from '../comunes/use-arrastre'
import { FilaDeCliente } from './fila-de-cliente'

const ENCABEZADO = 'px-4 py-[0.6rem] font-semibold'

// En celulares la tabla se apila y el encabezado se oculta.
function Encabezado() {
  return (
    <thead className="max-sm:hidden">
      <tr className="border-b text-left text-[0.8125rem] whitespace-nowrap text-muted-foreground">
        <th scope="col" className={`${ENCABEZADO} w-px`}>
          <span className="sr-only">Orden</span>
        </th>
        {['Cliente', 'En el sitio', 'Visible'].map((titulo) => (
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
  // Los que se muestran (con su posición en el carrusel).
  mostrados: { cliente: ClienteDelPanel; posicion: number }[]
  // Solo se ordena con la lista completa a la vista (sin filtro ni búsqueda).
  ordenable: boolean
  alMover: (desde: number, hacia: number, paso?: -1 | 1) => void
  alEditar: (id: number) => void
  alCambiarVisibilidad: (id: number, visible: boolean) => void
}

// Clientes en el orden del carrusel: interruptor «Visible» y orden (asa, «Subir» y «Bajar»), los
// dos guardados al instante, como planes y sedes.
export function ListaDeClientes({ mostrados, ordenable, alMover, ...acciones }: Props) {
  const { propsDeFila, propsDeAsa } = useArrastre((desde, hacia) => alMover(desde, hacia))
  return (
    <table className="w-full border-collapse text-sm max-sm:block">
      <Encabezado />
      <tbody className="max-sm:block">
        {mostrados.map(({ cliente, posicion }, indice) => (
          <FilaDeCliente
            key={cliente.id}
            cliente={cliente}
            posicion={posicion}
            orden={
              ordenable
                ? {
                    indice,
                    total: mostrados.length,
                    alMover,
                    propsDeFila: propsDeFila(indice),
                    propsDeAsa: propsDeAsa(indice),
                  }
                : null
            }
            {...acciones}
          />
        ))}
      </tbody>
    </table>
  )
}
