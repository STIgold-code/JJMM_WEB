// Secciones de la página de inicio tal como están guardadas: una lista de bloques. Payload
// reemplaza la lista entera al guardar, así que toda escritura parte de lo guardado y cambia solo
// lo que se pidió; las demás secciones (incluso un tipo que el panel no conoce) pasan intactas.
export interface SeccionGuardada {
  blockType: string
  id?: string | null
}

// `null` si alguna sección no tiene id: sin ids no se puede saber qué se movió.
export function idsDeSecciones(secciones: readonly SeccionGuardada[]): string[] | null {
  const ids = secciones.map((seccion) => seccion.id ?? null)
  return ids.every((id): id is string => typeof id === 'string' && id !== '') ? ids : null
}

// Copia de `secciones` con la sección `id` cambiada por `reemplazar`. `null` si no existe o si
// `reemplazar` la rechaza (por ejemplo, no es del tipo esperado).
export function reemplazarSeccion<S extends SeccionGuardada>(
  secciones: readonly S[],
  id: string,
  reemplazar: (seccion: S) => S | null,
): S[] | null {
  const indice = secciones.findIndex((seccion) => seccion.id === id)
  const actual = secciones[indice]
  if (!actual) return null
  const nueva = reemplazar(actual)
  if (!nueva) return null
  return secciones.map((seccion, posicion) => (posicion === indice ? nueva : seccion))
}

function leerIdsDeSecciones(valor: unknown): string[] | null {
  if (!Array.isArray(valor)) return null
  const ids = valor.filter((id): id is string => typeof id === 'string')
  if (ids.length !== valor.length || new Set(ids).size !== ids.length) return null
  return ids
}

// Las mismas secciones en el orden de `idsEnOrden` (llega del navegador). `null` si no es
// exactamente la lista guardada: alguien la cambió mientras tanto y no se adivina qué se quiso.
export function reordenarSecciones<S extends SeccionGuardada>(
  secciones: readonly S[],
  idsEnOrden: unknown,
): S[] | null {
  const ids = leerIdsDeSecciones(idsEnOrden)
  const guardados = idsDeSecciones(secciones)
  if (!ids || !guardados || ids.length !== guardados.length) return null
  const porId = new Map(secciones.map((seccion) => [seccion.id, seccion]))
  const nuevas = ids.map((id) => porId.get(id))
  return nuevas.every((seccion): seccion is S => seccion !== undefined) ? nuevas : null
}

// La página cambió desde que se abrió el formulario: guardar pisaría el cambio de otra persona.
export function estaDesactualizada(guardada: string | null, delFormulario: string): boolean {
  return guardada !== delFormulario
}

// Fecha de la última modificación (`updatedAt`) que el formulario devuelve al guardar.
const PATRON_ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?(?:Z|[+-]\d{2}:\d{2})$/

export function leerMarcaDeTiempo(valor: unknown): string | null {
  return typeof valor === 'string' && PATRON_ISO.test(valor) ? valor : null
}
