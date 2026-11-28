import type { Metadata } from 'next'

import { obtenerUsuarios } from '@/panel/aplicacion/gestionar-usuarios'
import { PantallaDeUsuarios } from '@/panel/componentes/usuarios/pantalla-de-usuarios'
import { SoloParaElAdministrador } from '@/panel/componentes/usuarios/solo-para-el-administrador'
import { exigirAdministrador } from '@/panel/infraestructura/sesion-del-panel'
import { crearRepositorioDeUsuarios } from '@/panel/infraestructura/usuarios-payload'

export const metadata: Metadata = { title: 'Usuarios' }

// Cuentas del panel, solo para el administrador: sin sesión lleva al ingreso y a un editor le
// explica que no tiene permiso (lo decide el servidor, no el menú). Las lecturas usan la Local API
// con los permisos de quien entra.
export default async function PaginaDeUsuarios() {
  const sesion = await exigirAdministrador()
  if (!sesion) return <SoloParaElAdministrador />
  const cuentas = await obtenerUsuarios(crearRepositorioDeUsuarios(sesion))
  return <PantallaDeUsuarios cuentas={cuentas} idPropio={sesion.usuario.id} />
}
