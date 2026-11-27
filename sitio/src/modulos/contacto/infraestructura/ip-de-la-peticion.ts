// Dirección del visitante para el límite de envíos. Detrás de un proxy, la conexión llega
// desde el proxy, así que se lee el encabezado que este escribe:
// - Railway escribe `x-real-ip` (valor por defecto).
// - Con Cloudflare delante, la IP real está en `cf-connecting-ip`: se configura con
//   ENCABEZADO_IP_CLIENTE=cf-connecting-ip.
// Solo se confía en el encabezado configurado; los demás los puede inventar el cliente.
// La dirección se valida con el analizador de Node: se quita el puerto, una IPv4 escrita como
// IPv6 (::ffff:a.b.c.d) vuelve a ser IPv4 y lo que no es una IP cae en la clave común.
// Las direcciones IPv6 se agrupan por su prefijo /64: una sola conexión suele disponer de
// todo ese bloque y podría rotar direcciones para esquivar el límite.
import { isIP } from 'node:net'

export const ENCABEZADO_POR_DEFECTO = 'x-real-ip'
const SIN_DIRECCION = 'desconocida'
const GRUPOS_IPV6 = 8
const GRUPOS_DEL_PREFIJO = 4
const IPV6_CON_PUERTO = /^\[([^\]]+)\](?::\d+)?$/
const IPV4_CON_PUERTO = /^(\d{1,3}(?:\.\d{1,3}){3}):\d+$/
const IPV4_COMO_IPV6 = /^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i

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
  const prefijo = gruposIpv6(direccion)
    .slice(0, GRUPOS_DEL_PREFIJO)
    .map((grupo) => grupo.toLowerCase().replace(/^0+(?=.)/, ''))
  return `${prefijo.join(':')}::/64`
}

function sinPuertoNiZona(valor: string): string {
  const sinPuerto = IPV6_CON_PUERTO.exec(valor)?.[1] ?? IPV4_CON_PUERTO.exec(valor)?.[1] ?? valor
  return sinPuerto.split('%')[0] ?? sinPuerto
}

function claveDeDireccion(valor: string): string {
  const direccion = sinPuertoNiZona(valor)
  const version = isIP(direccion)
  if (version === 4) return direccion
  if (version !== 6) return SIN_DIRECCION
  const ipv4 = IPV4_COMO_IPV6.exec(direccion)?.[1]
  return ipv4 && isIP(ipv4) === 4 ? ipv4 : prefijoIpv6(direccion)
}

export function ipDeLaPeticion(encabezados: Encabezados, encabezadoConfiable: string): string {
  const valor = encabezados.get(encabezadoConfiable)?.split(',')[0]?.trim()
  return valor ? claveDeDireccion(valor) : SIN_DIRECCION
}
