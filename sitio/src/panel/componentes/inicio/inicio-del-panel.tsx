import type { DatosDelInicio } from '../../aplicacion/obtener-inicio'
import { CifrasDelSitio } from './cifras-del-sitio'
import { ListaDeFaltantes } from './lista-de-faltantes'
import { TablaDePendientes } from './tabla-de-pendientes'
import { TarjetasDeAtencion } from './tarjetas-de-atencion'

interface Props {
  saludo: string
  fecha: string
  fechaIso: string
  ahora: Date
  datos: DatosDelInicio
}

// Inicio del panel (presentación): saludo y fecha, «Requiere atención», cifras del sitio,
// pendientes y lo que falta completar. Todos los números llegan ya leídos con los permisos de
// quien entra.
export function InicioDelPanel({ saludo, fecha, fechaIso, ahora, datos }: Props) {
  return (
    <>
      <div className="mb-7 grid gap-1">
        <h1 className="font-marca text-[1.75rem] leading-[1.15] font-medium tracking-[0.005em] text-balance max-sm:text-2xl">
          {saludo}
        </h1>
        <time dateTime={fechaIso} className="text-muted-foreground">
          {fecha}
        </time>
      </div>
      <div className="grid gap-6">
        <TarjetasDeAtencion tarjetas={datos.tarjetas} />
        <CifrasDelSitio cifras={datos.cifras} />
        <div className="grid items-start gap-6 amplio:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
          {datos.pendientes && <TablaDePendientes filas={datos.pendientes} ahora={ahora} />}
          <ListaDeFaltantes faltantes={datos.faltantes} />
        </div>
      </div>
    </>
  )
}
