import {
  type Credenciales,
  leerCredenciales,
  MENSAJE_DE_INGRESO_RECHAZADO,
} from '../dominio/ingreso'

// Caso de uso del ingreso. La autenticación real (Payload, cookie de sesión) llega por
// parámetro: así se prueba sin base de datos. `rechazado` agrupa todo lo que es culpa de las
// credenciales o del bloqueo por intentos; cualquier otro error se propaga.
export type ResultadoDeAutenticacion = 'aceptado' | 'rechazado'
export type Autenticar = (credenciales: Credenciales) => Promise<ResultadoDeAutenticacion>

export interface ResultadoDelIngreso {
  aceptado: boolean
  error: string | null
}

const RECHAZO: ResultadoDelIngreso = { aceptado: false, error: MENSAJE_DE_INGRESO_RECHAZADO }

export async function ingresar(
  correo: unknown,
  clave: unknown,
  autenticar: Autenticar,
): Promise<ResultadoDelIngreso> {
  const credenciales = leerCredenciales(correo, clave)
  if (!credenciales) return RECHAZO
  const resultado = await autenticar(credenciales)
  return resultado === 'aceptado' ? { aceptado: true, error: null } : RECHAZO
}
