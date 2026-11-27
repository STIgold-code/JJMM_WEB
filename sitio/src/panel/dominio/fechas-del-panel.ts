// Fechas y saludo del panel, siempre en la hora de Lima: el servidor de Railway corre en UTC.
const ZONA = 'America/Lima'
const IDIOMA = 'es-PE'
const MS_POR_DIA = 86_400_000

const HORA = new Intl.DateTimeFormat(IDIOMA, { timeZone: ZONA, hour: 'numeric', hourCycle: 'h23' })
const HORA_Y_MINUTOS = new Intl.DateTimeFormat(IDIOMA, {
  timeZone: ZONA,
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})
const FECHA_LARGA = new Intl.DateTimeFormat(IDIOMA, {
  timeZone: ZONA,
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
const DIA_Y_MES = new Intl.DateTimeFormat(IDIOMA, {
  timeZone: ZONA,
  day: 'numeric',
  month: 'short',
})
// `en-CA` escribe AAAA-MM-DD.
const FECHA_ISO = new Intl.DateTimeFormat('en-CA', {
  timeZone: ZONA,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

export function horaEnLima(fecha: Date): number {
  return Number(HORA.format(fecha))
}

export function saludoSegunHora(hora: number): string {
  if (hora < 12) return 'Buenos días'
  if (hora < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

export function fechaLargaEnLima(fecha: Date): string {
  const texto = FECHA_LARGA.format(fecha)
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

export function fechaIsoEnLima(fecha: Date): string {
  return FECHA_ISO.format(fecha)
}

function diasEntre(desde: Date, hasta: Date): number {
  const dia = (fecha: Date) => Date.parse(`${fechaIsoEnLima(fecha)}T00:00:00Z`)
  return Math.round((dia(hasta) - dia(desde)) / MS_POR_DIA)
}

// «Hoy, 10:42», «Ayer, 18:03» o «20 nov., 16:20».
export function fechaRelativa(fecha: Date, ahora: Date): string {
  const hora = HORA_Y_MINUTOS.format(fecha)
  const dias = diasEntre(fecha, ahora)
  if (dias === 0) return `Hoy, ${hora}`
  if (dias === 1) return `Ayer, ${hora}`
  return `${DIA_Y_MES.format(fecha)}, ${hora}`
}
