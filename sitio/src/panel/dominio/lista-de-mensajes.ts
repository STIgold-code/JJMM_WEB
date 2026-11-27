import type { FiltroDeMensajes } from './mensajes'

// Reglas de presentación del listado de mensajes: extractos, filtros con su conteo, textos del
// estado vacío y paginación del lado del servidor (nunca se traen filas sin tope).
export const MENSAJES_POR_PAGINA = 25
const LARGO_DEL_EXTRACTO = 70

export function extractoDelMensaje(texto: string): string {
  const enUnaLinea = texto.replace(/\s+/g, ' ').trim()
  if (enUnaLinea.length <= LARGO_DEL_EXTRACTO) return enUnaLinea
  return `${enUnaLinea.slice(0, LARGO_DEL_EXTRACTO).trimEnd()}…`
}

export interface ConteosDeMensajes {
  nuevos: number
  atendidos: number
}

export interface FiltroConConteo {
  filtro: FiltroDeMensajes
  texto: string
  cantidad: number
}

export function filtrosConConteo({ nuevos, atendidos }: ConteosDeMensajes): FiltroConConteo[] {
  return [
    { filtro: 'nuevo', texto: 'Nuevos', cantidad: nuevos },
    { filtro: 'atendido', texto: 'Atendidos', cantidad: atendidos },
    { filtro: 'todos', texto: 'Todos', cantidad: nuevos + atendidos },
  ]
}

const VACIO_POR_FILTRO: Readonly<Record<FiltroDeMensajes, string>> = {
  nuevo: 'No hay mensajes nuevos. Cuando alguien escriba desde el sitio, aparecerá aquí.',
  atendido: 'Aún no marcas ningún mensaje como atendido.',
  todos: 'No hay mensajes.',
}

export function textoDeListaVacia(filtro: FiltroDeMensajes, busqueda: string): string {
  if (busqueda) return `Nada coincide con «${busqueda}». Prueba con otra palabra.`
  return VACIO_POR_FILTRO[filtro]
}

export interface Paginacion {
  pagina: number
  paginas: number
  // Posición (desde 1) del primer y el último mensaje de la página; 0 si no hay ninguno.
  desde: number
  hasta: number
  total: number
  anterior: number | null
  siguiente: number | null
}

export function paginacion(
  total: number,
  paginaPedida: number,
  porPagina = MENSAJES_POR_PAGINA,
): Paginacion {
  const paginas = Math.max(1, Math.ceil(total / porPagina))
  const pagina = Math.min(Math.max(1, paginaPedida), paginas)
  const desde = total === 0 ? 0 : (pagina - 1) * porPagina + 1
  return {
    pagina,
    paginas,
    desde,
    hasta: Math.min(pagina * porPagina, total),
    total,
    anterior: pagina > 1 ? pagina - 1 : null,
    siguiente: pagina < paginas ? pagina + 1 : null,
  }
}
