import type { Metadata } from 'next'

import { obtenerListadoDeSedes } from '@/panel/aplicacion/consultar-sedes'
import { PantallaDeSedes } from '@/panel/componentes/sedes/pantalla-de-sedes'
import { crearLecturaDeSedes } from '@/panel/infraestructura/lectura-de-sedes-payload'
import { exigirSesion } from '@/panel/infraestructura/sesion-del-panel'

export const metadata: Metadata = { title: 'Sedes' }

// Sedes: las del pie y las pestañas de «Contáctanos», en su orden. Las lecturas usan la Local
// API con los permisos de quien entra.
export default async function PaginaDeSedes() {
  const sesion = await exigirSesion()
  const sedes = await obtenerListadoDeSedes(crearLecturaDeSedes(sesion))
  return <PantallaDeSedes sedes={sedes} />
}
