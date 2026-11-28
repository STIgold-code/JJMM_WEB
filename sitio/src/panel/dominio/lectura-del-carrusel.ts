import {
  type BotonGuardado,
  DISPOSICIONES,
  ESTILOS_DE_BOTON,
  MAXIMO_DE_BOTONES,
  type PortadaGuardada,
  TIPOS_DE_BOTON,
  TRANSICIONES,
} from './carrusel-de-portadas'
import { esObjeto } from './formularios'
import { leerId } from './identificadores'
import { leerMarcaDeTiempo } from './secciones-de-inicio'

// Lectura en el servidor de la FORMA del formulario del carrusel, que llega del navegador sin
// tipar. Solo se toman los campos del bloque; lo demás se ignora. Cualquier tipo inesperado (un
// valor fuera de las opciones, una imagen sin id válido) hace que el formulario entero no se lea.
export interface BotonLeido extends Omit<BotonGuardado, 'mensaje' | 'destino'> {
  mensaje: string
  destino: string
}

export interface PortadaLeida extends Omit<
  PortadaGuardada,
  'imagen' | 'imagenParaCelular' | 'sello' | 'titulo' | 'subtitulo' | 'lista' | 'botones'
> {
  imagen: number | null
  imagenParaCelular: number | null
  sello: number | null
  titulo: string
  subtitulo: string
  lista: string
  botones: BotonLeido[]
}

export interface CarruselLeido {
  seccion: string
  actualizadoEn: string
  segundosPorPortada: string
  portadas: PortadaLeida[]
}

const PATRON_DE_SECCION = /^[\w-]{1,64}$/

const opcion = <T extends string>(opciones: readonly T[], valor: unknown): T | null =>
  opciones.find((o) => o === valor) ?? null

const textos = (...valores: unknown[]): string[] | null =>
  valores.every((v): v is string => typeof v === 'string') ? valores : null

// Una imagen: `null` (sin imagen) o un objeto con su id. `undefined`: no se pudo leer.
function leerImagen(valor: unknown): number | null | undefined {
  if (valor === null) return null
  if (!esObjeto(valor)) return undefined
  return leerId(valor.id) ?? undefined
}

function leerBoton(valor: unknown): BotonLeido | null {
  if (!esObjeto(valor)) return null
  const tipo = opcion(TIPOS_DE_BOTON, valor.tipo)
  const estilo = opcion(ESTILOS_DE_BOTON, valor.estilo)
  const [etiqueta, mensaje, destino] = textos(valor.etiqueta, valor.mensaje, valor.destino) ?? []
  if (!tipo || !estilo || etiqueta === undefined || mensaje === undefined || destino === undefined)
    return null
  return { etiqueta, tipo, mensaje, destino, estilo }
}

function leerBotones(valor: unknown): BotonLeido[] | null {
  if (!Array.isArray(valor) || valor.length > MAXIMO_DE_BOTONES) return null
  const botones = valor.map(leerBoton)
  return botones.every((boton) => boton !== null) ? botones : null
}

const leerEncuadre = (valor: unknown): number | null | undefined =>
  valor === null || typeof valor === 'number' ? valor : undefined

type Imagenes = Pick<PortadaLeida, 'imagen' | 'imagenParaCelular' | 'sello'>

function leerImagenes(valor: Record<string, unknown>): Imagenes | null {
  const [imagen, imagenParaCelular, sello] = [
    valor.imagen,
    valor.imagenParaCelular,
    valor.sello,
  ].map(leerImagen)
  if (imagen === undefined || imagenParaCelular === undefined || sello === undefined) return null
  return { imagen, imagenParaCelular, sello }
}

function leerPresentacion(valor: Record<string, unknown>) {
  const disposicion = opcion(DISPOSICIONES, valor.disposicion)
  const transicion = opcion(TRANSICIONES, valor.transicion)
  const encuadreEnCelular = leerEncuadre(valor.encuadreEnCelular)
  const decorativa = valor.imagenEsDecorativa
  if (!disposicion || !transicion || encuadreEnCelular === undefined) return null
  if (typeof decorativa !== 'boolean') return null
  return { disposicion, transicion, encuadreEnCelular, imagenEsDecorativa: decorativa }
}

function leerPortada(valor: unknown): PortadaLeida | null {
  if (!esObjeto(valor)) return null
  const imagenes = leerImagenes(valor)
  const presentacion = leerPresentacion(valor)
  const botones = leerBotones(valor.botones)
  const [titulo, subtitulo, lista] = textos(valor.titulo, valor.subtitulo, valor.lista) ?? []
  if (!imagenes || !presentacion || !botones) return null
  if (titulo === undefined || subtitulo === undefined || lista === undefined) return null
  return { ...imagenes, ...presentacion, titulo, subtitulo, lista, botones }
}

export function leerFormularioDelCarrusel(entrada: unknown): CarruselLeido | null {
  if (!esObjeto(entrada) || !Array.isArray(entrada.portadas)) return null
  const { seccion, segundosPorPortada } = entrada
  const actualizadoEn = leerMarcaDeTiempo(entrada.actualizadoEn)
  if (typeof seccion !== 'string' || !PATRON_DE_SECCION.test(seccion) || !actualizadoEn) return null
  if (typeof segundosPorPortada !== 'string' && typeof segundosPorPortada !== 'number') return null
  const portadas = entrada.portadas.map(leerPortada)
  if (!portadas.every((portada) => portada !== null)) return null
  return { seccion, actualizadoEn, segundosPorPortada: String(segundosPorPortada), portadas }
}
