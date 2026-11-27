// Roles del panel: el administrador gestiona usuarios y la configuración del sitio;
// el editor gestiona el contenido.
export const ROLES = ['administrador', 'editor'] as const
export type Rol = (typeof ROLES)[number]

export interface UsuarioConRol {
  rol?: string | null
}

function esRol(valor: string | null | undefined): valor is Rol {
  return ROLES.some((rol) => rol === valor)
}

export function esAdministrador(usuario: UsuarioConRol | null | undefined): boolean {
  return usuario?.rol === 'administrador'
}

export function esDelEquipo(usuario: UsuarioConRol | null | undefined): boolean {
  return esRol(usuario?.rol)
}

// El primer usuario se crea desde la pantalla inicial del panel; si no fuera administrador,
// nadie podría crear más cuentas.
export function rolDelNuevoUsuario(
  cantidadDeUsuariosExistentes: number,
  rolSolicitado: Rol | undefined,
): Rol {
  if (cantidadDeUsuariosExistentes === 0) return 'administrador'
  return rolSolicitado ?? 'editor'
}
