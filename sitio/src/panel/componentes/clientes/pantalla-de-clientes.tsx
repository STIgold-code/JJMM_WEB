'use client'

import { Building2, Plus, TriangleAlert } from 'lucide-react'
import { useState } from 'react'

import { cambiarVisibilidadDelCliente, ordenarLosClientes } from '../../acciones/clientes'
import {
  avisoDeNombresPorConfirmar,
  type ClienteDelPanel,
  type FiltroDeClientes,
} from '../../dominio/clientes'
import { EstadoVacio } from '../comunes/estado-vacio'
import { type AccionesDeLaLista, useListaOrdenable } from '../comunes/use-lista-ordenable'
import { usePanelAbierto } from '../guia/use-panel-abierto'
import { Button } from '../ui/button'
import { ClientesFiltrados } from './clientes-filtrados'
import { HojaDeCliente } from './hoja-de-cliente'

const ACCIONES: AccionesDeLaLista = {
  cambiarVisibilidad: cambiarVisibilidadDelCliente,
  ordenar: ordenarLosClientes,
}

function Cabecera({ alNuevo }: { alNuevo: () => void }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="grid gap-1">
        <h1 className="font-marca text-[1.75rem] leading-[1.15] font-medium tracking-[0.005em] text-balance max-sm:text-2xl">
          Clientes
        </h1>
        <p className="max-w-[60ch] text-muted-foreground">
          Los logotipos que pasan en «Nuestros clientes» del inicio, en este orden. Publica solo
          clientes reales que aceptaron aparecer.
        </p>
      </div>
      <Button type="button" onClick={alNuevo}>
        <Plus aria-hidden="true" />
        Nuevo cliente
      </Button>
    </div>
  )
}

// Aviso de la maqueta: cuántos nombres faltan confirmar y en qué posiciones, sacado del texto.
function NotaPorConfirmar({ clientes }: { clientes: readonly ClienteDelPanel[] }) {
  const aviso = avisoDeNombresPorConfirmar(clientes)
  if (!aviso) return null
  return (
    <div className="mb-4 flex items-start gap-3 rounded-md border border-pendiente-borde bg-pendiente-fondo px-4 py-3 text-sm text-pendiente">
      <TriangleAlert aria-hidden="true" className="mt-[0.1rem] size-4 shrink-0" />
      <p>
        <strong>{aviso}</strong> El sitio los publica como «Cliente del estudio (nombre por
        confirmar)», que también es lo que leen los lectores de pantalla. Pide al estudio el nombre
        real y escríbelo al editarlos.
      </p>
    </div>
  )
}

interface Props {
  clientes: ClienteDelPanel[]
  // Lo decide el servidor con el rol de la sesión; la acción de borrar lo vuelve a comprobar.
  puedeEliminar: boolean
}

// Pantalla «Clientes» (maqueta): aviso de nombres por confirmar, filtros con conteo, buscador,
// lista ordenable con «Visible» y el panel lateral para crear o editar.
export function PantallaDeClientes({ clientes, puedeEliminar }: Props) {
  const lista = useListaOrdenable(clientes, ACCIONES)
  const panel = usePanelAbierto(clientes)
  const [filtro, setFiltro] = useState<FiltroDeClientes>('todos')
  const [busqueda, setBusqueda] = useState('')
  return (
    <>
      <Cabecera alNuevo={panel.abrirNuevo} />
      <NotaPorConfirmar clientes={lista.elementos} />
      <section
        aria-label="Lista de clientes"
        className="rounded-lg border bg-card text-card-foreground shadow-sm"
      >
        {clientes.length > 0 ? (
          <ClientesFiltrados
            lista={lista}
            consulta={{ filtro, busqueda, setFiltro, setBusqueda }}
            alEditar={panel.abrir}
          />
        ) : (
          <EstadoVacio
            Icono={Building2}
            titulo="Todavía no hay clientes"
            texto="Aquí aparecen los logotipos del carrusel «Nuestros clientes», en su orden. Agrega el primero con «Nuevo cliente»."
          />
        )}
      </section>
      {panel.hayPanel && (
        <HojaDeCliente
          key={panel.clave}
          cliente={panel.editado}
          puedeEliminar={puedeEliminar}
          alCerrar={panel.cerrar}
        />
      )}
    </>
  )
}
