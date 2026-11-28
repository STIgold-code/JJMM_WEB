'use client'

import { CalendarDays } from 'lucide-react'

import type { CronogramaDelPanel } from '../../dominio/cronogramas-del-panel'
import { EstadoVacio } from '../comunes/estado-vacio'
import { BotonNuevo } from './boton-nuevo'
import { HojaDelCronograma } from './hoja-del-cronograma'
import { ListaDeCronogramas } from './lista-de-cronogramas'
import { TarjetaDeLaGuia } from './tarjeta-de-la-guia'
import { usePanelAbierto } from './use-panel-abierto'

interface Props {
  // Del periodo más reciente al más antiguo.
  cronogramas: CronogramaDelPanel[]
  anioActual: number
  puedeEliminar: boolean
}

// «Cronograma de SUNAT por dígito del RUC»: los periodos cargados, o el estado vacío de la
// maqueta (hoy no hay ninguno), y el panel lateral para cargar o corregir uno.
export function SeccionDelCronograma({ cronogramas, anioActual, puedeEliminar }: Props) {
  const panel = usePanelAbierto(cronogramas)
  const cargar = <BotonNuevo texto="Cargar cronograma" alPulsar={panel.abrirNuevo} />
  return (
    <TarjetaDeLaGuia
      parte="cronograma"
      titulo="Cronograma de SUNAT por dígito del RUC"
      accion={cronogramas.length > 0 ? cargar : undefined}
    >
      {cronogramas.length > 0 ? (
        <ListaDeCronogramas cronogramas={cronogramas} alEditar={panel.abrir} />
      ) : (
        <EstadoVacio
          Icono={CalendarDays}
          titulo="Todavía no hay cronograma"
          texto="Aquí va el cronograma oficial de SUNAT: para cada mes, la fecha de vencimiento según el último dígito del RUC, del 0 al 9. Cuando lo cargues, la guía lo muestra como una tabla que el cliente consulta con su RUC."
        >
          {cargar}
        </EstadoVacio>
      )}
      {panel.hayPanel && (
        <HojaDelCronograma
          key={panel.clave}
          cronograma={panel.editado}
          anioActual={anioActual}
          puedeEliminar={puedeEliminar}
          alCerrar={panel.cerrar}
        />
      )}
    </TarjetaDeLaGuia>
  )
}
