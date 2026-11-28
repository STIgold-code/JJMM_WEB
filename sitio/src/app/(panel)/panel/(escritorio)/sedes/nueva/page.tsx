import type { Metadata } from 'next'

import { obtenerNuevaSede } from '@/panel/aplicacion/consultar-sedes'
import { EdicionDeSede } from '@/panel/componentes/sedes/edicion-de-sede'
import { crearLecturaDeSedes } from '@/panel/infraestructura/lectura-de-sedes-payload'
import { exigirSesion } from '@/panel/infraestructura/sesion-del-panel'

export const metadata: Metadata = { title: 'Nueva sede' }

// Nueva sede: el mismo formulario de la edición, vacío. Al crearla se pasa a su edición.
export default async function PaginaDeNuevaSede() {
  const sesion = await exigirSesion()
  const datos = await obtenerNuevaSede(crearLecturaDeSedes(sesion))
  return <EdicionDeSede key="nueva" datos={datos} puedeEliminar={false} />
}
