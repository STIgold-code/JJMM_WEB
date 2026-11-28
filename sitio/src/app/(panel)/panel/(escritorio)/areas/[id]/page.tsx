import type { Metadata } from 'next'

import { obtenerEdicionDeArea } from '@/panel/aplicacion/consultar-areas'
import { AreaNoEncontrada } from '@/panel/componentes/areas/area-no-encontrada'
import { EdicionDeArea } from '@/panel/componentes/areas/edicion-de-area'
import { crearLecturaDeAreas } from '@/panel/infraestructura/lectura-de-areas-payload'
import { exigirSesion } from '@/panel/infraestructura/sesion-del-panel'

export const metadata: Metadata = { title: 'Editar área' }

interface Props {
  params: Promise<{ id: string }>
}

// Edición de un área: datos, «Qué incluye», gajo y vista previa. Las lecturas usan la Local API
// con los permisos de quien entra; el id de la URL se valida antes de consultar.
export default async function PaginaDelArea({ params }: Props) {
  const sesion = await exigirSesion()
  const { id } = await params
  const datos = await obtenerEdicionDeArea(crearLecturaDeAreas(sesion), id)
  if (!datos) return <AreaNoEncontrada />
  // `key`: al cambiar de área el formulario empieza de nuevo.
  return <EdicionDeArea key={datos.area.id} datos={datos} />
}
