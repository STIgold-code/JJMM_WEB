import type { Metadata } from 'next'

import { obtenerEdicionDeSede } from '@/panel/aplicacion/consultar-sedes'
import { EdicionDeSede } from '@/panel/componentes/sedes/edicion-de-sede'
import { SedeNoEncontrada } from '@/panel/componentes/sedes/sede-no-encontrada'
import { puedeEliminarSedes } from '@/panel/dominio/sedes'
import { crearLecturaDeSedes } from '@/panel/infraestructura/lectura-de-sedes-payload'
import { exigirSesion, rolDeLaSesion } from '@/panel/infraestructura/sesion-del-panel'

export const metadata: Metadata = { title: 'Editar sede' }

interface Props {
  params: Promise<{ id: string }>
}

// Edición de una sede: dirección, celulares, mapa, publicación y vista previa. Las lecturas usan
// la Local API con los permisos de quien entra; el id de la URL se valida antes de consultar.
export default async function PaginaDeLaSede({ params }: Props) {
  const sesion = await exigirSesion()
  const { id } = await params
  const datos = await obtenerEdicionDeSede(crearLecturaDeSedes(sesion), id)
  if (!datos?.sede) return <SedeNoEncontrada />
  // `key`: al cambiar de sede (o tras crearla) el formulario empieza de nuevo.
  return (
    <EdicionDeSede
      key={datos.sede.id}
      datos={datos}
      puedeEliminar={puedeEliminarSedes(rolDeLaSesion(sesion))}
    />
  )
}
