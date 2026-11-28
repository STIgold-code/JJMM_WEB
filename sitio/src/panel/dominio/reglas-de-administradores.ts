import type { Rol } from '@/compartido/dominio/roles'

// Reglas que protegen el acceso al panel: sin un administrador nadie podría crear cuentas ni
// cambiar el menú o los datos del estudio. El servidor las aplica antes de escribir.
export const ERROR_ELIMINAR_TU_CUENTA = 'No puedes eliminar tu propia cuenta.'
export const ERROR_ELIMINAR_AL_ULTIMO =
  'Es el único administrador del panel: no se puede eliminar. Nombra antes a otro administrador.'
export const ERROR_DEGRADAR_AL_ULTIMO =
  'Es el único administrador del panel: si pasa a editor, nadie podrá crear cuentas. Nombra antes a otro administrador.'

interface CuentaConRol {
  id: number
  rol: Rol
}

// La cuenta es administradora y no hay otra que lo sea.
function esElUltimoAdministrador(cuentas: readonly CuentaConRol[], id: number): boolean {
  const administradores = cuentas.filter((cuenta) => cuenta.rol === 'administrador')
  return administradores.length === 1 && administradores[0]?.id === id
}

export function motivoParaNoEliminar(
  cuentas: readonly CuentaConRol[],
  { objetivo, actor }: { objetivo: number; actor: number },
): string | null {
  if (objetivo === actor) return ERROR_ELIMINAR_TU_CUENTA
  if (esElUltimoAdministrador(cuentas, objetivo)) return ERROR_ELIMINAR_AL_ULTIMO
  return null
}

// Vale también para quien se cambia el rol a sí mismo: el último administrador no deja de serlo.
export function motivoParaNoCambiarElRol(
  cuentas: readonly CuentaConRol[],
  { objetivo, rolNuevo }: { objetivo: number; actor: number; rolNuevo: Rol },
): string | null {
  if (rolNuevo === 'administrador') return null
  return esElUltimoAdministrador(cuentas, objetivo) ? ERROR_DEGRADAR_AL_ULTIMO : null
}
