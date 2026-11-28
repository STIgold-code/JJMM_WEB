import type { Metadata } from 'next'

import { PantallaDeMiCuenta } from '@/panel/componentes/cuenta/pantalla-de-mi-cuenta'
import { nombreDelRol } from '@/panel/dominio/menu-del-panel'
import { exigirSesion, rolDeLaSesion } from '@/panel/infraestructura/sesion-del-panel'

export const metadata: Metadata = { title: 'Mi cuenta' }

// «Mi cuenta», para cualquier cuenta del equipo y siempre la propia: los datos salen de la sesión
// validada en el servidor (Payload vuelve a leer la cuenta en cada petición).
export default async function PaginaDeMiCuenta() {
  const sesion = await exigirSesion()
  const { usuario } = sesion
  return (
    <PantallaDeMiCuenta
      nombre={usuario.nombre?.trim() ?? ''}
      correo={usuario.email}
      rol={nombreDelRol(rolDeLaSesion(sesion))}
    />
  )
}
