import { normalizarParaBuscar } from './busqueda'
import type { FiltroDeImagenes, LugarDeUso } from './imagenes'

// Dónde se usa una imagen: cada campo de upload que apunta a `medios` (colecciones, globales y
// bloques) y cada imagen insertada en el contenido de una publicación. Se calcula en el servidor.
export interface UsoDeImagen {
  medio: number
  lugar: LugarDeUso
  // Qué ve el equipo: «Portada 1 del carrusel», «Cliente «Cadex»».
  texto: string
}

export function usosPorImagen(usos: readonly UsoDeImagen[]): Map<number, UsoDeImagen[]> {
  const porImagen = new Map<number, UsoDeImagen[]>()
  for (const uso of usos) {
    const actuales = porImagen.get(uso.medio) ?? []
    const repetido = actuales.some((otro) => otro.lugar === uso.lugar && otro.texto === uso.texto)
    if (!repetido) porImagen.set(uso.medio, [...actuales, uso])
  }
  return porImagen
}

const sinRepetir = (ids: number[]): number[] => [...new Set(ids)]

export type IdsDelFiltro = { incluir: number[] } | { excluir: number[] } | null

// Ids que deja ver un filtro: «todas» no filtra; un lugar incluye las imágenes usadas ahí; «sin
// usar» excluye toda imagen con algún uso.
export function idsDelFiltro(filtro: FiltroDeImagenes, usos: readonly UsoDeImagen[]): IdsDelFiltro {
  if (filtro === 'todas') return null
  if (filtro === 'sin-usar') return { excluir: sinRepetir(usos.map((uso) => uso.medio)) }
  return { incluir: sinRepetir(usos.filter((uso) => uso.lugar === filtro).map((uso) => uso.medio)) }
}

// El buscador encuentra también por el uso («Buscar por nombre o uso» de la maqueta).
export function idsQueCoincidenPorUso(usos: readonly UsoDeImagen[], busqueda: string): number[] {
  const buscado = normalizarParaBuscar(busqueda)
  if (!buscado) return []
  const coinciden = usos.filter((uso) => normalizarParaBuscar(uso.texto).includes(buscado))
  return sinRepetir(coinciden.map((uso) => uso.medio))
}

export function textoDeUsos(usos: readonly UsoDeImagen[] | undefined): string {
  if (!usos || usos.length === 0) return 'Sin usar en el sitio'
  return usos.map((uso) => uso.texto).join(' · ')
}

// Los logotipos se muestran enteros sobre blanco (la maqueta los distingue de las fotos).
export function esLogotipo(usos: readonly UsoDeImagen[], mime: string | null): boolean {
  if (mime === 'image/png') return true
  return usos.some((uso) => uso.lugar === 'clientes' || uso.lugar === 'marca')
}

const esObjeto = (valor: unknown): valor is Record<string, unknown> =>
  typeof valor === 'object' && valor !== null

function idDelNodo(nodo: Record<string, unknown>): number | null {
  if (nodo.type !== 'upload' || nodo.relationTo !== 'medios') return null
  const { value } = nodo
  const id = esObjeto(value) ? value.id : value
  return typeof id === 'number' && Number.isSafeInteger(id) && id > 0 ? id : null
}

// Imágenes insertadas en un texto enriquecido de Lexical (nodos `upload` de `medios`). Esas
// referencias viven en el JSON del contenido, sin llave foránea: hay que recorrerlo.
export function idsEnTextoEnriquecido(contenido: unknown): number[] {
  const ids: number[] = []
  const pendientes: unknown[] = [contenido]
  while (pendientes.length > 0) {
    const nodo = pendientes.pop()
    if (Array.isArray(nodo)) pendientes.push(...nodo)
    else if (esObjeto(nodo)) {
      const id = idDelNodo(nodo)
      if (id !== null) ids.push(id)
      pendientes.push(...Object.values(nodo))
    }
  }
  return sinRepetir(ids).sort((a, b) => a - b)
}
