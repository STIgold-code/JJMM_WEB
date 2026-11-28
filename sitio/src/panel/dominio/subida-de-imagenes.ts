// Reglas de la subida de imágenes. Todo lo que llega del navegador se trata como hostil: el tipo
// sale del contenido del archivo (sus primeros bytes), nunca del nombre ni del tipo que declara el
// navegador; el nombre se limpia y lleva la extensión del tipo real.
export const TAMANO_MAXIMO_DE_IMAGEN = 10 * 1024 * 1024
export const LARGO_MAXIMO_DEL_ALT = 300

export const ERROR_DE_TIPO = 'Solo se aceptan imágenes JPG, PNG, WebP o AVIF.'
export const ERROR_DE_ARCHIVO_GRANDE =
  'La imagen pesa más de 10 MB. Redúcela y vuelve a intentarlo.'
export const ERROR_DE_ARCHIVO_VACIO = 'Elige una imagen para subir.'
export const ERROR_DE_ALT_VACIO =
  'Describe la imagen en una frase. Si es un logotipo, escribe el nombre de la empresa.'
export const ERROR_DE_ALT_LARGO = `El texto alternativo admite hasta ${LARGO_MAXIMO_DEL_ALT} caracteres.`

export interface TipoDeImagen {
  mime: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif'
  extension: 'jpg' | 'png' | 'webp' | 'avif'
}

export const TIPOS_DE_IMAGEN: readonly TipoDeImagen[] = [
  { mime: 'image/jpeg', extension: 'jpg' },
  { mime: 'image/png', extension: 'png' },
  { mime: 'image/webp', extension: 'webp' },
  { mime: 'image/avif', extension: 'avif' },
]

const tipo = (mime: TipoDeImagen['mime']): TipoDeImagen =>
  TIPOS_DE_IMAGEN.find((t) => t.mime === mime) ?? { mime, extension: 'jpg' }

const empiezaCon = (bytes: Uint8Array, firma: readonly number[], desde = 0): boolean =>
  firma.every((byte, indice) => bytes[desde + indice] === byte)

const ascii = (texto: string): number[] => [...texto].map((letra) => letra.charCodeAt(0))

const FIRMA_PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
const FIRMA_JPEG = [0xff, 0xd8, 0xff]
// AVIF es un contenedor ISO BMFF: `ftyp` en el byte 4 y la marca `avif` (o `avis`) en el 8.
const esAvif = (bytes: Uint8Array): boolean =>
  empiezaCon(bytes, ascii('ftyp'), 4) &&
  (empiezaCon(bytes, ascii('avif'), 8) || empiezaCon(bytes, ascii('avis'), 8))

export function tipoRealDeImagen(bytes: Uint8Array): TipoDeImagen | null {
  if (empiezaCon(bytes, FIRMA_PNG)) return tipo('image/png')
  if (empiezaCon(bytes, FIRMA_JPEG)) return tipo('image/jpeg')
  if (empiezaCon(bytes, ascii('RIFF')) && empiezaCon(bytes, ascii('WEBP'), 8))
    return tipo('image/webp')
  if (esAvif(bytes)) return tipo('image/avif')
  return null
}

const NOMBRE_POR_DEFECTO = 'imagen'
const LARGO_MAXIMO_DEL_NOMBRE = 120

// Solo el último tramo de la ruta, sin la extensión que trae, con la del tipo real. Payload
// vuelve a limpiar el nombre y le agrega un sufijo si ya existe.
export function nombreConExtension(nombre: string, extension: string): string {
  const ultimo = nombre.split(/[\\/]/).pop() ?? ''
  const punto = ultimo.lastIndexOf('.')
  const base = (punto >= 0 ? ultimo.slice(0, punto) : ultimo)
    .trim()
    .slice(0, LARGO_MAXIMO_DEL_NOMBRE)
  return `${base || NOMBRE_POR_DEFECTO}.${extension}`
}

export type ValidacionDelAlt = { valido: true; alt: string } | { valido: false; error: string }

// La colección exige el texto alternativo (WCAG 1.1.1): se pide al subir, no después.
export function validarTextoAlternativo(valor: unknown): ValidacionDelAlt {
  const alt = typeof valor === 'string' ? valor.trim() : ''
  if (!alt) return { valido: false, error: ERROR_DE_ALT_VACIO }
  if (alt.length > LARGO_MAXIMO_DEL_ALT) return { valido: false, error: ERROR_DE_ALT_LARGO }
  return { valido: true, alt }
}

export interface ErroresDeSubida {
  archivo?: string
  alt?: string
  general?: string
}

export interface SubidaValidada {
  bytes: Uint8Array
  nombre: string
  mime: TipoDeImagen['mime']
  alt: string
}

export type ValidacionDeSubida =
  { valido: true; datos: SubidaValidada } | { valido: false; errores: ErroresDeSubida }

function errorDelArchivo(bytes: Uint8Array): string | null {
  if (bytes.length === 0) return ERROR_DE_ARCHIVO_VACIO
  if (bytes.length > TAMANO_MAXIMO_DE_IMAGEN) return ERROR_DE_ARCHIVO_GRANDE
  return tipoRealDeImagen(bytes) ? null : ERROR_DE_TIPO
}

export function validarSubida(entrada: {
  bytes: Uint8Array
  nombre: string
  alt: unknown
}): ValidacionDeSubida {
  const archivo = errorDelArchivo(entrada.bytes)
  const alt = validarTextoAlternativo(entrada.alt)
  const real = archivo ? null : tipoRealDeImagen(entrada.bytes)
  if (!real || !alt.valido) {
    const errores: ErroresDeSubida = {}
    if (archivo) errores.archivo = archivo
    if (!alt.valido) errores.alt = alt.error
    return { valido: false, errores }
  }
  const nombre = nombreConExtension(entrada.nombre, real.extension)
  return { valido: true, datos: { bytes: entrada.bytes, nombre, mime: real.mime, alt: alt.alt } }
}

// Defensa contra CSRF del manejador de subida (las acciones de servidor la traen de Next; un
// manejador de ruta no): el navegador manda `Origin` en todo POST y tiene que ser este sitio.
export function esDelMismoOrigen(cabeceras: {
  origen: string | null
  host: string | null
  hostReenviado?: string | null
}): boolean {
  const host = cabeceras.hostReenviado?.split(',')[0]?.trim() || cabeceras.host
  if (!cabeceras.origen || !host) return false
  try {
    return new URL(cabeceras.origen).host === host
  } catch {
    return false
  }
}
