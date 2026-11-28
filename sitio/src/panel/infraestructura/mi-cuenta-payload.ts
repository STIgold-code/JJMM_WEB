import { AuthenticationError, LockedAuth, type Payload } from 'payload'

import type { RepositorioDeMiCuenta, VerificacionDeClave } from '../aplicacion/mi-cuenta'
import { escribirConPayload } from './errores-de-payload'
import type { SesionDelPanel } from './sesion-del-panel'

// La contraseña actual se comprueba con el ingreso real de Payload (`payload.login`, en
// `payload/dist/auth/operations/login.js`): compara con su hash (`authenticateLocalStrategy`),
// cuenta los intentos fallidos y bloquea la cuenta al llegar a `maxLoginAttempts` (5 por defecto,
// 10 minutos). El panel nunca compara hashes. Si es correcta, Payload abre una sesión que no se
// usa; la borra el cambio de contraseña que viene enseguida (ver `cambiarClave`).
async function verificarConElIngreso(
  payload: Payload,
  correo: string,
  clave: string,
): Promise<VerificacionDeClave> {
  try {
    await payload.login({ collection: 'usuarios', data: { email: correo, password: clave } })
    return 'correcta'
  } catch (error) {
    if (error instanceof LockedAuth) return 'bloqueada'
    if (error instanceof AuthenticationError) return 'incorrecta'
    throw error
  }
}

// Adaptador de «Mi cuenta». La cuenta es siempre la de la sesión del servidor (`usuario.id`);
// escribe con la Local API, `overrideAccess: false` y ese usuario, así que también rige el acceso
// de la colección (un editor solo edita su cuenta y nunca su rol). Solo se envían `nombre` o
// `password`, nunca el rol ni el correo.
export function crearRepositorioDeMiCuenta(sesion: SesionDelPanel): RepositorioDeMiCuenta {
  const { payload, usuario } = sesion
  const permisos = { overrideAccess: false, user: usuario, depth: 0 } as const
  const actualizar = (data: { nombre: string } | { password: string }) =>
    escribirConPayload(() =>
      payload.update({ collection: 'usuarios', id: usuario.id, data, ...permisos }),
    )
  return {
    guardarNombre: (nombre) => actualizar({ nombre }),
    verificarClave: (clave) => verificarConElIngreso(payload, usuario.email, clave),
    // Al guardar una contraseña, Payload (`collections/operations/utilities/update.js`) deja en la
    // cuenta solo la sesión de quien la cambia (`user._sid`): este navegador sigue dentro y las
    // demás sesiones se cierran.
    cambiarClave: (clave) => actualizar({ password: clave }),
  }
}
