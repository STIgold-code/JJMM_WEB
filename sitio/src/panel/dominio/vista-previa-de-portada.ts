import type { EstiloDeAccion, TipoDeAccion } from '@/modulos/portada/dominio/accion-de-portada'
import type { Disposicion, Transicion } from '@/modulos/portada/dominio/portada'
import {
  type SegmentoDeTexto,
  segmentarTextoResaltado,
  validarTextoResaltado,
} from '@/modulos/portada/dominio/texto-resaltado'

import { lineasDeLaLista, type PortadaDelFormulario } from './carrusel-de-portadas'

// Textos del panel para las opciones del bloque, como la maqueta «Portadas». La maqueta llamaba
// «Sin texto» a la imagen completa, pero el sitio dibuja igual el título y los botones (abajo).
export const TEXTOS_DE_DISPOSICION: Readonly<Record<Disposicion, string>> = {
  'texto-derecha': 'A la derecha',
  'texto-izquierda': 'A la izquierda',
  'imagen-completa': 'Imagen completa',
}

export const TEXTOS_DE_TRANSICION: Readonly<Record<Transicion, string>> = {
  fundido: 'Fundido',
  izquierda: 'Desde la izquierda',
  bajar: 'Bajando',
  recorte: 'Recorte',
}

export const TEXTOS_DE_TIPO_DE_BOTON: Readonly<Record<TipoDeAccion, string>> = {
  whatsapp: 'Escribir por WhatsApp',
  llamada: 'Llamar por teléfono',
  seccion: 'Ir a una sección del inicio (#ancla)',
  interna: 'Ir a una página del sitio (/ruta)',
  externa: 'Ir a otro sitio (https://)',
}

export const TEXTOS_DE_ESTILO: Readonly<Record<EstiloDeAccion, string>> = {
  principal: 'Principal',
  secundario: 'Secundario',
}

const DETALLE_DE_DISPOSICION: Readonly<Record<Disposicion, string>> = {
  'texto-derecha': 'Texto a la derecha',
  'texto-izquierda': 'Texto a la izquierda',
  'imagen-completa': 'Imagen completa',
}

const sinCorchetes = (texto: string) => texto.replace(/[[\]]/g, '').replace(/\s+/g, ' ').trim()

// Nombre de una portada en la lista: su título, sin los corchetes del resaltado.
export function nombreDePortada(portada: Pick<PortadaDelFormulario, 'titulo'>, indice: number) {
  return sinCorchetes(portada.titulo) || `Portada ${indice + 1}, sin título`
}

export function detalleDePortada(portada: PortadaDelFormulario): string {
  const puntos = lineasDeLaLista(portada.lista).length
  const celular = portada.imagenParaCelular ? ', con versión para celular' : ''
  const lista = puntos > 0 ? ` · lista de ${puntos} ${puntos === 1 ? 'punto' : 'puntos'}` : ''
  return `${DETALLE_DE_DISPOSICION[portada.disposicion]}${celular}${lista}`
}

export interface VistaPreviaDePortada {
  imagen: string | null
  sello: string | null
  disposicion: Disposicion
  titulo: SegmentoDeTexto[] | null
  subtitulo: string | null
  lista: string[]
  botones: { etiqueta: string; estilo: EstiloDeAccion }[]
}

// Lo que se ve de la portada mientras se escribe. Un título con corchetes mal cerrados se
// muestra tal cual, sin resaltar (al guardar, el servidor lo rechaza).
export function vistaPreviaDePortada(portada: PortadaDelFormulario): VistaPreviaDePortada {
  const titulo = portada.titulo.trim()
  const segmentos =
    validarTextoResaltado(titulo) === null
      ? segmentarTextoResaltado(titulo)
      : [{ texto: titulo, resaltado: false }]
  return {
    imagen: portada.imagen?.url ?? null,
    sello: portada.sello?.url ?? null,
    disposicion: portada.disposicion,
    titulo: titulo ? segmentos : null,
    subtitulo: portada.subtitulo.trim() || null,
    lista: lineasDeLaLista(portada.lista),
    botones: portada.botones.flatMap(({ etiqueta, estilo }) =>
      etiqueta.trim() ? [{ etiqueta: etiqueta.trim(), estilo }] : [],
    ),
  }
}
