import type { Criterio, IdDeDocumento, PuertoDeCarga } from '../puerto-de-carga'

// Doble de prueba del puerto de carga: guarda los documentos en memoria y registra cada
// operación, para probar el cargador sin base de datos.

export interface DocumentoEnMemoria {
  id: IdDeDocumento
  datos: Record<string, unknown>
  rutaDeArchivo?: string
}

export interface Operacion {
  tipo: 'crear' | 'actualizar' | 'actualizarGlobal'
  destino: string
}

const nombreDeArchivo = (ruta: string): string => ruta.split(/[\\/]/).at(-1) ?? ruta

const cumple = (documento: DocumentoEnMemoria, criterio: Criterio): boolean =>
  Object.entries(criterio).every(([campo, valor]) => documento.datos[campo] === valor)

export class PuertoEnMemoria implements PuertoDeCarga {
  readonly colecciones = new Map<string, DocumentoEnMemoria[]>()
  readonly globales = new Map<string, Record<string, unknown>>()
  readonly operaciones: Operacion[] = []
  private siguienteId = 1

  documentos(coleccion: string): DocumentoEnMemoria[] {
    const documentos = this.colecciones.get(coleccion) ?? []
    this.colecciones.set(coleccion, documentos)
    return documentos
  }

  async buscar(coleccion: string, criterio: Criterio): Promise<IdDeDocumento | null> {
    return this.documentos(coleccion).find((d) => cumple(d, criterio))?.id ?? null
  }

  // Como Payload, una subida guarda el nombre del archivo en `filename`.
  async crear(coleccion: string, datos: object, rutaDeArchivo?: string): Promise<IdDeDocumento> {
    const id = this.siguienteId++
    const archivo = rutaDeArchivo === undefined ? {} : { filename: nombreDeArchivo(rutaDeArchivo) }
    this.documentos(coleccion).push({ id, datos: { ...datos, ...archivo }, rutaDeArchivo })
    this.operaciones.push({ tipo: 'crear', destino: coleccion })
    return id
  }

  async actualizar(coleccion: string, id: IdDeDocumento, datos: object): Promise<void> {
    const documento = this.documentos(coleccion).find((d) => d.id === id)
    if (documento) documento.datos = { ...documento.datos, ...datos }
    this.operaciones.push({ tipo: 'actualizar', destino: coleccion })
  }

  async actualizarGlobal(slug: string, datos: object): Promise<void> {
    this.globales.set(slug, { ...datos })
    this.operaciones.push({ tipo: 'actualizarGlobal', destino: slug })
  }

  cantidad(coleccion: string): number {
    return this.documentos(coleccion).length
  }
}
