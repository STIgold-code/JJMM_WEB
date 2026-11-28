'use client'

import {
  type ClienteDelPanel,
  conteosDeClientes,
  filtrarClientes,
  type FiltroDeClientes,
} from '../../dominio/clientes'
import { Buscador } from '../comunes/buscador'
import { FiltrosSegmentados } from '../comunes/filtros-segmentados'
import { ListaDeClientes } from './lista-de-clientes'

interface Props {
  lista: {
    elementos: ClienteDelPanel[]
    anuncio: string
    cambiarVisibilidad: (id: number, visible: boolean) => void
    mover: (desde: number, hacia: number, paso?: -1 | 1) => void
  }
  consulta: {
    filtro: FiltroDeClientes
    busqueda: string
    setFiltro: (filtro: FiltroDeClientes) => void
    setBusqueda: (busqueda: string) => void
  }
  alEditar: (id: number) => void
}

const VACIOS: Readonly<Record<FiltroDeClientes, string>> = {
  todos: 'No hay clientes con ese nombre.',
  visible: 'Ningún logotipo visible coincide.',
  oculta: 'No hay logotipos ocultos que coincidan.',
}

function Herramientas({
  clientes,
  consulta,
}: { clientes: ClienteDelPanel[] } & Pick<Props, 'consulta'>) {
  const conteos = conteosDeClientes(clientes)
  return (
    <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
      <FiltrosSegmentados
        aria-label="Filtrar por visibilidad"
        actual={consulta.filtro}
        alElegir={consulta.setFiltro}
        opciones={[
          { valor: 'todos', texto: 'Todos', cantidad: conteos.todos },
          { valor: 'visible', texto: 'Visibles', cantidad: conteos.visible },
          { valor: 'oculta', texto: 'Ocultos', cantidad: conteos.oculta },
        ]}
      />
      <Buscador
        id="buscar-clientes"
        etiqueta="Buscar clientes"
        placeholder="Buscar por nombre"
        valor={consulta.busqueda}
        alCambiar={consulta.setBusqueda}
      />
    </div>
  )
}

// Filtros, buscador y lista. El orden solo se cambia con la lista completa a la vista: con un
// filtro o una búsqueda, mover una fila saltaría a las que no se ven.
export function ClientesFiltrados({ lista, consulta, alEditar }: Props) {
  const { elementos } = lista
  const posiciones = new Map(elementos.map((c, indice) => [c.id, indice + 1]))
  const mostrados = filtrarClientes(elementos, consulta.filtro, consulta.busqueda).map(
    (cliente) => ({
      cliente,
      posicion: posiciones.get(cliente.id) ?? 0,
    }),
  )
  const completa = mostrados.length === elementos.length
  return (
    <>
      <Herramientas clientes={elementos} consulta={consulta} />
      {mostrados.length > 0 ? (
        <ListaDeClientes
          mostrados={mostrados}
          ordenable={completa}
          alMover={lista.mover}
          alEditar={alEditar}
          alCambiarVisibilidad={lista.cambiarVisibilidad}
        />
      ) : (
        <p className="px-4 py-8 text-center text-sm text-muted-foreground">
          {VACIOS[consulta.filtro]}
        </p>
      )}
      <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-t px-4 py-3 text-[0.8125rem] text-muted-foreground">
        <span aria-live="polite">{`Mostrando ${mostrados.length} de ${elementos.length}`}</span>
        <span>
          {completa
            ? 'Arrastra o usa las flechas para ordenar; el cambio se guarda solo.'
            : 'Para ordenar, muestra todos los clientes sin buscar.'}
        </span>
      </div>
      <p aria-live="assertive" className="sr-only">
        {lista.anuncio}
      </p>
    </>
  )
}
