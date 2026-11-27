import type { BloqueQuienesSomos } from '@/payload-types'

import {
  segmentarTextoResaltado,
  type SegmentoDeTexto,
} from '@/modulos/portada/dominio/texto-resaltado'

// Convierte párrafos con negritas entre corchetes («Somos el [Estudio Contable JJMM]…») al
// formato JSON del editor Lexical que guarda Payload en los campos `richText`.

type TextoEnriquecido = BloqueQuienesSomos['presentacion']

// Lexical guarda los estilos de texto como banderas de bits; 1 es negrita.
const FORMATO_NORMAL = 0
const FORMATO_NEGRITA = 1

const nodoDeTexto = ({ texto, resaltado }: SegmentoDeTexto) => ({
  type: 'text',
  text: texto,
  format: resaltado ? FORMATO_NEGRITA : FORMATO_NORMAL,
  detail: 0,
  mode: 'normal',
  style: '',
  version: 1,
})

const parrafo = (texto: string) => ({
  type: 'paragraph',
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr',
  textFormat: FORMATO_NORMAL,
  textStyle: '',
  children: segmentarTextoResaltado(texto).map(nodoDeTexto),
})

export function aTextoEnriquecido(parrafos: readonly string[]): TextoEnriquecido {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: parrafos.map(parrafo),
    },
  }
}
