import type { RespuestaDeSubida } from '../dominio/selector-de-imagen'
import { type ErroresDeSubida, validarSubida } from '../dominio/subida-de-imagenes'
import type { RepositorioDeEscrituraDeImagenes } from './gestionar-imagenes'
import { ERROR_SIN_PERMISO } from './gestionar-mensajes'
import type { RechazoDelRepositorio } from './resultados-de-escritura'

export const ERROR_DE_ARCHIVO_RECHAZADO =
  'El archivo no es una imagen válida o está dañado. Prueba con otra.'
export const ERROR_DE_SUBIDA = 'No se pudo guardar la imagen. Vuelve a intentarlo.'

// Lo que Payload rechazó (un 400) vuelve junto a su campo: `file` es el archivo (por ejemplo, una
// imagen dañada que `sharp` no puede leer) y `alt`, el texto alternativo.
function erroresDelRechazo(campos: readonly string[]): ErroresDeSubida {
  const errores: ErroresDeSubida = {}
  if (campos.some((campo) => campo === 'file' || campo === 'filename'))
    errores.archivo = ERROR_DE_ARCHIVO_RECHAZADO
  if (campos.includes('alt')) errores.alt = 'Revisa el texto alternativo.'
  return Object.keys(errores).length > 0 ? errores : { general: ERROR_DE_SUBIDA }
}

function respuestaDelRechazo(rechazo: RechazoDelRepositorio): RespuestaDeSubida {
  if (rechazo.estado === 'invalido')
    return { estado: 'invalido', errores: erroresDelRechazo(rechazo.campos) }
  if (rechazo.estado === 'prohibido') return { estado: 'error', error: ERROR_SIN_PERMISO }
  return { estado: 'error', error: ERROR_DE_SUBIDA }
}

// Subir una imagen desde el panel: el archivo y su texto alternativo se validan aquí (tipo real
// por contenido, tamaño, nombre) antes de llegar a Payload.
export async function subirImagen(
  repositorio: Pick<RepositorioDeEscrituraDeImagenes, 'subir'>,
  entrada: { bytes: Uint8Array; nombre: string; alt: unknown },
): Promise<RespuestaDeSubida> {
  const validacion = validarSubida(entrada)
  if (!validacion.valido) return { estado: 'invalido', errores: validacion.errores }
  const subida = await repositorio.subir(validacion.datos)
  if (subida.estado === 'hecho') return { estado: 'subida', imagen: subida.imagen }
  return respuestaDelRechazo(subida)
}
