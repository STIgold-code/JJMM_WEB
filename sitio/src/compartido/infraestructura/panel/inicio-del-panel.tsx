import type { Payload, TypedUser } from 'payload'

import { BienvenidaDelPanel } from '../../componentes/panel/bienvenida-del-panel'
import { armarEnlacesRapidos } from './enlaces-rapidos'

interface Props {
  payload: Payload
  user?: TypedUser
}

// Contenedor de `admin.components.beforeDashboard`. Vive en infraestructura porque recibe la
// instancia de Payload (prop por defecto de los componentes de servidor del panel), algo que
// la capa `componentes/` no puede importar. Cuenta los mensajes pendientes con el acceso del
// usuario, sin saltarse los permisos.
export async function InicioDelPanel({ payload, user }: Props) {
  const { totalDocs } = await payload.count({
    collection: 'mensajes-de-contacto',
    where: { estado: { equals: 'nuevo' } },
    overrideAccess: false,
    user,
  })
  return (
    <BienvenidaDelPanel
      nombre={user?.nombre}
      enlaces={armarEnlacesRapidos(payload.config.routes.admin)}
      mensajesNuevos={totalDocs}
    />
  )
}
