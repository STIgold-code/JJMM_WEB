import type { PuertoDeCarga } from '../puerto-de-carga'

export interface CredencialesDeAdministrador {
  correo: string
  clave: string
}

export class CredencialesIncompletasError extends Error {
  constructor() {
    super(
      'Define SEMILLA_ADMIN_CORREO y SEMILLA_ADMIN_CLAVE juntas, o ninguna para no crear el administrador.',
    )
    this.name = 'CredencialesIncompletasError'
  }
}

// Las credenciales del primer administrador nunca se escriben en el código: se leen del
// entorno. Sin ninguna de las dos variables, la carga no crea usuarios.
export function leerAdministrador(
  entorno: Readonly<Record<string, string | undefined>>,
): CredencialesDeAdministrador | null {
  const correo = entorno.SEMILLA_ADMIN_CORREO?.trim() ?? ''
  const clave = entorno.SEMILLA_ADMIN_CLAVE ?? ''
  if (correo === '' && clave === '') return null
  if (correo === '' || clave === '') throw new CredencialesIncompletasError()
  return { correo, clave }
}

// Si la cuenta ya existe no se toca: repetir la carga nunca cambia una contraseña.
export async function cargarAdministrador(
  puerto: PuertoDeCarga,
  credenciales: CredencialesDeAdministrador | null,
): Promise<boolean> {
  if (credenciales === null) return false
  const { correo, clave } = credenciales
  if ((await puerto.buscar('usuarios', { email: correo })) !== null) return false
  await puerto.crear('usuarios', { email: correo, password: clave, rol: 'administrador' })
  return true
}
