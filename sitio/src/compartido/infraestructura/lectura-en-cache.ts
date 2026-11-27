import { unstable_cache } from 'next/cache'

// Red de seguridad: cada lectura se renueva como máximo cada 10 minutos aunque ningún hook la
// invalide (un cambio hecho fuera del panel, la carga inicial o una carrera entre publicar y
// leer). Lo normal es que la invalide al instante el hook del panel.
export const REVALIDACION_DE_RESPALDO_EN_SEGUNDOS = 600

type Etiquetas<A extends unknown[]> = readonly string[] | ((...argumentos: A) => readonly string[])

// Guarda en la caché de datos de Next el resultado de una lectura de Payload, con las
// etiquetas de lo que lee. `clave` debe ser única por lectura: junto con los argumentos forma
// la clave de la entrada. El resultado se guarda como JSON, así que debe ser serializable
// (sin `Date`, `Map` ni funciones; un campo `undefined` vuelve ausente).
export function leerEnCache<A extends unknown[], R>(
  clave: string,
  etiquetas: Etiquetas<A>,
  leer: (...argumentos: A) => Promise<R>,
): (...argumentos: A) => Promise<R> {
  return (...argumentos: A) => {
    const tags = typeof etiquetas === 'function' ? etiquetas(...argumentos) : etiquetas
    return unstable_cache(() => leer(...argumentos), [clave, JSON.stringify(argumentos)], {
      tags: [...tags],
      revalidate: REVALIDACION_DE_RESPALDO_EN_SEGUNDOS,
    })()
  }
}
