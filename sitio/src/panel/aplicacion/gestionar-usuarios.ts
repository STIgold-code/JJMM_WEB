import { leerId } from '../dominio/identificadores'
import { motivoParaNoEliminar } from '../dominio/reglas-de-administradores'
import { avisoDeCuentaEliminada, ordenarUsuarios, type UsuarioDelPanel } from '../dominio/usuarios'
import type { CambiosDeCuenta, CuentaNueva } from '../dominio/validacion-de-usuario'
import { ERROR_SIN_PERMISO, type ResultadoDelRepositorio } from './gestionar-mensajes'
import type {
  RechazoDelRepositorio,
  ResultadoDeAccionRapida,
  ResultadoDeCreacion,
  ResultadoDeEscritura,
} from './resultados-de-escritura'

// Gestión de cuentas, solo del administrador: la acción exige su sesión antes de llegar aquí y el
// repositorio escribe con sus permisos, así la colección `usuarios` tiene la última palabra. Las
// reglas del último administrador y de la cuenta propia se comprueban con la lista guardada.
export interface RepositorioDeUsuarios {
  listar(): Promise<UsuarioDelPanel[]>
  crear(datos: CuentaNueva): Promise<ResultadoDeCreacion>
  guardar(id: number, datos: CambiosDeCuenta): Promise<ResultadoDeEscritura>
  eliminar(id: number): Promise<ResultadoDelRepositorio>
}

export const ERROR_DE_CUENTA_INEXISTENTE =
  'No encontramos esa cuenta. Puede que alguien la haya eliminado; recarga la página.'
export const ERROR_DE_DATOS_DE_LA_CUENTA =
  'No se pudo guardar: la cuenta tiene datos que no son válidos. Revísalos y vuelve a intentarlo.'

export function rechazoDeCuentaComoError(rechazo: RechazoDelRepositorio): string {
  if (rechazo.estado === 'no-encontrado') return ERROR_DE_CUENTA_INEXISTENTE
  if (rechazo.estado === 'prohibido') return ERROR_SIN_PERMISO
  return ERROR_DE_DATOS_DE_LA_CUENTA
}

export async function obtenerUsuarios(
  repositorio: Pick<RepositorioDeUsuarios, 'listar'>,
): Promise<UsuarioDelPanel[]> {
  return ordenarUsuarios(await repositorio.listar())
}

const fallo = (error: string): ResultadoDeAccionRapida => ({ ok: false, error })

// `actor`: la cuenta de la sesión del servidor, nunca un dato del navegador.
export async function eliminarUsuario(
  repositorio: RepositorioDeUsuarios,
  entrada: { id: unknown; actor: number },
): Promise<ResultadoDeAccionRapida> {
  const id = leerId(entrada.id)
  if (id === null) return fallo(ERROR_DE_CUENTA_INEXISTENTE)
  const cuentas = await repositorio.listar()
  if (!cuentas.some((cuenta) => cuenta.id === id)) return fallo(ERROR_DE_CUENTA_INEXISTENTE)
  const motivo = motivoParaNoEliminar(cuentas, { objetivo: id, actor: entrada.actor })
  if (motivo) return fallo(motivo)
  const escritura = await repositorio.eliminar(id)
  if (escritura.estado !== 'hecho') return fallo(rechazoDeCuentaComoError(escritura))
  return { ok: true, aviso: avisoDeCuentaEliminada(escritura.nombre) }
}
