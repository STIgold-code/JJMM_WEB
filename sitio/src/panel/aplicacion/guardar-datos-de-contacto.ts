import { leerIdDeMensaje } from '../dominio/mensajes'
import {
  type Aviso,
  type DatosDeContacto,
  ERROR_DE_CELULAR,
  ERROR_DE_CORREO,
  type ErroresDeContacto,
  validarDatosDeContacto,
} from '../dominio/respuesta-al-mensaje'
import {
  ERROR_DE_MENSAJE_INEXISTENTE,
  type RepositorioDeEscrituraDeMensajes,
  type ResultadoDelRepositorio,
  resultadoDeEscritura,
} from './gestionar-mensajes'

// Estado del formulario «Datos de contacto» del panel lateral (`useActionState`). Al guardar
// devuelve los datos ya normalizados, para mostrarlos tal como quedaron.
export type EstadoDeDatosDeContacto =
  | { estado: 'inicial' }
  | { estado: 'guardado'; aviso: Aviso; datos: DatosDeContacto }
  | { estado: 'invalido'; errores: ErroresDeContacto }
  | { estado: 'error'; error: string }

export const ESTADO_INICIAL_DE_CONTACTO: EstadoDeDatosDeContacto = { estado: 'inicial' }

const AVISO_DE_GUARDADO: Aviso = { titulo: 'Datos de contacto guardados' }

// Si la colección rechaza celular o correo, el error va junto a ese campo (con el texto del
// panel). Si rechaza otro campo, no hay dónde mostrarlo y queda como aviso general.
function erroresDeLaColeccion(campos: readonly string[]): ErroresDeContacto | null {
  const errores: ErroresDeContacto = {}
  if (campos.includes('celular')) errores.celular = ERROR_DE_CELULAR
  if (campos.includes('correo')) errores.correo = ERROR_DE_CORREO
  return Object.keys(errores).length > 0 ? errores : null
}

function aEstado(
  escritura: ResultadoDelRepositorio,
  datos: DatosDeContacto,
): EstadoDeDatosDeContacto {
  const errores = escritura.estado === 'invalido' ? erroresDeLaColeccion(escritura.campos) : null
  if (errores) return { estado: 'invalido', errores }
  const resultado = resultadoDeEscritura(escritura, () => AVISO_DE_GUARDADO)
  return resultado.ok
    ? { estado: 'guardado', aviso: resultado.aviso, datos }
    : { estado: 'error', error: resultado.error }
}

// Celular y correo que el equipo anota al responder. Solo se escriben esos dos campos.
export async function guardarDatosDeContacto(
  repositorio: RepositorioDeEscrituraDeMensajes,
  entrada: { id: unknown; celular: unknown; correo: unknown },
): Promise<EstadoDeDatosDeContacto> {
  const id = leerIdDeMensaje(entrada.id)
  if (id === null) return { estado: 'error', error: ERROR_DE_MENSAJE_INEXISTENTE }
  const validacion = validarDatosDeContacto(entrada)
  if (!validacion.valido) return { estado: 'invalido', errores: validacion.errores }
  return aEstado(await repositorio.actualizar(id, validacion.datos), validacion.datos)
}
