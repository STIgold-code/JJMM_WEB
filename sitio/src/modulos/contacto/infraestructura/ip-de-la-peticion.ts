// Dirección del visitante para el límite de envíos. Detrás de un proxy, la conexión llega
// desde el proxy, así que se lee el encabezado que este escribe:
// - Railway escribe `x-real-ip` (valor por defecto).
// - Con Cloudflare delante, la IP real está en `cf-connecting-ip`: se configura con
//   ENCABEZADO_IP_CLIENTE=cf-connecting-ip.
// Solo se confía en el encabezado configurado; los demás los puede inventar el cliente.
// Las direcciones IPv6 se agrupan por su prefijo /64: una sola conexión suele disponer de
// todo ese bloque y podría rotar direcciones para esquivar el límite.
export const ENCABEZADO_POR_DEFECTO = 'x-real-ip'
const SIN_DIRECCION = 'desconocida'
const GRUPOS_IPV6 = 8
const GRUPOS_DEL_PREFIJO = 4

interface Encabezados {
  get(nombre: string): string | null
}

function gruposIpv6(direccion: string): string[] {
  const [inicio = '', fin] = direccion.split('::')
  const delInicio = inicio ? inicio.split(':') : []
  const delFin = fin ? fin.split(':') : []
  const ceros = fin === undefined ? 0 : GRUPOS_IPV6 - delInicio.length - delFin.length
  return [...delInicio, ...Array<string>(Math.max(ceros, 0)).fill('0'), ...delFin]
}

function prefijoIpv6(direccion: string): string {
  const grupos = gruposIpv6(direccion.split('%')[0] ?? direccion)
  const prefijo = grupos
    .slice(0, GRUPOS_DEL_PREFIJO)
    .map((grupo) => grupo.toLowerCase().replace(/^0+(?=.)/, ''))
  return `${prefijo.join(':')}::/64`
}

export function ipDeLaPeticion(encabezados: Encabezados, encabezadoConfiable: string): string {
  const valor = encabezados.get(encabezadoConfiable)?.split(',')[0]?.trim()
  if (!valor) return SIN_DIRECCION
  return valor.includes(':') ? prefijoIpv6(valor) : valor
}
