import type { Metadata } from 'next'

import { obtenerListadoDeAreas } from '@/panel/aplicacion/consultar-areas'
import { PantallaDeAreas } from '@/panel/componentes/areas/pantalla-de-areas'
import { crearLecturaDeAreas } from '@/panel/infraestructura/lectura-de-areas-payload'
import { exigirSesion } from '@/panel/infraestructura/sesion-del-panel'

export const metadata: Metadata = { title: 'Áreas de servicio' }

// Áreas de servicio: las nueve áreas de la rueda SIGE Mype. Las lecturas usan la Local API con
// los permisos de quien entra.
export default async function PaginaDeAreas() {
  const sesion = await exigirSesion()
  const areas = await obtenerListadoDeAreas(crearLecturaDeAreas(sesion))
  return <PantallaDeAreas areas={areas} />
}
