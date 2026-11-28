import type { Metadata } from 'next'

import { obtenerEdicionDePlan } from '@/panel/aplicacion/consultar-planes'
import { EdicionDePlan } from '@/panel/componentes/planes/edicion-de-plan'
import { PlanNoEncontrado } from '@/panel/componentes/planes/plan-no-encontrado'
import { puedeEliminarPlanes } from '@/panel/dominio/planes'
import { crearLecturaDePlanes } from '@/panel/infraestructura/lectura-de-planes-payload'
import { exigirSesion, rolDeLaSesion } from '@/panel/infraestructura/sesion-del-panel'

export const metadata: Metadata = { title: 'Editar plan' }

interface Props {
  params: Promise<{ id: string }>
}

// Edición de un plan: datos, «Qué incluye» y vista previa. Las lecturas usan la Local API con
// los permisos de quien entra; el id de la URL se valida antes de consultar.
export default async function PaginaDelPlan({ params }: Props) {
  const sesion = await exigirSesion()
  const { id } = await params
  const datos = await obtenerEdicionDePlan(crearLecturaDePlanes(sesion), id)
  if (!datos) return <PlanNoEncontrado />
  // `key`: al cambiar de plan (o tras borrarlo y crear otro) el formulario empieza de nuevo.
  return (
    <EdicionDePlan
      key={datos.plan.id}
      datos={datos}
      puedeEliminar={puedeEliminarPlanes(rolDeLaSesion(sesion))}
    />
  )
}
