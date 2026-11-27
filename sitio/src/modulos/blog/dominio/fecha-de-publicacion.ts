// Fecha visible de una publicación, en la hora de Lima para que no cambie de día según el
// huso del servidor. `iso` es el valor del atributo datetime de <time>.
export interface FechaDePublicacion {
  texto: string
  iso: string
}

const ZONA_HORARIA = 'America/Lima'

const FORMATO_LARGO = new Intl.DateTimeFormat('es-PE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: ZONA_HORARIA,
})

// en-CA escribe AAAA-MM-DD.
const FORMATO_ISO = new Intl.DateTimeFormat('en-CA', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: ZONA_HORARIA,
})

export function formatearFechaDePublicacion(valor: string): FechaDePublicacion | null {
  const fecha = new Date(valor)
  if (Number.isNaN(fecha.getTime())) return null
  return { texto: FORMATO_LARGO.format(fecha), iso: FORMATO_ISO.format(fecha) }
}
