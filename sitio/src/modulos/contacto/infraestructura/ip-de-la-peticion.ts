// Dirección del visitante para el límite de envíos. Detrás de un proxy, la conexión llega
// desde el proxy, así que se lee el encabezado que este escribe:
// - Railway escribe `x-real-ip` (valor por defecto).
// - Con Cloudflare delante, la IP real está en `cf-connecting-ip`: se configura con
//   ENCABEZADO_IP_CLIENTE=cf-connecting-ip.
// Solo se confía en el encabezado configurado; los demás los puede inventar el cliente.
export const ENCABEZADO_POR_DEFECTO = 'x-real-ip'
const SIN_DIRECCION = 'desconocida'

interface Encabezados {
  get(nombre: string): string | null
}

export function ipDeLaPeticion(encabezados: Encabezados, encabezadoConfiable: string): string {
  const valor = encabezados.get(encabezadoConfiable)?.split(',')[0]?.trim()
  return valor || SIN_DIRECCION
}
