import type { Metadata } from 'next'

import { obtenerListadoDePlanes } from '@/panel/aplicacion/consultar-planes'
import { PantallaDePlanes } from '@/panel/componentes/planes/pantalla-de-planes'
import { crearLecturaDePlanes } from '@/panel/infraestructura/lectura-de-planes-payload'
import { exigirSesion } from '@/panel/infraestructura/sesion-del-panel'

export const metadata: Metadata = { title: 'Planes' }

// Planes: columnas de la tabla «Nuestros planes» del inicio. Las lecturas usan la Local API con
// los permisos de quien entra.
export default async function PaginaDePlanes() {
  const sesion = await exigirSesion()
  const datos = await obtenerListadoDePlanes(crearLecturaDePlanes(sesion))
  return <PantallaDePlanes datos={datos} />
}
