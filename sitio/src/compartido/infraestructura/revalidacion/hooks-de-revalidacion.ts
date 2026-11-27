import {
  cambiaLoPublico,
  etiquetaDeGlobal,
  etiquetasDeCambioEnColeccion,
} from '@/compartido/dominio/etiquetas-de-cache'

// Estado de la versión que ve el público (la fila principal, no el último borrador).
export interface EstadoPublico {
  publicada: boolean
  slug: string | null
}

export interface DependenciasDeRevalidacion<Req> {
  revalidar: (etiqueta: string) => void
  leerEstadoPublico: (
    req: Req,
    coleccion: string,
    id: number | string,
  ) => Promise<EstadoPublico | null>
}

type Contexto = Record<string, unknown>
type Documento = Record<string, unknown>

// La carga inicial (`pnpm semilla`) corre fuera de Next, donde no se puede invalidar la caché.
// Pasa este contexto a la Local API para que los hooks no hagan nada.
export const CONTEXTO_SIN_REVALIDACION = { omitirRevalidacion: true } as const

const omitir = (context: Contexto): boolean => context.omitirRevalidacion === true

const claveDeEstado = (coleccion: string, id: unknown): string =>
  `revalidacion:${coleccion}:${String(id)}`

const textoONulo = (valor: unknown): string | null => (typeof valor === 'string' ? valor : null)

const esEstadoPublico = (valor: unknown): valor is EstadoPublico =>
  typeof valor === 'object' && valor !== null && 'publicada' in valor

export interface OpcionesDeColeccion {
  slug: string
  conBorradores: boolean
}

export interface ArgumentosAntesDeCambiar<Req> {
  context: Contexto
  data: Documento
  operation: 'create' | 'update'
  originalDoc?: Documento
  req: Req
}

export interface ArgumentosDespuesDeCambiar {
  context: Contexto
  doc: Documento
  previousDoc?: Documento
  operation: 'create' | 'update'
}

export interface ArgumentosDespuesDeBorrar {
  context: Contexto
  doc: Documento
}

// Solo con borradores: la última versión puede ser un borrador, así que el estado público
// (y su slug) se lee de la fila principal antes de que el cambio la toque, y se deja en el
// contexto de la petición para el hook posterior.
const crearAntesDeCambiar =
  <Req>(slug: string, leerEstadoPublico: DependenciasDeRevalidacion<Req>['leerEstadoPublico']) =>
  async ({ context, data, operation, originalDoc, req }: ArgumentosAntesDeCambiar<Req>) => {
    const id = originalDoc?.id
    if (omitir(context) || operation !== 'update') return data
    if (typeof id !== 'number' && typeof id !== 'string') return data
    context[claveDeEstado(slug, id)] = await leerEstadoPublico(req, slug, id)
    return data
  }

// Slugs cuyas páginas cambian, o `null` si el cambio no toca nada público.
function slugsAfectados(opciones: OpcionesDeColeccion, argumentos: ArgumentosDespuesDeCambiar) {
  const { context, doc, previousDoc } = argumentos
  if (!opciones.conBorradores) return [textoONulo(doc.slug), textoONulo(previousDoc?.slug)]
  const estado = context[claveDeEstado(opciones.slug, doc.id)]
  const anterior = esEstadoPublico(estado) && estado.publicada ? estado : null
  if (!cambiaLoPublico({ estadoNuevo: doc._status, estabaPublicada: anterior !== null })) {
    return null
  }
  return [textoONulo(doc.slug), anterior?.slug ?? null]
}

export function crearHooksDeRevalidacion<Req>(dependencias: DependenciasDeRevalidacion<Req>) {
  const { revalidar, leerEstadoPublico } = dependencias
  const invalidar = (coleccion: string, slugs: readonly (string | null)[]) =>
    etiquetasDeCambioEnColeccion(coleccion, slugs).forEach(revalidar)

  const paraColeccion = (opciones: OpcionesDeColeccion) => ({
    antesDeCambiar: opciones.conBorradores
      ? crearAntesDeCambiar(opciones.slug, leerEstadoPublico)
      : null,
    despuesDeCambiar: async (argumentos: ArgumentosDespuesDeCambiar) => {
      const slugs = omitir(argumentos.context) ? null : slugsAfectados(opciones, argumentos)
      if (slugs) invalidar(opciones.slug, slugs)
      return argumentos.doc
    },
    // Borrar siempre invalida: es raro y el documento pudo ser público.
    despuesDeBorrar: async ({ context, doc }: ArgumentosDespuesDeBorrar) => {
      if (!omitir(context)) invalidar(opciones.slug, [textoONulo(doc.slug)])
      return doc
    },
  })

  const paraGlobal =
    (slug: string) =>
    async ({ context }: { context: Contexto }) => {
      if (!omitir(context)) revalidar(etiquetaDeGlobal(slug))
    }

  return { paraColeccion, paraGlobal }
}
