import type { DatosDeLaGuia } from '../../aplicacion/consultar-guia'
import { SeccionDeAvisos } from './seccion-de-avisos'
import { SeccionDeVencimientos } from './seccion-de-vencimientos'
import { SeccionDelCronograma } from './seccion-del-cronograma'

interface Props extends DatosDeLaGuia {
  // Lo decide el servidor con el rol de la sesión; cada acción de borrar lo vuelve a comprobar.
  puedeEliminar: boolean
  // Año en curso en Lima: el que propone un cronograma nuevo.
  anioActual: number
}

// Pantalla «Guía de clientes» (presentación): todo lo que muestra /guia en una sola página
// (L4 f), con una parte por tarjeta y su ancla (#avisos, #vencimientos, #cronograma).
export function PantallaDeLaGuia({ avisos, vencimientos, cronogramas, ...props }: Props) {
  return (
    <>
      <div className="mb-6 grid gap-1">
        <h1 className="font-marca text-[1.75rem] leading-[1.15] font-medium tracking-[0.005em] text-balance max-sm:text-2xl">
          Guía de clientes
        </h1>
        <p className="max-w-[60ch] text-muted-foreground">
          Todo lo que muestra la página /guia del sitio: los avisos de cierre, los vencimientos y el
          cronograma de SUNAT.
        </p>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
        <SeccionDeAvisos avisos={avisos} puedeEliminar={props.puedeEliminar} />
        <SeccionDeVencimientos vencimientos={vencimientos} puedeEliminar={props.puedeEliminar} />
        <SeccionDelCronograma
          cronogramas={cronogramas}
          anioActual={props.anioActual}
          puedeEliminar={props.puedeEliminar}
        />
      </div>
    </>
  )
}
