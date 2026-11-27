import type { Metadata } from 'next'

import { obtenerMensajes } from '@/panel/aplicacion/consultar-mensajes'
import { PantallaDeMensajes } from '@/panel/componentes/mensajes/pantalla-de-mensajes'
import {
  leerConsultaDeMensajes,
  type ParametrosDeLaUrl,
  puedeEliminarMensajes,
} from '@/panel/dominio/mensajes'
import { crearRepositorioDeMensajes } from '@/panel/infraestructura/repositorio-de-mensajes-payload'
import { exigirSesion, rolDeLaSesion } from '@/panel/infraestructura/sesion-del-panel'

export const metadata: Metadata = { title: 'Mensajes de contacto' }

interface Props {
  searchParams: Promise<ParametrosDeLaUrl>
}

// Mensajes de contacto: filtro, búsqueda, página y mensaje abierto salen de la URL; las lecturas
// usan la Local API con los permisos de quien entra.
export default async function PaginaDeMensajes({ searchParams }: Props) {
  const sesion = await exigirSesion()
  const consulta = leerConsultaDeMensajes(await searchParams)
  const datos = await obtenerMensajes(crearRepositorioDeMensajes(sesion), consulta)
  return (
    <PantallaDeMensajes
      consulta={consulta}
      datos={datos}
      puedeEliminar={puedeEliminarMensajes(rolDeLaSesion(sesion))}
      ahora={new Date()}
    />
  )
}
