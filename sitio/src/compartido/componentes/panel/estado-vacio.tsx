import { type NombreDeTrazo, TrazoDelPanel } from './trazos-del-panel'
import estilos from './estado-vacio.module.css'

interface Props {
  icono: NombreDeTrazo
  titulo: string
  detalle: string
}

// Estado vacío de una lista del panel, con un título que explica por qué no hay nada.
export function EstadoVacio({ icono, titulo, detalle }: Props) {
  return (
    <div className={estilos.vacio} role="status">
      <span className={estilos.marco}>
        <TrazoDelPanel nombre={icono} />
      </span>
      <div>
        <p className={estilos.titulo}>{titulo}</p>
        <p className={estilos.detalle}>{detalle}</p>
      </div>
    </div>
  )
}
