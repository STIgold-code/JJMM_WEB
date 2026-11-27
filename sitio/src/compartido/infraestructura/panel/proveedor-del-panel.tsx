'use client'

import { useConfig } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import { PanelDeAcceso } from '../../componentes/panel/panel-de-acceso'
import { VerContrasenas } from '../../componentes/panel/ver-contrasenas'
import { esPantallaDeAcceso } from './pantallas-de-acceso'

// Proveedor del panel (`admin.components.providers`): envuelve todas las pantallas. Vive en
// infraestructura porque lee la configuración de Payload (`useConfig`) para conocer sus rutas.
// - En las pantallas de acceso, que Payload dibuja sin menú, agrega el panel de marca.
// - En todas, agrega el botón «ojo» a los campos de contraseña.
// Cada hijo ocupa siempre la misma posición (el panel o `null`), así React no vuelve a montar
// el contenido al cambiar de pantalla.
export function ProveedorDelPanel({ children }: { children?: ReactNode }) {
  const ruta = usePathname()
  const { config } = useConfig()
  const enAcceso = esPantallaDeAcceso(ruta, config.routes.admin, config.admin.routes)
  return (
    <>
      {enAcceso ? <PanelDeAcceso /> : null}
      {children}
      <VerContrasenas />
    </>
  )
}
