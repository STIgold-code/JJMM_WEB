import type { SegmentoDeTexto } from '@/modulos/portada/dominio/texto-resaltado'
import type { BloqueQuienesSomos } from '@/payload-types'

// La presentación de «Quiénes somos» es un campo richText (Lexical). La sección solo usa
// párrafos con negritas, así que se convierte a segmentos y la interfaz no depende de Payload.
type TextoEnriquecido = BloqueQuienesSomos['presentacion']

// Lexical guarda los estilos de texto como banderas de bits; 1 es negrita.
const BANDERA_NEGRITA = 1

const leer = (nodo: unknown, clave: string): unknown =>
  typeof nodo === 'object' && nodo !== null ? Reflect.get(nodo, clave) : undefined

const hijosDe = (nodo: unknown): unknown[] => {
  const hijos = leer(nodo, 'children')
  return Array.isArray(hijos) ? hijos : []
}

function segmentosDe(nodo: unknown): SegmentoDeTexto[] {
  const texto = leer(nodo, 'text')
  if (typeof texto === 'string') {
    const formato = leer(nodo, 'format')
    const negrita = typeof formato === 'number' && (formato & BANDERA_NEGRITA) !== 0
    return texto ? [{ texto, resaltado: negrita }] : []
  }
  return hijosDe(nodo).flatMap(segmentosDe)
}

export function parrafosDeTextoEnriquecido(valor: TextoEnriquecido): SegmentoDeTexto[][] {
  return valor.root.children.map(segmentosDe).filter((segmentos) => segmentos.length > 0)
}
