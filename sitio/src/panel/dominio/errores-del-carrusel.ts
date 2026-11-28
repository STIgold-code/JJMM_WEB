// Errores del formulario del carrusel: los de cada portada van por su posición en la lista, y
// los de cada botón, por su posición dentro de la portada.
export interface ErroresDeBoton {
  etiqueta?: string
  mensaje?: string
  destino?: string
}

export interface ErroresDePortada {
  imagen?: string
  imagenParaCelular?: string
  sello?: string
  encuadre?: string
  titulo?: string
  subtitulo?: string
  lista?: string
  botones?: string
  boton?: Record<number, ErroresDeBoton>
}

export interface ErroresDelCarrusel {
  general?: string
  segundos?: string
  portadas?: string
  portada?: Record<number, ErroresDePortada>
}

export const ERROR_SIN_PORTADAS =
  'El carrusel necesita al menos una portada: sin ninguna, el inicio se queda sin su imagen principal ni su título.'
export const ERROR_DEMASIADAS_PORTADAS = 'Usa hasta 12 portadas.'
export const ERROR_DE_SEGUNDOS = 'Elige entre 3 y 30 segundos.'
export const ERROR_SIN_IMAGEN = 'Elige la imagen de la portada.'
export const ERROR_IMAGEN_INEXISTENTE = 'Esa imagen ya no está en «Imágenes». Elige otra.'
export const ERROR_DE_ENCUADRE = 'El encuadre va de 0 a 100.'
export const ERROR_SUBTITULO_LARGO = 'Es demasiado largo: usa hasta 500 caracteres.'
export const ERROR_DE_LISTA = 'Usa hasta 8 puntos, de hasta 200 caracteres cada uno.'
export const ERROR_ETIQUETA_VACIA = 'Escribe el texto del botón.'
export const ERROR_ETIQUETA_LARGA = 'Usa hasta 60 caracteres.'
export const ERROR_MENSAJE_LARGO = 'Es demasiado largo: usa hasta 500 caracteres.'
export const ERROR_DESTINO_VACIO = 'Escribe a dónde lleva el botón, por ejemplo #planes.'
export const ERROR_DE_DESTINO =
  'Revisa a dónde lleva el botón, por ejemplo #planes, /guia o https://…'
const ERROR_DE_CAMPO = 'Revisa este campo.'

// Texto del panel para cada campo de una portada que la colección rechazó.
const POR_CAMPO_DE_PORTADA: Readonly<Record<string, keyof ErroresDePortada>> = {
  imagen: 'imagen',
  imagenParaCelular: 'imagenParaCelular',
  sello: 'sello',
  encuadreEnCelular: 'encuadre',
  titulo: 'titulo',
  subtitulo: 'subtitulo',
  lista: 'lista',
  acciones: 'botones',
}

const MENSAJE_DE_CAMPO: Partial<Record<keyof ErroresDePortada, string>> = {
  imagen: ERROR_IMAGEN_INEXISTENTE,
  imagenParaCelular: ERROR_IMAGEN_INEXISTENTE,
  sello: ERROR_IMAGEN_INEXISTENTE,
  encuadre: ERROR_DE_ENCUADRE,
  lista: ERROR_DE_LISTA,
}

const CAMPO_DE_BOTON = /^portadas\.(\d+)\.acciones\.(\d+)\.(etiqueta|mensaje|destino)$/
const CAMPO_DE_PORTADA = /^portadas\.(\d+)\.(\w+)/

function errorDeBoton(ruta: string): Record<number, ErroresDePortada> | null {
  const [, portada, boton, campo] = CAMPO_DE_BOTON.exec(ruta) ?? []
  if (!portada || !boton || !campo) return null
  const texto = campo === 'destino' ? ERROR_DE_DESTINO : ERROR_DE_CAMPO
  return { [Number(portada)]: { boton: { [Number(boton)]: { [campo]: texto } } } }
}

function errorDePortada(ruta: string): Record<number, ErroresDePortada> | null {
  const [, portada, campo] = CAMPO_DE_PORTADA.exec(ruta) ?? []
  const clave = campo ? POR_CAMPO_DE_PORTADA[campo] : undefined
  if (!portada || !clave) return null
  return { [Number(portada)]: { [clave]: MENSAJE_DE_CAMPO[clave] ?? ERROR_DE_CAMPO } }
}

function unirPortadas(
  actuales: Record<number, ErroresDePortada> | undefined,
  nuevas: Record<number, ErroresDePortada>,
): Record<number, ErroresDePortada> {
  const unidas = { ...actuales }
  for (const [indice, errores] of Object.entries(nuevas)) {
    const previos = unidas[Number(indice)]
    unidas[Number(indice)] = {
      ...previos,
      ...errores,
      boton: { ...previos?.boton, ...errores.boton },
    }
    if (Object.keys(unidas[Number(indice)]?.boton ?? {}).length === 0)
      delete unidas[Number(indice)]?.boton
  }
  return unidas
}

function errorDeRuta(ruta: string): ErroresDelCarrusel | null {
  if (ruta === 'segundosPorPortada') return { segundos: ERROR_DE_SEGUNDOS }
  if (ruta === 'portadas') return { portadas: ERROR_SIN_PORTADAS }
  const portada = errorDeBoton(ruta) ?? errorDePortada(ruta)
  return portada ? { portada } : null
}

// Lo que la colección rechazó (un 400), con rutas relativas al bloque del carrusel
// (`portadas.1.imagen`). Una ruta que el panel no conoce no tiene dónde mostrarse: `null`.
export function erroresDePayloadDelCarrusel(rutas: readonly string[]): ErroresDelCarrusel | null {
  let errores: ErroresDelCarrusel = {}
  for (const ruta of rutas) {
    const error = errorDeRuta(ruta)
    if (!error) continue
    const { portada, ...resto } = error
    errores = { ...errores, ...resto }
    if (portada) errores.portada = unirPortadas(errores.portada, portada)
  }
  return Object.keys(errores).length > 0 ? errores : null
}

// Índice de la primera portada con errores, para abrirla en el editor.
export function primeraPortadaConErrores(errores: ErroresDelCarrusel): number | null {
  const indices = Object.keys(errores.portada ?? {}).map(Number)
  return indices.length > 0 ? Math.min(...indices) : null
}
