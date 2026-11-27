// Reglas del ingreso al panel. El mensaje de error es uno solo para todo rechazo (correo
// inexistente, contraseña equivocada, cuenta bloqueada por intentos o datos vacíos): así no
// revela si un correo tiene cuenta.
export const MENSAJE_DE_INGRESO_RECHAZADO =
  'El correo o la contraseña no son correctos. Revísalos e inténtalo de nuevo. Tras varios intentos fallidos, el ingreso se bloquea por unos minutos.'

// Estado que el formulario de ingreso recibe de su acción de servidor. `correo` vuelve para
// que el campo no se vacíe tras un intento fallido; la contraseña nunca vuelve.
export interface EstadoDelFormularioDeIngreso {
  error: string | null
  correo: string
}

export const ESTADO_INICIAL_DEL_INGRESO: EstadoDelFormularioDeIngreso = { error: null, correo: '' }

export interface Credenciales {
  correo: string
  clave: string
}

export function leerCredenciales(correo: unknown, clave: unknown): Credenciales | null {
  if (typeof correo !== 'string' || typeof clave !== 'string') return null
  const correoLimpio = correo.trim()
  if (!correoLimpio || !clave) return null
  return { correo: correoLimpio, clave }
}
