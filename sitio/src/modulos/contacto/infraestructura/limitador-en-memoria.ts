import type { LimitadorDeEnvios } from '../aplicacion/limitador-de-envios'

interface OpcionesDelLimitador {
  maximo: number
  ventanaMs: number
  // Tope de claves recordadas; al superarlo se olvidan las vencidas.
  maximoDeClaves?: number
}

export interface LimitadorEnMemoria extends LimitadorDeEnvios {
  cantidadDeClaves(): number
}

const MAXIMO_DE_CLAVES = 5000

// Ventana deslizante en la memoria del proceso. Limitación: cada instancia lleva su propia
// cuenta y se reinicia al desplegar; con una sola instancia en Railway alcanza. Con varias
// instancias, la cuenta debe vivir en un almacén compartido (Redis) o en Cloudflare.
export function crearLimitadorEnMemoria(opciones: OpcionesDelLimitador): LimitadorEnMemoria {
  const { maximo, ventanaMs, maximoDeClaves = MAXIMO_DE_CLAVES } = opciones
  const envios = new Map<string, number[]>()
  const vigentes = (clave: string, ahora: number) =>
    (envios.get(clave) ?? []).filter((momento) => ahora - momento < ventanaMs)

  function olvidarVencidas(ahora: number) {
    for (const clave of envios.keys()) {
      const quedan = vigentes(clave, ahora)
      if (quedan.length === 0) envios.delete(clave)
      else envios.set(clave, quedan)
    }
  }

  return {
    permitir(clave, ahora) {
      if (!envios.has(clave) && envios.size >= maximoDeClaves) olvidarVencidas(ahora)
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
