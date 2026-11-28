import { esObjeto } from './formularios'
import { leerId } from './identificadores'
import {
  ERROR_DE_ARCHIVO_GRANDE,
  ERROR_DE_TIPO,
  type ErroresDeSubida,
  TAMANO_MAXIMO_DE_IMAGEN,
  TIPOS_DE_IMAGEN,
} from './subida-de-imagenes'

// Una imagen elegida en un campo del panel (`SelectorDeImagen`): el id que se guarda y lo que
// hace falta para mostrar su miniatura.
export interface ImagenElegida {
  id: number
  url: string
  alt: string
  nombre: string
  ancho: number | null
  alto: number | null
}

// Archivos de `medios`, en disco o en Wasabi siempre por esta ruta (la que permite `next/image`).
const PREFIJO_DE_MEDIOS = '/api/medios/file/'

export function esUrlDeMedio(url: unknown): url is string {
  return typeof url === 'string' && url.startsWith(PREFIJO_DE_MEDIOS) && !url.includes('..')
}

const medida = (valor: unknown): number | null =>
  typeof valor === 'number' && Number.isFinite(valor) && valor > 0 ? valor : null

export function leerImagenElegida(valor: unknown): ImagenElegida | null {
  if (!esObjeto(valor)) return null
  const id = leerId(valor.id)
  const { url, alt, nombre } = valor
  if (id === null || !esUrlDeMedio(url) || typeof alt !== 'string' || typeof nombre !== 'string')
    return null
  return { id, url, alt, nombre, ancho: medida(valor.ancho), alto: medida(valor.alto) }
}

export type RespuestaDeSubida =
  | { estado: 'subida'; imagen: ImagenElegida }
  | { estado: 'invalido'; errores: ErroresDeSubida }
  | { estado: 'error'; error: string }

export const ERROR_DE_RESPUESTA =
  'No se pudo subir la imagen. Revisa tu conexión y vuelve a intentarlo.'

const CAMPOS_DE_ERROR = ['archivo', 'alt', 'general'] as const

function leerErrores(valor: unknown): ErroresDeSubida {
  if (!esObjeto(valor)) return {}
  const errores: ErroresDeSubida = {}
  for (const campo of CAMPOS_DE_ERROR) {
    const texto = valor[campo]
    if (typeof texto === 'string') errores[campo] = texto
  }
  return errores
}

// Respuesta del manejador de subida, leída en el navegador como `unknown`: una red caída, un
// proxy o una página de error no rompen la pantalla, se muestran como un error.
export function leerRespuestaDeSubida(cuerpo: unknown): RespuestaDeSubida {
  const error = { estado: 'error', error: ERROR_DE_RESPUESTA } as const
  if (!esObjeto(cuerpo)) return error
  if (cuerpo.estado === 'subida') {
    const imagen = leerImagenElegida(cuerpo.imagen)
    return imagen ? { estado: 'subida', imagen } : error
  }
  if (cuerpo.estado === 'invalido')
    return { estado: 'invalido', errores: leerErrores(cuerpo.errores) }
  if (cuerpo.estado === 'error' && typeof cuerpo.error === 'string')
    return { estado: 'error', error: cuerpo.error }
  return error
}

// Aviso inmediato en el navegador con lo que declara el archivo; el servidor vuelve a validar
// con el contenido real.
export function prevalidarArchivo(archivo: { tamano: number; tipo: string }): string | null {
  if (archivo.tamano > TAMANO_MAXIMO_DE_IMAGEN) return ERROR_DE_ARCHIVO_GRANDE
  if (!TIPOS_DE_IMAGEN.some(({ mime }) => mime === archivo.tipo)) return ERROR_DE_TIPO
  return null
}

export const TIPOS_ACEPTADOS = TIPOS_DE_IMAGEN.map(({ mime }) => mime).join(',')

export function puedeQuitarImagen(estado: {
  opcional: boolean
  valor: ImagenElegida | null
}): boolean {
  return estado.opcional && estado.valor !== null
}

export function resumenDeImagen(imagen: Pick<ImagenElegida, 'ancho' | 'alto'>): string {
  if (!imagen.ancho || !imagen.alto) return 'Medidas desconocidas'
  return `${imagen.ancho} × ${imagen.alto} px`
}

const KB = 1024
const MB = KB * 1024

export function tamanoLegible(bytes: number): string {
  if (bytes < MB) return `${Math.max(1, Math.round(bytes / KB))} KB`
  return `${(bytes / MB).toFixed(1).replace('.', ',')} MB`
}
