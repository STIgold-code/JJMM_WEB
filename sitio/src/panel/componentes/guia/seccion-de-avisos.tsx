'use client'

import { Megaphone } from 'lucide-react'

import type { AvisoDelPanel } from '../../dominio/avisos-para-clientes'
import { EstadoVacio } from '../comunes/estado-vacio'
import { BotonNuevo } from './boton-nuevo'
import { HojaDeAviso } from './hoja-de-aviso'
import { ListaDeAvisos } from './lista-de-avisos'
import { TarjetaDeLaGuia } from './tarjeta-de-la-guia'
import { usePanelAbierto } from './use-panel-abierto'

interface Props {
  avisos: AvisoDelPanel[]
  puedeEliminar: boolean
}

// «Avisos para clientes»: el listado ordenable y el panel lateral para crear o editar.
export function SeccionDeAvisos({ avisos, puedeEliminar }: Props) {
  const panel = usePanelAbierto(avisos)
  return (
    <TarjetaDeLaGuia
      parte="avisos"
      titulo="Avisos para clientes"
      descripcion="Qué documentos enviar y cuándo. Se muestran en este orden."
      accion={<BotonNuevo texto="Nuevo aviso" alPulsar={panel.abrirNuevo} />}
    >
      {avisos.length > 0 ? (
        <ListaDeAvisos avisos={avisos} alEditar={panel.abrir} />
      ) : (
        <EstadoVacio
          Icono={Megaphone}
          titulo="Todavía no hay avisos"
          texto="Aquí aparecen los avisos de cierre (qué documentos enviar y hasta cuándo). Crea el primero con «Nuevo aviso»."
        />
      )}
      {panel.hayPanel && (
        <HojaDeAviso
          key={panel.clave}
          aviso={panel.editado}
          puedeEliminar={puedeEliminar}
          alCerrar={panel.cerrar}
        />
      )}
    </TarjetaDeLaGuia>
  )
}
