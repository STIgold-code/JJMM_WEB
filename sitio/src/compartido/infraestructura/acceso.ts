import type { Where } from 'payload'

import { esAdministrador, esDelEquipo, type UsuarioConRol } from '../dominio/roles'

// Funciones de control de acceso de Payload. Reciben solo la parte de los argumentos que
// usan, así se prueban con objetos simples y siguen siendo asignables a `Access`.
interface UsuarioDelPanel extends UsuarioConRol {
  id: number | string
}

interface ArgumentosDeAcceso {
  req: { user?: UsuarioDelPanel | null }
}

export const accesoPublico = (): boolean => true

export const soloEquipo = ({ req }: ArgumentosDeAcceso): boolean => esDelEquipo(req.user)

export const soloAdministradores = ({ req }: ArgumentosDeAcceso): boolean =>
  esAdministrador(req.user)

// Con borradores (drafts), el público solo ve lo publicado; el equipo ve todo.
export const publicadoOEquipo = ({ req }: ArgumentosDeAcceso): boolean | Where =>
  esDelEquipo(req.user) || { _status: { equals: 'published' } }

// Contenido público: cualquiera lo lee; solo el equipo lo crea, edita y borra.
export const ACCESO_DE_CONTENIDO = {
  read: accesoPublico,
  create: soloEquipo,
  update: soloEquipo,
  delete: soloEquipo,
}

// Los editores solo ven y editan su propia cuenta; el administrador, todas.
export const administradorOElMismoUsuario = ({ req }: ArgumentosDeAcceso): boolean | Where => {
  const { user } = req
  if (!user || !esDelEquipo(user)) return false
  if (esAdministrador(user)) return true
  return { id: { equals: user.id } }
}
