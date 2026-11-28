// Lo que hay que escribir para que la tabla quede como el formulario: borrar las filas que ya no
// están, actualizar solo el nombre o el orden que cambian y crear las nuevas. `posicion` es el
// lugar de la fila en el formulario, para devolver un rechazo de la colección a su fila. La
// validación (`validarFilas`) ya comprobó que el navegador conocía toda fila guardada, así que las
// que faltan son las que quitó quien guarda.
export interface FilaGuardada {
  id: number
  nombre: string
  orden: number
}

export interface FilaEnviada {
  id: number | null
  nombre: string
}

export interface CambiosDeFilas {
  eliminar: number[]
  // El nombre es único en la base: una fila que toma el nombre actual de otra (por ejemplo, dos
  // nombres intercambiados) pasa antes por un nombre temporal, dentro de la misma transacción.
  temporales: { id: number; posicion: number; nombre: string }[]
  actualizar: { id: number; posicion: number; datos: { nombre?: string; orden?: number } }[]
  crear: { posicion: number; datos: { nombre: string; orden: number } }[]
}

export const nombreTemporal = (id: number): string => `Fila ${id} (renombrando)`

// Filas que toman un nombre que hoy tiene otra fila que se queda.
function temporalesDe(
  guardadas: readonly FilaGuardada[],
  actualizar: CambiosDeFilas['actualizar'],
  eliminar: readonly number[],
): CambiosDeFilas['temporales'] {
  const nombresQueQuedan = new Map(
    guardadas.filter((f) => !eliminar.includes(f.id)).map((f) => [f.nombre, f.id]),
  )
  return actualizar.flatMap(({ id, posicion, datos }) => {
    const duena = datos.nombre === undefined ? undefined : nombresQueQuedan.get(datos.nombre)
    return duena !== undefined && duena !== id ? [{ id, posicion, nombre: nombreTemporal(id) }] : []
  })
}

export function cambiosDeFilas(
  guardadas: readonly FilaGuardada[],
  enviadas: readonly FilaEnviada[],
): CambiosDeFilas {
  const porId = new Map(guardadas.map((fila) => [fila.id, fila]))
  const quedan = new Set(enviadas.map((fila) => fila.id))
  const eliminar = guardadas.filter((fila) => !quedan.has(fila.id)).map((fila) => fila.id)
  const actualizar: CambiosDeFilas['actualizar'] = []
  const crear: CambiosDeFilas['crear'] = []
  enviadas.forEach(({ id, nombre }, posicion) => {
    const guardada = id === null ? undefined : porId.get(id)
    if (id === null || !guardada) {
      crear.push({ posicion, datos: { nombre, orden: posicion } })
      return
    }
    const datos = {
      ...(guardada.nombre === nombre ? {} : { nombre }),
      ...(guardada.orden === posicion ? {} : { orden: posicion }),
    }
    if (Object.keys(datos).length > 0) actualizar.push({ id, posicion, datos })
  })
  const temporales = temporalesDe(guardadas, actualizar, eliminar)
  // Primero las que toman un nombre libre, así liberan el suyo antes de que lo tomen las que
  // esperan con el nombre temporal.
  const conTemporal = (id: number) => temporales.some((t) => t.id === id)
  const ordenadas = [
    ...actualizar.filter((c) => !conTemporal(c.id)),
    ...actualizar.filter((c) => conTemporal(c.id)),
  ]
  return { eliminar, temporales, actualizar: ordenadas, crear }
}

export const hayAlgoQueEscribir = ({ eliminar, actualizar, crear }: CambiosDeFilas): boolean =>
  eliminar.length + actualizar.length + crear.length > 0
