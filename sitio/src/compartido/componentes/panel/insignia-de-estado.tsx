import { type DatosDeInsignia, insigniaDeActivo, insigniaDeMensaje } from './insignias'
import estilos from './insignia-de-estado.module.css'

export function Insignia({ texto, tono }: DatosDeInsignia) {
  return <span className={`${estilos.insignia} ${estilos[tono]}`}>{texto}</span>
}

// Celdas de lista de Payload (`admin.components.Cell`). Payload les pasa el valor en
// `cellData`; se declara solo esa prop para no depender de los tipos de Payload aquí.
interface PropsDeCelda {
  cellData?: unknown
}

export function CeldaDeMensaje({ cellData }: PropsDeCelda) {
  const datos = insigniaDeMensaje(cellData)
  return datos ? <Insignia {...datos} /> : null
}

export function CeldaDeActivo({ cellData }: PropsDeCelda) {
  return <Insignia {...insigniaDeActivo(cellData)} />
}
