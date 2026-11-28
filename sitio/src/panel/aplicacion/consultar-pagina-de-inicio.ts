import {
  type CarruselGuardado,
  type FormularioDelCarrusel,
  formularioDelCarrusel,
} from '../dominio/carrusel-de-portadas'
import {
  resumenDeSeccion,
  type SeccionDelPanel,
  type SeccionLeida,
} from '../dominio/pagina-de-inicio'

// Lecturas de la página de inicio con los permisos de quien entra. `actualizadoEn` es la versión
// leída: el formulario la devuelve al guardar para no pisar cambios de otra persona.
export interface PaginaLeida {
  actualizadoEn: string | null
  secciones: SeccionLeida[]
}

export interface RepositorioDeLecturaDelInicio {
  leerSecciones(): Promise<PaginaLeida>
  // `seccion` nulo: el primer carrusel de la página. `null` si no hay carrusel con ese id.
  leerCarrusel(seccion: string | null): Promise<CarruselGuardado | null>
}

export interface DatosDeLaPaginaDeInicio {
  actualizadoEn: string | null
  secciones: SeccionDelPanel[]
  // Solo se reordena si toda sección tiene id y la página tiene versión.
  ordenable: boolean
}

export async function obtenerPaginaDeInicio(
  repositorio: RepositorioDeLecturaDelInicio,
): Promise<DatosDeLaPaginaDeInicio> {
  const { actualizadoEn, secciones } = await repositorio.leerSecciones()
  return {
    actualizadoEn,
    secciones: secciones.map((seccion, posicion) => resumenDeSeccion(seccion, posicion)),
    ordenable:
      actualizadoEn !== null && secciones.length > 1 && secciones.every((s) => s.id !== null),
  }
}

const PATRON_DE_SECCION = /^[\w-]{1,64}$/

// El id de la sección llega en la URL: lo que no tiene forma de id no se consulta.
export async function obtenerEdicionDelCarrusel(
  repositorio: RepositorioDeLecturaDelInicio,
  seccionEnLaUrl: unknown,
): Promise<FormularioDelCarrusel | null> {
  if (seccionEnLaUrl !== undefined && typeof seccionEnLaUrl !== 'string') return null
  if (typeof seccionEnLaUrl === 'string' && !PATRON_DE_SECCION.test(seccionEnLaUrl)) return null
  const guardado = await repositorio.leerCarrusel(seccionEnLaUrl ?? null)
  return guardado ? formularioDelCarrusel(guardado) : null
}
