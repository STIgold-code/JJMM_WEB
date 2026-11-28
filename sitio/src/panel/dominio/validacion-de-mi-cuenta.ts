import { errorDeClaveNueva } from './contrasenas'
import { ERROR_DE_FORMULARIO, esObjeto } from './formularios'
import { errorDelNombre } from './validacion-de-usuario'

// «Mi cuenta»: la persona cambia su nombre y su contraseña. El rol y el correo no se leen nunca
// de este formulario: la cuenta y su rol salen de la sesión del servidor.
export const ERROR_SIN_CLAVE_ACTUAL = 'Escribe tu contraseña actual.'
export const ERROR_CLAVES_DISTINTAS = 'Las dos contraseñas no coinciden.'
export const ERROR_CLAVE_IGUAL_A_LA_ACTUAL =
  'La contraseña nueva tiene que ser distinta de la actual.'

export type ValidacionDeNombre =
  | { valido: true; nombre: string }
  | { valido: false; errores: { general?: string; nombre?: string } }

export function validarNombrePropio(entrada: unknown): ValidacionDeNombre {
  if (!esObjeto(entrada) || typeof entrada.nombre !== 'string')
    return { valido: false, errores: { general: ERROR_DE_FORMULARIO } }
  const nombre = entrada.nombre.trim()
  const error = errorDelNombre(nombre)
  return error ? { valido: false, errores: { nombre: error } } : { valido: true, nombre }
}

export interface ErroresDeClave {
  general?: string
  actual?: string
  nueva?: string
  repetida?: string
}

export type ValidacionDeClave =
  | { valido: true; datos: { actual: string; nueva: string } }
  | { valido: false; errores: ErroresDeClave }

function erroresDeClave(actual: string, nueva: string, repetida: string): ErroresDeClave {
  const errores: ErroresDeClave = {}
  // Solo espacios cuenta como vacía: Payload la rechaza con un error de validación, no de
  // credenciales, y sin este control saldría la pantalla de error en vez del error del campo.
  if (actual.trim() === '') errores.actual = ERROR_SIN_CLAVE_ACTUAL
  const errorDeLaNueva = errorDeClaveNueva(nueva)
  if (errorDeLaNueva) errores.nueva = errorDeLaNueva
  else if (nueva === actual) errores.nueva = ERROR_CLAVE_IGUAL_A_LA_ACTUAL
  else if (nueva !== repetida) errores.repetida = ERROR_CLAVES_DISTINTAS
  return errores
}

// Las contraseñas no se recortan: los espacios son parte de ellas.
export function validarCambioDeClave(entrada: unknown): ValidacionDeClave {
  if (!esObjeto(entrada)) return { valido: false, errores: { general: ERROR_DE_FORMULARIO } }
  const { actual, nueva, repetida } = entrada
  if (typeof actual !== 'string' || typeof nueva !== 'string' || typeof repetida !== 'string')
    return { valido: false, errores: { general: ERROR_DE_FORMULARIO } }
  const errores = erroresDeClave(actual, nueva, repetida)
  if (Object.keys(errores).length > 0) return { valido: false, errores }
  return { valido: true, datos: { actual, nueva } }
}
