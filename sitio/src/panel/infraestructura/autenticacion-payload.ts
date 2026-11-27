import {
  AuthenticationError,
  createLocalReq,
  LockedAuth,
  logoutOperation,
  UnverifiedEmail,
  ValidationError,
} from 'payload'

import { obtenerPayload } from '@/compartido/infraestructura/instancia-payload'

import type { Autenticar } from '../aplicacion/ingresar'
import { borrarCookieDeSesion, guardarCookieDeSesion } from './cookie-de-sesion'
import type { SesionDelPanel } from './sesion-del-panel'

// Errores de Payload que significan «estas credenciales no entran»: correo o contraseña
// equivocados, cuenta bloqueada por intentos fallidos (`maxLoginAttempts`), correo sin
// verificar o datos vacíos. Todos terminan en el mismo mensaje para no revelar si la cuenta
// existe. Cualquier otro error (base caída) se propaga.
const RECHAZOS = [AuthenticationError, LockedAuth, UnverifiedEmail, ValidationError]

const esRechazo = (error: unknown) => RECHAZOS.some((Clase) => error instanceof Clase)

export const autenticarConPayload: Autenticar = async ({ correo, clave }) => {
  const payload = await obtenerPayload()
  try {
    const { token } = await payload.login({
      collection: 'usuarios',
      data: { email: correo, password: clave },
    })
    if (!token) return 'rechazado'
    await guardarCookieDeSesion(payload, token)
    return 'aceptado'
  } catch (error) {
    if (esRechazo(error)) return 'rechazado'
    throw error
  }
}

// Cierra la sesión en Payload (la invalida en el servidor, no solo borra la cookie) y vence
// la cookie del navegador.
export async function cerrarSesionEnPayload({ payload, usuario }: SesionDelPanel): Promise<void> {
  const req = await createLocalReq({ user: usuario }, payload)
  await logoutOperation({ collection: payload.collections.usuarios, req })
  await borrarCookieDeSesion(payload)
}
