import type { Rol } from '@/compartido/dominio/roles'

import { leerId } from './identificadores'
import { RUTA_DEL_INICIO } from './rutas-del-panel'

// Biblioteca de imágenes del panel (colección `medios`). Filtro, búsqueda, página e imagen
// abierta viven en la URL, como en los mensajes: un enlace o una recarga muestran lo mismo.
export const RUTA_DE_IMAGENES = `${RUTA_DEL_INICIO}/imagenes`
// Subida de archivos: un manejador de ruta (las acciones de servidor aceptan 1 MB por defecto).
export const RUTA_DE_SUBIDA_DE_IMAGENES = `${RUTA_DE_IMAGENES}/subir`

export const IMAGENES_POR_PAGINA = 24
const LARGO_MAXIMO_DE_BUSQUEDA = 100

export const LUGARES_DE_USO = ['inicio', 'clientes', 'marca', 'blog'] as const
export type LugarDeUso = (typeof LUGARES_DE_USO)[number]

export const FILTROS_DE_IMAGENES = ['todas', ...LUGARES_DE_USO, 'sin-usar'] as const
export type FiltroDeImagenes = (typeof FILTROS_DE_IMAGENES)[number]
const FILTRO_PREDETERMINADO: FiltroDeImagenes = 'todas'

export interface ConsultaDeImagenes {
  filtro: FiltroDeImagenes
  busqueda: string
  pagina: number
  // Id de la imagen abierta en el panel lateral.
  imagen: number | null
}

type ParametrosDeLaUrl = Readonly<Record<string, string | string[] | undefined>>

const esFiltro = (valor: unknown): valor is FiltroDeImagenes =>
  FILTROS_DE_IMAGENES.some((filtro) => filtro === valor)

const primero = (valor: string | string[] | undefined): string =>
  (Array.isArray(valor) ? valor[0] : valor) ?? ''

export function leerConsultaDeImagenes(parametros: ParametrosDeLaUrl): ConsultaDeImagenes {
  const filtro = primero(parametros.filtro)
  return {
    filtro: esFiltro(filtro) ? filtro : FILTRO_PREDETERMINADO,
    busqueda: primero(parametros.q).trim().slice(0, LARGO_MAXIMO_DE_BUSQUEDA),
    pagina: leerId(primero(parametros.pagina)) ?? 1,
    imagen: leerId(primero(parametros.imagen)),
  }
}

// Arma la URL con solo lo que difiere de lo predeterminado.
export function rutaDeImagenes(consulta: Partial<ConsultaDeImagenes>): string {
  const parametros = new URLSearchParams()
  if (consulta.filtro && consulta.filtro !== FILTRO_PREDETERMINADO)
    parametros.set('filtro', consulta.filtro)
  if (consulta.busqueda) parametros.set('q', consulta.busqueda)
  if (consulta.pagina && consulta.pagina > 1) parametros.set('pagina', String(consulta.pagina))
  if (consulta.imagen) parametros.set('imagen', String(consulta.imagen))
  const texto = parametros.toString()
  return texto ? `${RUTA_DE_IMAGENES}?${texto}` : RUTA_DE_IMAGENES
}

export type ConteosDeImagenes = Readonly<Record<FiltroDeImagenes, number>>

export interface FiltroDeImagenesConConteo {
  valor: FiltroDeImagenes
  texto: string
  cantidad: number
}

const TEXTOS_DE_FILTRO: Readonly<Record<FiltroDeImagenes, string>> = {
  todas: 'Todas',
  inicio: 'Inicio',
  clientes: 'Clientes',
  marca: 'Marca',
  blog: 'Blog',
  'sin-usar': 'Sin usar',
}

export function filtrosDeImagenesConConteo(
  conteos: ConteosDeImagenes,
): FiltroDeImagenesConConteo[] {
  return FILTROS_DE_IMAGENES.map((valor) => ({
    valor,
    texto: TEXTOS_DE_FILTRO[valor],
    cantidad: conteos[valor],
  }))
}

const VACIO_POR_FILTRO: Readonly<Record<FiltroDeImagenes, string>> = {
  todas: 'No hay imágenes.',
  inicio: 'No hay imágenes del inicio.',
  clientes: 'No hay logotipos de clientes.',
  marca: 'No hay imágenes de marca.',
  blog: 'Ninguna publicación usa imágenes.',
  'sin-usar': 'Todas las imágenes se usan en alguna parte del sitio.',
}

export function textoDeGaleriaVacia(filtro: FiltroDeImagenes, busqueda: string): string {
  if (busqueda) return `Nada coincide con «${busqueda}». Prueba con otra palabra.`
  return VACIO_POR_FILTRO[filtro]
}

// Solo el administrador elimina imágenes. El botón se oculta al editor y la acción lo rechaza
// antes de llegar a Payload.
export function puedeEliminarImagenes(rol: Rol): boolean {
  return rol === 'administrador'
}
