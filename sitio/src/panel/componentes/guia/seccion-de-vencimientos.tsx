'use client'

import { useState } from 'react'

import {
  contarSinFecha,
  filtrarVencimientos,
  type FiltroDeVencimientos,
  filtrosDeVencimientos,
  textoSinVencimientos,
  type VencimientoDelPanel,
} from '../../dominio/vencimientos-del-panel'
import { Buscador } from '../comunes/buscador'
import { FiltrosSegmentados } from '../comunes/filtros-segmentados'
import { BotonNuevo } from './boton-nuevo'
import { HojaDeVencimiento } from './hoja-de-vencimiento'
import { TablaDeVencimientos } from './tabla-de-vencimientos'
import { TarjetaDeLaGuia } from './tarjeta-de-la-guia'
import { usePanelAbierto } from './use-panel-abierto'

interface Props {
  vencimientos: VencimientoDelPanel[]
  puedeEliminar: boolean
}

const sinFecha = (cantidad: number) =>
  cantidad === 1
    ? '1 obligación sin fecha publicada'
    : `${cantidad} obligaciones sin fecha publicada`

interface PropsDeHerramientas {
  vencimientos: VencimientoDelPanel[]
  filtro: FiltroDeVencimientos
  alFiltrar: (filtro: FiltroDeVencimientos) => void
  busqueda: string
  alBuscar: (busqueda: string) => void
}

function Herramientas({
  vencimientos,
  filtro,
  alFiltrar,
  busqueda,
  alBuscar,
}: PropsDeHerramientas) {
  const opciones = filtrosDeVencimientos(vencimientos).map((opcion) => ({
    valor: opcion.filtro,
    texto: opcion.texto,
    cantidad: opcion.cantidad,
  }))
  return (
    <div className="flex flex-wrap items-center gap-3 border-b px-4 py-[0.85rem]">
      <FiltrosSegmentados
        aria-label="Filtrar por periodicidad"
        opciones={opciones}
        actual={filtro}
        alElegir={alFiltrar}
      />
      <Buscador
        id="buscar-vencimientos"
        etiqueta="Buscar vencimientos"
        placeholder="Buscar obligación"
        valor={busqueda}
        alCambiar={alBuscar}
      />
    </div>
  )
}

function Pie({
  mostrados,
  vencimientos,
}: {
  mostrados: number
  vencimientos: VencimientoDelPanel[]
}) {
  return (
    <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-t px-4 py-3 text-[0.8125rem] text-muted-foreground">
      <span aria-live="polite">
        Mostrando {mostrados} de {vencimientos.length}
      </span>
      <span>{sinFecha(contarSinFecha(vencimientos))}</span>
    </div>
  )
}

// «Vencimientos»: filtros por periodicidad con conteo y buscador (en el navegador: son pocas
// filas), la tabla y el panel lateral para crear o editar.
export function SeccionDeVencimientos({ vencimientos, puedeEliminar }: Props) {
  const [filtro, setFiltro] = useState<FiltroDeVencimientos>('todos')
  const [busqueda, setBusqueda] = useState('')
  const panel = usePanelAbierto(vencimientos)
  const visibles = filtrarVencimientos(vencimientos, filtro, busqueda)
  return (
    <TarjetaDeLaGuia
      parte="vencimientos"
      titulo="Vencimientos"
      descripcion="Las obligaciones que la guía recuerda a los clientes."
      accion={<BotonNuevo texto="Nuevo vencimiento" alPulsar={panel.abrirNuevo} />}
    >
      <Herramientas
        vencimientos={vencimientos}
        filtro={filtro}
        alFiltrar={setFiltro}
        busqueda={busqueda}
        alBuscar={setBusqueda}
      />
      <TablaDeVencimientos
        vencimientos={visibles}
        textoVacio={textoSinVencimientos(filtro, busqueda)}
        alEditar={panel.abrir}
      />
      <Pie mostrados={visibles.length} vencimientos={vencimientos} />
      {panel.hayPanel && (
        <HojaDeVencimiento
          key={panel.clave}
          vencimiento={panel.editado}
          puedeEliminar={puedeEliminar}
          alCerrar={panel.cerrar}
        />
      )}
    </TarjetaDeLaGuia>
  )
}
