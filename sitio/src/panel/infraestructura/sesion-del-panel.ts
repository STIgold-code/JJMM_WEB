import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Payload, SanitizedPermissions, TypedUser } from 'payload'
import { cache } from 'react'

import { esAdministrador, esDelEquipo, type Rol } from '@/compartido/dominio/roles'
import { obtenerPayload } from '@/compartido/infraestructura/instancia-payload'

import { RUTA_DE_INGRESO } from '../dominio/rutas-del-panel'

// Guardia única del panel: toda página (salvo el ingreso) y toda acción de servidor pasa por
// aquí. La sesión es la cookie de Payload (la misma del /admin), validada con `payload.auth`.
export interface SesionDelPanel {
  payload: Payload
  usuario: TypedUser
  permisos: SanitizedPermissions
}

// Una lectura por petición: el layout y la página comparten el resultado.
export const obtenerSesion = cache(async (): Promise<SesionDelPanel | null> => {
  const payload = await obtenerPayload()
  const { user, permissions } = await payload.auth({ headers: await headers() })
  if (!user || !esDelEquipo(user)) return null
  return { payload, usuario: user, permisos: permissions }
})

// Sin sesión válida, lleva al ingreso. `redirect` corta la ejecución: lo que sigue a esta
// llamada nunca corre sin sesión.
export async function exigirSesion(): Promise<SesionDelPanel> {
  const sesion = await obtenerSesion()
  if (!sesion) redirect(RUTA_DE_INGRESO)
  return sesion
}

// Una sesión que ya pasó por `exigirAdministrador`. Los adaptadores que solo usa el administrador
// (cuentas) piden este tipo: así una acción no puede llegar a ellos sin la guardia.
export interface SesionDeAdministrador extends SesionDelPanel {
  readonly rol: 'administrador'
}

// Guardia de las pantallas y acciones solo del administrador. Sin sesión redirige al ingreso
// (como `exigirSesion`); con la sesión de un editor devuelve `null` y quien la llama muestra
// «sin permiso» o rechaza la acción sin escribir.
export async function exigirAdministrador(): Promise<SesionDeAdministrador | null> {
  const sesion = await exigirSesion()
  return esAdministrador(sesion.usuario) ? { ...sesion, rol: 'administrador' } : null
}

// El rol siempre sale de la sesión validada en el servidor, nunca de lo que mande el navegador.
export function rolDeLaSesion({ usuario }: Pick<SesionDelPanel, 'usuario'>): Rol {
  return esAdministrador(usuario) ? 'administrador' : 'editor'
}
