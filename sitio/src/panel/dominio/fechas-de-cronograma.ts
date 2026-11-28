import { diaEnLima } from '@/modulos/vencimientos/dominio/fechas'

// Fechas del cronograma de SUNAT: días de calendario de Lima, sin hora (AAAA-MM-DD). Payload
// guarda un campo `date` como instante (timestamptz) y el sitio lo vuelve a leer como día de
// Lima (`diaEnLima`), así que aquí se escribe el mediodía de Lima: ni Lima (UTC−5, sin horario
// de verano) ni UTC lo corren de día.
const PATRON = /^(\d{4})-(\d{2})-(\d{2})$/
const PRIMER_ANIO = 2020
const ULTIMO_ANIO = 2101
const MEDIODIA_DE_LIMA_EN_UTC = 'T17:00:00.000Z'

// El día tal como llega del navegador (`<input type="date">`), o `null` si no existe.
export function leerFechaDelFormulario(valor: unknown): string | null {
  if (typeof valor !== 'string') return null
  const partes = PATRON.exec(valor)
  if (!partes) return null
  const anio = Number(partes[1])
  const mes = Number(partes[2])
  const dia = Number(partes[3])
  if (anio < PRIMER_ANIO || anio > ULTIMO_ANIO) return null
  const fecha = new Date(Date.UTC(anio, mes - 1, dia))
  const existe = fecha.getUTCMonth() === mes - 1 && fecha.getUTCDate() === dia
  return existe ? valor : null
}

export function instanteDelDia(dia: string): string {
  return `${dia}${MEDIODIA_DE_LIMA_EN_UTC}`
}

// Lo que guardó Payload (por el panel o por el /admin), leído como día de Lima, igual que el sitio.
export function diaDelInstante(instante: string): string {
  return diaEnLima(new Date(instante))
}

// El día se formatea en UTC: medianoche UTC de ese mismo día, sin correrlo.
const DIA_Y_MES = new Intl.DateTimeFormat('es-PE', {
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
})
const CON_ANIO = new Intl.DateTimeFormat('es-PE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

const aFecha = (dia: string) => new Date(`${dia}T00:00:00Z`)

// «Del 13 de febrero al 24 de febrero de 2026».
export function rangoDeFechas(dias: readonly string[]): string {
  const ordenados = [...dias].sort()
  const primera = ordenados[0]
  const ultima = ordenados.at(-1)
  if (primera === undefined || ultima === undefined) return 'Sin fechas'
  if (primera === ultima) return `El ${CON_ANIO.format(aFecha(primera))}`
  return `Del ${DIA_Y_MES.format(aFecha(primera))} al ${CON_ANIO.format(aFecha(ultima))}`
}
