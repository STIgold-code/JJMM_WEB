import type { LimitadorDeEnvios } from '../aplicacion/limitador-de-envios'

interface OpcionesDelLimitador {
  maximo: number
  ventanaMs: number
  // Tope estricto de claves recordadas; al alcanzarlo se olvida la usada hace más tiempo.
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

  // El Map conserva el orden de inserción: volver a insertar una clave la deja al final,
  // así la primera clave es siempre la usada hace más tiempo (LRU) y se olvida sin recorrer todo.
  function recordar(clave: string, momentos: number[]) {
    envios.delete(clave)
    if (envios.size >= maximoDeClaves) {
      const masAntigua = envios.keys().next()
      if (!masAntigua.done) envios.delete(masAntigua.value)
    }
    envios.set(clave, momentos)
  }

  return {
    permitir(clave, ahora) {
      const recientes = vigentes(clave, ahora)
      if (recientes.length >= maximo) {
        recordar(clave, recientes)
        return false
      }
      recordar(clave, [...recientes, ahora])
      return true
    },
    cantidadDeClaves: () => envios.size,
  }
}
