import type { Payload, SanitizedPermissions, TypedUser } from 'payload'

import { InicioDelPanelVista } from '../../componentes/panel/inicio-del-panel-vista'
import { fechaLarga } from '../../componentes/panel/textos-del-inicio'
import { armarPendientes } from './cifras-del-panel'
import { contarColecciones, contarPendientes } from './conteos-del-panel'
import { armarEnlacesRapidos } from './enlaces-rapidos'
import { armarSecciones, entidadesDelPanel, puedeEditar } from './secciones-del-panel'

interface Props {
  payload: Payload
  permissions: SanitizedPermissions
  user?: TypedUser | null
}

// Inicio del panel (`admin.components.views.dashboard`): reemplaza la cuadrícula de Payload.
// Contenedor de servidor: cuenta con los permisos de quien entra, arma los datos y se los pasa
// a la presentación. Vive en infraestructura porque recibe la instancia de Payload.
export async function InicioDelPanel({ payload, permissions, user }: Props) {
  const rutaDelPanel = payload.config.routes.admin
  const entidades = entidadesDelPanel(payload.config.collections, payload.config.globals)
  const coleccionesVisibles = entidades
    .filter((entidad) => entidad.tipo === 'coleccion' && puedeEditar(entidad, permissions))
    .map(({ slug }) => slug)
  const contexto = { payload, permisos: permissions, user }
  const [conteos, cantidades] = await Promise.all([
    contarPendientes(contexto),
    contarColecciones(contexto, coleccionesVisibles),
  ])
  return (
    <InicioDelPanelVista
      nombre={user?.nombre}
      fecha={fechaLarga(new Date())}
      pendientes={armarPendientes(conteos, rutaDelPanel)}
      accesos={armarEnlacesRapidos(rutaDelPanel, permissions)}
      secciones={armarSecciones({
        entidades,
        permisos: permissions,
        rutaDelPanel,
        conteos: cantidades,
      })}
    />
  )
}
