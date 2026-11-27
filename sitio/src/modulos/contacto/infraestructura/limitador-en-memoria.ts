import type { LimitadorDeEnvios } from '../aplicacion/limitador-de-envios'

interface OpcionesDelLimitador {
  maximo: number
  ventanaMs: number
  // Tope estricto de claves recordadas. Al alcanzarlo se olvidan las vencidas y, si sigue
  // lleno, se rechazan las claves nuevas: nunca se borra la cuenta de una clave vigente.
  maximoDeClaves?: number
}

export interface LimitadorEnMemoria extends LimitadorDeEnvios {
  cantidadDeClaves(): number
}

const MAXIMO_DE_CLAVES = 5000
// Con el tope lleno, la limpieza recorre todas las claves; se hace como mucho una vez por
// este intervalo para que una inundación de claves nuevas no la repita en cada petición.
const INTERVALO_DE_LIMPIEZA_MS = 1000

// Ventana deslizante en la memoria del proceso. Limitación: cada instancia lleva su propia
// cuenta y se reinicia al desplegar; con una sola instancia en Railway alcanza. Con varias
// instancias, la cuenta debe vivir en un almacén compartido (Redis) o en Cloudflare.
export function crearLimitadorEnMemoria(opciones: OpcionesDelLimitador): LimitadorEnMemoria {
  const { maximo, ventanaMs, maximoDeClaves = MAXIMO_DE_CLAVES } = opciones
  const envios = new Map<string, number[]>()
  const vigentes = (clave: string, ahora: number) =>
    (envios.get(clave) ?? []).filter((momento) => ahora - momento < ventanaMs)

  let ultimaLimpieza = Number.NEGATIVE_INFINITY

  function olvidarVencidas(ahora: number) {
    if (ahora - ultimaLimpieza < INTERVALO_DE_LIMPIEZA_MS) return
    ultimaLimpieza = ahora
    for (const clave of envios.keys()) {
      if (vigentes(clave, ahora).length === 0) envios.delete(clave)
    }
  }

  // Falla cerrado: sin lugar para una clave nueva, el envío se rechaza. Los canales directos
  // (WhatsApp y llamada) siguen disponibles aunque el formulario quede bloqueado.
  function hayLugarPara(clave: string, ahora: number) {
    if (envios.has(clave) || envios.size < maximoDeClaves) return true
    olvidarVencidas(ahora)
    return envios.size < maximoDeClaves
  }

  return {
    permitir(clave, ahora) {
      if (!hayLugarPara(clave, ahora)) return false
      const recientes = vigentes(clave, ahora)
      if (recientes.length >= maximo) {
        envios.set(clave, recientes)
        return false
      }
      envios.set(clave, [...recientes, ahora])
      return true
    },
    cantidadDeClaves: () => envios.size,
  }
}
