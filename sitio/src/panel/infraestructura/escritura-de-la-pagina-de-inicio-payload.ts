import type { Payload, TypedUser } from 'payload'

import type {
  CambioDelInicio,
  RepositorioDeEscrituraDelInicio,
  ResultadoDelInicio,
} from '../aplicacion/guardar-pagina-de-inicio'
import {
  estaDesactualizada,
  reemplazarSeccion,
  reordenarSecciones,
} from '../dominio/secciones-de-inicio'
import { conCarrusel, type SeccionDePayload } from './bloque-de-carrusel-payload'
import { escribirDocumento } from './errores-de-payload'
import type { SesionDelPanel } from './sesion-del-panel'

interface Contexto {
  payload: Payload
  permisos: { overrideAccess: false; user: TypedUser; depth: 0 }
}

const SLUG = 'pagina-de-inicio'

function seccionesNuevas(guardadas: SeccionDePayload[], cambio: CambioDelInicio) {
  if (cambio.tipo === 'orden') return reordenarSecciones(guardadas, cambio.ids)
  const { carrusel } = cambio
  return reemplazarSeccion(guardadas, carrusel.seccion, (s) => conCarrusel(s, carrusel))
}

const versionDelFormulario = (cambio: CambioDelInicio) =>
  cambio.tipo === 'carrusel' ? cambio.carrusel.actualizadoEn : cambio.actualizadoEn

// Payload nombra los campos rechazados desde la global (`secciones.<i>.portadas.0.imagen`); los
// del carrusel pasan a ser relativos al bloque. Los de otras secciones quedan como vienen.
function rutasDelCarrusel(campos: readonly string[], indice: number): string[] {
  const prefijo = `secciones.${indice}.`
  return campos.map((campo) => (campo.startsWith(prefijo) ? campo.slice(prefijo.length) : campo))
}

// Lee la página guardada (`depth: 0`: las relaciones como ids, tal cual se escriben), comprueba
// que nadie la cambió desde que se abrió el formulario, aplica el cambio sobre lo guardado y la
// escribe entera en una sola llamada: las demás secciones van exactamente como estaban.
async function actualizar(
  { payload, permisos }: Contexto,
  cambio: CambioDelInicio,
): Promise<ResultadoDelInicio> {
  const pagina = await payload.findGlobal({ slug: SLUG, ...permisos })
  if (estaDesactualizada(pagina.updatedAt ?? null, versionDelFormulario(cambio)))
    return { estado: 'desactualizada' }
  const secciones = seccionesNuevas(pagina.secciones ?? [], cambio)
  if (!secciones) return { estado: cambio.tipo === 'carrusel' ? 'sin-seccion' : 'desactualizada' }
  const escritura = await escribirDocumento(() =>
    payload.updateGlobal({ slug: SLUG, data: { secciones }, ...permisos }),
  )
  if (escritura.estado === 'hecho')
    return { estado: 'hecho', actualizadoEn: escritura.documento.updatedAt ?? '' }
  if (escritura.estado !== 'invalido' || cambio.tipo !== 'carrusel') return escritura
  const indice = secciones.findIndex((s) => s.id === cambio.carrusel.seccion)
  return { ...escritura, campos: rutasDelCarrusel(escritura.campos, indice) }
}

async function imagenesExistentes({ payload, permisos }: Contexto, ids: readonly number[]) {
  if (ids.length === 0) return new Set<number>()
  const { docs } = await payload.find({
    collection: 'medios',
    where: { id: { in: [...ids] } },
    select: { mimeType: true },
    pagination: false,
    ...permisos,
  })
  return new Set(docs.filter((d) => d.mimeType?.startsWith('image/')).map((d) => d.id))
}

// Adaptador de Payload de las escrituras de la página de inicio: Local API con
// `overrideAccess: false` y el usuario de la sesión. El hook de la global invalida la caché del
// sitio público (corre dentro de Next).
export function crearEscrituraDeLaPaginaDeInicio(
  sesion: SesionDelPanel,
): RepositorioDeEscrituraDelInicio {
  const permisos = { overrideAccess: false, user: sesion.usuario, depth: 0 } as const
  const contexto: Contexto = { payload: sesion.payload, permisos }
  return {
    imagenesExistentes: (ids) => imagenesExistentes(contexto, ids),
    actualizar: (cambio) => actualizar(contexto, cambio),
  }
}
