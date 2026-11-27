// Fechas de vencimiento: SUNAT publica días de calendario de Lima, sin hora.
const ZONA_DE_LIMA = 'America/Lima'
const PATRON_FECHA = /^\d{4}-\d{2}-\d{2}$/

// en-CA escribe las fechas como AAAA-MM-DD.
const DIA_EN_LIMA = new Intl.DateTimeFormat('en-CA', { timeZone: ZONA_DE_LIMA })

// Día de calendario en Lima (AAAA-MM-DD) de un instante, sin importar la zona del servidor.
export function diaEnLima(instante: Date): string {
  return DIA_EN_LIMA.format(instante)
}

const FORMATO_LARGO = new Intl.DateTimeFormat('es-PE', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  // La fecha se lee como medianoche UTC; formatearla en UTC evita correrla un día.
  timeZone: 'UTC',
})

// «viernes, 13 de febrero de 2026» a partir de «2026-02-13».
export function formatearFecha(fecha: string): string {
  if (!PATRON_FECHA.test(fecha)) throw new Error(`La fecha «${fecha}» no es AAAA-MM-DD.`)
  return FORMATO_LARGO.format(new Date(`${fecha}T00:00:00Z`))
}
