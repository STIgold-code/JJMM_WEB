import type { Metadata } from 'next'

import { obtenerPaginaDeInicio } from '@/panel/aplicacion/consultar-pagina-de-inicio'
import { PantallaDeLaPaginaDeInicio } from '@/panel/componentes/pagina-de-inicio/pantalla-de-la-pagina-de-inicio'
import { crearLecturaDeLaPaginaDeInicio } from '@/panel/infraestructura/lectura-de-la-pagina-de-inicio-payload'
import { exigirSesion } from '@/panel/infraestructura/sesion-del-panel'

export const metadata: Metadata = { title: 'Página de inicio' }

// Página de inicio del sitio: sus secciones en orden. La global la edita todo el equipo
// (`soloEquipo`), así que la pantalla es la misma para el administrador y el editor. Las lecturas
// usan la Local API con los permisos de quien entra.
export default async function PaginaDeLaPaginaDeInicio() {
  const sesion = await exigirSesion()
  const datos = await obtenerPaginaDeInicio(crearLecturaDeLaPaginaDeInicio(sesion))
  return <PantallaDeLaPaginaDeInicio datos={datos} />
}
