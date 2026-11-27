import type { Imagen } from '@/compartido/dominio/imagen'

import type { AccionDePortada } from './accion-de-portada'
import type { SegmentoDeTexto } from './texto-resaltado'

export type Disposicion = 'texto-izquierda' | 'texto-derecha' | 'imagen-completa'
export type Transicion = 'fundido' | 'izquierda' | 'bajar' | 'recorte'

// Portada del hero lista para dibujar.
export interface PortadaPublica {
  imagen: Imagen
  // Decorativa: el texto de la portada ya la describe, así que su alt queda vacío.
  imagenEsDecorativa: boolean
  imagenParaCelular: Imagen | null
  // Porcentaje horizontal que se ve en pantallas angostas (object-position).
  encuadreEnCelular: number | null
  disposicion: Disposicion
  transicion: Transicion
  titulo: SegmentoDeTexto[] | null
  // El título de la primera portada que tiene uno es el h1 de la página.
  esTituloPrincipal: boolean
  subtitulo: string | null
  sello: Imagen | null
  lista: string[]
  acciones: AccionDePortada[]
}

export interface CarruselPublico {
  segundosPorPortada: number
  portadas: PortadaPublica[]
}

// Índice de la portada cuyo título es el h1: la primera que tiene título, o -1 si ninguna.
export function indiceDelTituloPrincipal(portadas: readonly { titulo: unknown }[]): number {
  return portadas.findIndex((portada) => portada.titulo !== null)
}
