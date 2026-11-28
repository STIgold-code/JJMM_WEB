import { leerId } from '../dominio/identificadores'
import { motivoParaNoCambiarElRol } from '../dominio/reglas-de-administradores'
import type { Aviso } from '../dominio/respuesta-al-mensaje'
import { avisoDeCuentaCreada, avisoDeCuentaGuardada } from '../dominio/usuarios'
import {
  type ErroresDeUsuario,
  validarCambiosDeCuenta,
  validarCuentaNueva,
} from '../dominio/validacion-de-usuario'
import {
  ERROR_DE_CUENTA_INEXISTENTE,
  rechazoDeCuentaComoError,
  type RepositorioDeUsuarios,
} from './gestionar-usuarios'
import type { RechazoDelRepositorio } from './resultados-de-escritura'

// Crear una cuenta y editar la de otra persona (nombre, correo, rol y, si se escribe, una
// contraseña nueva). Nunca se devuelve ni se registra la contraseña.
export type EstadoDelFormularioDeUsuario =
  | { estado: 'guardado'; aviso: Aviso }
  | { estado: 'invalido'; errores: ErroresDeUsuario }
  | { estado: 'error'; error: string }

export const ERROR_DE_CORREO_REPETIDO = 'Ya existe una cuenta con ese correo.'
export const ERROR_TU_PROPIA_CUENTA =
  'Tu propia cuenta se cambia en «Mi cuenta», donde se pide tu contraseña actual.'

// Lo que la colección rechazó (400), junto a su campo. El correo ya pasó la regla de Payload, así
// que si la colección lo rechaza es porque otra cuenta lo usa (es único).
const MENSAJES_POR_CAMPO: Readonly<Record<string, ErroresDeUsuario>> = {
  email: { correo: ERROR_DE_CORREO_REPETIDO },
  nombre: { nombre: 'Revisa el nombre.' },
  rol: { rol: 'Revisa el rol.' },
  password: { clave: 'Payload no aceptó esta contraseña. Prueba con otra.' },
}

function estadoDelRechazo(rechazo: RechazoDelRepositorio): EstadoDelFormularioDeUsuario {
  const campos = rechazo.estado === 'invalido' ? rechazo.campos : []
  const errores = campos.reduce<ErroresDeUsuario>(
    (acumulados, campo) => ({ ...acumulados, ...MENSAJES_POR_CAMPO[campo] }),
    {},
  )
  if (Object.keys(errores).length > 0) return { estado: 'invalido', errores }
  return { estado: 'error', error: rechazoDeCuentaComoError(rechazo) }
}

export async function crearUsuario(
  repositorio: RepositorioDeUsuarios,
  formulario: unknown,
): Promise<EstadoDelFormularioDeUsuario> {
  const validacion = validarCuentaNueva(formulario)
  if (!validacion.valido) return { estado: 'invalido', errores: validacion.errores }
  const escritura = await repositorio.crear(validacion.datos)
  if (escritura.estado !== 'hecho') return estadoDelRechazo(escritura)
  return { estado: 'guardado', aviso: avisoDeCuentaCreada(validacion.datos.nombre) }
}

// `actor`: la cuenta de la sesión del servidor. Su propia cuenta no se edita aquí: la contraseña
// propia solo cambia con la actual («Mi cuenta»).
export async function guardarUsuario(
  repositorio: RepositorioDeUsuarios,
  entrada: { id: unknown; formulario: unknown; actor: number },
): Promise<EstadoDelFormularioDeUsuario> {
  const id = leerId(entrada.id)
  if (id === null) return { estado: 'error', error: ERROR_DE_CUENTA_INEXISTENTE }
  if (id === entrada.actor) return { estado: 'error', error: ERROR_TU_PROPIA_CUENTA }
  const validacion = validarCambiosDeCuenta(entrada.formulario)
  if (!validacion.valido) return { estado: 'invalido', errores: validacion.errores }
  const { datos } = validacion
  const cuentas = await repositorio.listar()
  if (!cuentas.some((cuenta) => cuenta.id === id))
    return { estado: 'error', error: ERROR_DE_CUENTA_INEXISTENTE }
  const cambio = { objetivo: id, actor: entrada.actor, rolNuevo: datos.rol }
  const motivo = motivoParaNoCambiarElRol(cuentas, cambio)
  if (motivo) return { estado: 'invalido', errores: { rol: motivo } }
  const escritura = await repositorio.guardar(id, datos)
  if (escritura.estado !== 'hecho') return estadoDelRechazo(escritura)
  return { estado: 'guardado', aviso: avisoDeCuentaGuardada(datos.nombre, datos.clave !== null) }
}
