import type { Aviso } from '../dominio/respuesta-al-mensaje'
import {
  type ErroresDeClave,
  validarCambioDeClave,
  validarNombrePropio,
} from '../dominio/validacion-de-mi-cuenta'
import type { ResultadoDeEscritura } from './resultados-de-escritura'

// «Mi cuenta»: cualquier cuenta del equipo cambia su nombre y su contraseña. El repositorio está
// atado a la cuenta de la sesión del servidor: ningún dato del navegador elige a quién se escribe.
export type VerificacionDeClave = 'correcta' | 'incorrecta' | 'bloqueada'

export interface RepositorioDeMiCuenta {
  guardarNombre(nombre: string): Promise<ResultadoDeEscritura>
  // Comprueba la contraseña con el ingreso de Payload (cuenta los intentos y bloquea la cuenta).
  verificarClave(clave: string): Promise<VerificacionDeClave>
  cambiarClave(clave: string): Promise<ResultadoDeEscritura>
}

export const ERROR_CLAVE_ACTUAL_INCORRECTA = 'La contraseña actual no es correcta.'
export const ERROR_CUENTA_BLOQUEADA =
  'Hubo demasiados intentos con una contraseña equivocada. Espera 10 minutos e inténtalo de nuevo.'
export const ERROR_AL_GUARDAR_LA_CUENTA =
  'No se pudo guardar. Recarga la página e inténtalo de nuevo.'

export type EstadoDeMiNombre =
  | { estado: 'guardado'; aviso: Aviso }
  | { estado: 'invalido'; errores: { general?: string; nombre?: string } }
  | { estado: 'error'; error: string }

export type EstadoDelCambioDeClave =
  | { estado: 'cambiada'; aviso: Aviso }
  | { estado: 'invalido'; errores: ErroresDeClave }
  | { estado: 'error'; error: string }

export async function guardarMiNombre(
  repositorio: RepositorioDeMiCuenta,
  formulario: unknown,
): Promise<EstadoDeMiNombre> {
  const validacion = validarNombrePropio(formulario)
  if (!validacion.valido) return { estado: 'invalido', errores: validacion.errores }
  const escritura = await repositorio.guardarNombre(validacion.nombre)
  if (escritura.estado !== 'hecho') return { estado: 'error', error: ERROR_AL_GUARDAR_LA_CUENTA }
  return {
    estado: 'guardado',
    aviso: { titulo: 'Cambios guardados', detalle: 'Tu nombre ya aparece en el menú.' },
  }
}

// La contraseña nueva solo se guarda si la actual es correcta. Payload cierra al guardarla las
// demás sesiones de la cuenta y conserva la de este navegador.
export async function cambiarMiClave(
  repositorio: RepositorioDeMiCuenta,
  formulario: unknown,
): Promise<EstadoDelCambioDeClave> {
  const validacion = validarCambioDeClave(formulario)
  if (!validacion.valido) return { estado: 'invalido', errores: validacion.errores }
  const verificacion = await repositorio.verificarClave(validacion.datos.actual)
  if (verificacion === 'incorrecta')
    return { estado: 'invalido', errores: { actual: ERROR_CLAVE_ACTUAL_INCORRECTA } }
  if (verificacion === 'bloqueada') return { estado: 'error', error: ERROR_CUENTA_BLOQUEADA }
  const escritura = await repositorio.cambiarClave(validacion.datos.nueva)
  if (escritura.estado !== 'hecho') return { estado: 'error', error: ERROR_AL_GUARDAR_LA_CUENTA }
  return {
    estado: 'cambiada',
    aviso: {
      titulo: 'Contraseña cambiada',
      detalle: 'Úsala la próxima vez que ingreses. Se cerraron tus sesiones en otros equipos.',
    },
  }
}
