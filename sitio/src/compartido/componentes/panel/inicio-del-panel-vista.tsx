import { AccesosRapidos } from './accesos-rapidos'
import { BienvenidaDelPanel } from './bienvenida-del-panel'
import type { EnlaceRapido } from './enlace-rapido'
import type { Cifra, SeccionDelInicio } from './modelo-del-inicio'
import { ResumenDelInicio } from './resumen-del-inicio'
import { SeccionesDelInicio } from './secciones-del-inicio'
import estilos from './inicio-del-panel-vista.module.css'

interface Props {
  nombre: string | null | undefined
  fecha: string
  cifras: readonly Cifra[]
  accesos: readonly EnlaceRapido[]
  secciones: readonly SeccionDelInicio[]
}

// Inicio del panel: saludo, resumen con cifras reales, accesos rápidos y todo el contenido
// agrupado como en el menú. Solo presentación: los datos llegan armados.
export function InicioDelPanelVista({ nombre, fecha, cifras, accesos, secciones }: Props) {
  return (
    <div className={estilos.inicio}>
      <BienvenidaDelPanel nombre={nombre} fecha={fecha} />
      {cifras.length > 0 ? <ResumenDelInicio cifras={cifras} /> : null}
      {accesos.length > 0 ? <AccesosRapidos accesos={accesos} /> : null}
      <SeccionesDelInicio secciones={secciones} />
    </div>
  )
}
