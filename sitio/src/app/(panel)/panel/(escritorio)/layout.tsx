import type { ReactNode } from 'react'

import { EstructuraDelPanel } from '@/panel/componentes/estructura/estructura-del-panel'
import { datosDelMenu } from '@/panel/infraestructura/menu-de-la-sesion'
import { exigirSesion } from '@/panel/infraestructura/sesion-del-panel'

// Estructura de todas las pantallas con sesión: menú lateral y barra superior. Cada página
// vuelve a exigir la sesión (un layout no protege las peticiones de la página por sí solo);
// `obtenerSesion` está en `cache`, así que se valida una vez por petición.
export default async function LayoutDelEscritorio({ children }: { children: ReactNode }) {
  const sesion = await exigirSesion()
  return <EstructuraDelPanel {...await datosDelMenu(sesion)}>{children}</EstructuraDelPanel>
}
