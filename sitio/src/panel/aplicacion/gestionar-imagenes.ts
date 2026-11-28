import type { Rol } from '@/compartido/dominio/roles'

import { esObjeto } from '../dominio/formularios'
import { leerId } from '../dominio/identificadores'
import { puedeEliminarImagenes } from '../dominio/imagenes'
import type { ImagenElegida } from '../dominio/selector-de-imagen'
import type { SubidaValidada } from '../dominio/subida-de-imagenes'
import { validarTextoAlternativo } from '../dominio/subida-de-imagenes'
import type { UsoDeImagen } from '../dominio/usos-de-imagenes'
import { ERROR_SIN_PERMISO, type ResultadoDelRepositorio } from './gestionar-mensajes'
import {
  type EstadoDelGuardado,
  estadoDelRechazo,
  type RechazoDelRepositorio,
  type ResultadoDeAccionRapida,
  textoDelRechazo,
  type TextosDeRechazo,
} from './resultados-de-escritura'

// Escrituras sobre la biblioteca de imágenes. Todo lo que llega del navegador es `unknown` y se
// valida aquí; el repositorio escribe con los permisos de la sesión.
export interface RepositorioDeEscrituraDeImagenes {
  // Todo lo que hoy apunta a esa imagen (colecciones, globales, bloques y contenido).
  usosDe(id: number): Promise<UsoDeImagen[]>
  subir(
    datos: SubidaValidada,
  ): Promise<{ estado: 'hecho'; imagen: ImagenElegida } | RechazoDelRepositorio>
  // `nombre`: el nombre del archivo, para el aviso.
  guardarTextoAlternativo(id: number, alt: string): Promise<ResultadoDelRepositorio>
  eliminar(id: number): Promise<ResultadoDelRepositorio>
}

export const ERROR_DE_IMAGEN_INEXISTENTE =
  'No encontramos esa imagen. Puede que alguien la haya eliminado; recarga la página.'
export const ERROR_DE_DATOS_DE_IMAGEN =
  'No se pudo guardar: la imagen tiene datos que no son válidos. Recarga la página e inténtalo de nuevo.'

export const TEXTOS_DE_RECHAZO_DE_IMAGENES: TextosDeRechazo = {
  inexistente: ERROR_DE_IMAGEN_INEXISTENTE,
  invalido: ERROR_DE_DATOS_DE_IMAGEN,
}

// Borrar una imagen en uso dejaría vacío un campo (a veces obligatorio) y rompería el sitio: la
// base pone esa referencia en nulo sin avisar. Primero hay que reemplazarla donde se usa.
export function errorDeImagenEnUso(usos: readonly UsoDeImagen[]): string {
  const lugares = usos.map((uso) => uso.texto).join('; ')
  const cuantos = usos.length === 1 ? 'un lugar' : `${usos.length} lugares`
  return `No se puede eliminar: la imagen se usa en ${cuantos} (${lugares}). Reemplázala allí primero.`
}

export interface ErroresDeImagen {
  alt?: string
  general?: string
}

const fallo = (error: string): ResultadoDeAccionRapida => ({ ok: false, error })

// El rol sale de la sesión del servidor, nunca del navegador.
export async function eliminarImagen(
  repositorio: RepositorioDeEscrituraDeImagenes,
  entrada: { id: unknown; rol: Rol },
): Promise<ResultadoDeAccionRapida> {
  if (!puedeEliminarImagenes(entrada.rol)) return fallo(ERROR_SIN_PERMISO)
  const id = leerId(entrada.id)
  if (id === null) return fallo(ERROR_DE_IMAGEN_INEXISTENTE)
  const usos = await repositorio.usosDe(id)
  if (usos.length > 0) return fallo(errorDeImagenEnUso(usos))
  const escritura = await repositorio.eliminar(id)
  if (escritura.estado !== 'hecho')
    return fallo(textoDelRechazo(escritura, TEXTOS_DE_RECHAZO_DE_IMAGENES))
  return {
    ok: true,
    aviso: { titulo: 'Imagen eliminada', detalle: `Se borró «${escritura.nombre}».` },
  }
}

const erroresDelCampo = (campo: string): ErroresDeImagen | undefined =>
  campo === 'alt' ? { alt: 'Revisa el texto alternativo.' } : undefined

export async function guardarTextoAlternativo(
  repositorio: RepositorioDeEscrituraDeImagenes,
  entrada: { id: unknown; formulario: unknown },
): Promise<EstadoDelGuardado<ErroresDeImagen>> {
  const id = leerId(entrada.id)
  if (id === null) return { estado: 'error', error: ERROR_DE_IMAGEN_INEXISTENTE }
  const alt = validarTextoAlternativo(esObjeto(entrada.formulario) ? entrada.formulario.alt : null)
  if (!alt.valido) return { estado: 'invalido', errores: { alt: alt.error } }
  const escritura = await repositorio.guardarTextoAlternativo(id, alt.alt)
  if (escritura.estado !== 'hecho')
    return estadoDelRechazo(escritura, erroresDelCampo, TEXTOS_DE_RECHAZO_DE_IMAGENES)
  return {
    estado: 'guardado',
    aviso: {
      titulo: 'Texto guardado',
      detalle: `«${escritura.nombre}» ya lo muestra en el sitio.`,
    },
  }
}
