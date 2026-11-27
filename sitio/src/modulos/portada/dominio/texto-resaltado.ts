// Los títulos de las portadas resaltan una parte («Contamos con [Sistema de Calidad] Genuino»).
// Quien edita marca esa parte entre corchetes; así no hace falta un editor de texto enriquecido.
export interface SegmentoDeTexto {
  texto: string
  resaltado: boolean
}

const PATRON_SEGMENTOS = /\[([^[\]]+)\]|([^[\]]+)/g
const PATRON_VALIDO = /^(?:[^[\]]|\[[^[\]]+\])*$/

export function validarTextoResaltado(texto: string): string | null {
  if (PATRON_VALIDO.test(texto)) return null
  return 'Marca la parte resaltada entre corchetes cerrados y no vacíos, por ejemplo «Contamos con [Sistema de Calidad] Genuino».'
}

export function segmentarTextoResaltado(texto: string): SegmentoDeTexto[] {
  return Array.from(texto.matchAll(PATRON_SEGMENTOS), ([, resaltado, normal]) =>
    resaltado === undefined
      ? { texto: normal ?? '', resaltado: false }
      : { texto: resaltado, resaltado: true },
  )
}
