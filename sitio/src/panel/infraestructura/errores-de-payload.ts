import type { ResultadoDelRepositorio } from '../aplicacion/gestionar-mensajes'

// Payload señala con el estado HTTP del error lo que no es una falla del sistema:
// 400 `ValidationError` (datos rechazados por la colección; `data.errors` trae el `path` de cada
// campo), 403 `Forbidden` y 404 `NotFound`. Cualquier otro error (por ejemplo, la base caída) es
// real y se propaga: nunca se muestra como un problema de datos.
const ESTADO_HTTP_INVALIDO = 400
const ESTADO_HTTP_PROHIBIDO = 403
const ESTADO_HTTP_NO_ENCONTRADO = 404

const esObjeto = (valor: unknown): valor is Record<string, unknown> =>
  typeof valor === 'object' && valor !== null

function camposRechazados(error: Record<string, unknown>): string[] {
  const errores = esObjeto(error.data) ? error.data.errors : undefined
  if (!Array.isArray(errores)) return []
  return errores.flatMap((campo: unknown) =>
    esObjeto(campo) && typeof campo.path === 'string' ? [campo.path] : [],
  )
}

export function traducirErrorDePayload(error: unknown): ResultadoDelRepositorio {
  if (!esObjeto(error)) throw error
  if (error.status === ESTADO_HTTP_INVALIDO)
    return { estado: 'invalido', campos: camposRechazados(error) }
  if (error.status === ESTADO_HTTP_PROHIBIDO) return { estado: 'prohibido' }
  if (error.status === ESTADO_HTTP_NO_ENCONTRADO) return { estado: 'no-encontrado' }
  throw error
}
