import {
  type ErroresDelCarrusel,
  erroresDePayloadDelCarrusel,
} from '../dominio/errores-del-carrusel'
import {
  AVISO_DE_ORDEN,
  AVISO_DEL_CARRUSEL,
  ERROR_DATOS_DE_LA_PAGINA,
  ERROR_DESACTUALIZADA,
  ERROR_SIN_CARRUSEL,
} from '../dominio/pagina-de-inicio'
import type { Aviso } from '../dominio/respuesta-al-mensaje'
import { leerMarcaDeTiempo } from '../dominio/secciones-de-inicio'
import {
  type CarruselValidado,
  erroresDeImagenesFaltantes,
  idsDeImagenes,
  validarFormularioDelCarrusel,
} from '../dominio/validacion-del-carrusel'
import {
  ERROR_DE_VALOR,
  type RechazoDelRepositorio,
  textoDelRechazo,
} from './resultados-de-escritura'

// Escrituras de la página de inicio: el carrusel de portadas y el orden de las secciones. El
// repositorio parte siempre de lo guardado: cambia solo eso y deja el resto de las secciones
// intactas. Si la página cambió desde que se abrió el formulario, no escribe.
export type CambioDelInicio =
  | { tipo: 'carrusel'; carrusel: CarruselValidado }
  | { tipo: 'orden'; ids: string[]; actualizadoEn: string }

export type ResultadoDelInicio =
  | { estado: 'hecho'; actualizadoEn: string }
  | { estado: 'desactualizada' }
  | { estado: 'sin-seccion' }
  | RechazoDelRepositorio

export interface RepositorioDeEscrituraDelInicio {
  // Las imágenes de `ids` que existen y la cuenta puede leer.
  imagenesExistentes(ids: readonly number[]): Promise<ReadonlySet<number>>
  actualizar(cambio: CambioDelInicio): Promise<ResultadoDelInicio>
}

// `desactualizada`: el error pide recargar (se muestra fijo, no solo como aviso breve).
export type EstadoDelGuardadoDelInicio<E> =
  | { estado: 'guardado'; aviso: Aviso; actualizadoEn: string }
  | { estado: 'invalido'; errores: E }
  | { estado: 'error'; error: string; desactualizada: boolean }

const TEXTOS = { inexistente: ERROR_SIN_CARRUSEL, invalido: ERROR_DATOS_DE_LA_PAGINA }
const error = (texto: string, desactualizada = false) =>
  ({ estado: 'error', error: texto, desactualizada }) as const

function estadoDelResultado<E>(
  resultado: ResultadoDelInicio,
  aviso: Aviso,
  erroresDeCampos: (campos: string[]) => E | null,
): EstadoDelGuardadoDelInicio<E> {
  if (resultado.estado === 'hecho')
    return { estado: 'guardado', aviso, actualizadoEn: resultado.actualizadoEn }
  if (resultado.estado === 'desactualizada') return error(ERROR_DESACTUALIZADA, true)
  if (resultado.estado === 'sin-seccion') return error(ERROR_SIN_CARRUSEL, true)
  const errores = resultado.estado === 'invalido' ? erroresDeCampos(resultado.campos) : null
  if (errores) return { estado: 'invalido', errores }
  return error(textoDelRechazo(resultado, TEXTOS))
}

export async function guardarCarrusel(
  repositorio: RepositorioDeEscrituraDelInicio,
  formulario: unknown,
): Promise<EstadoDelGuardadoDelInicio<ErroresDelCarrusel>> {
  const validacion = validarFormularioDelCarrusel(formulario)
  if (!validacion.valido) return { estado: 'invalido', errores: validacion.errores }
  const carrusel = validacion.datos
  const existentes = await repositorio.imagenesExistentes(idsDeImagenes(carrusel))
  const faltantes = erroresDeImagenesFaltantes(carrusel, existentes)
  if (faltantes) return { estado: 'invalido', errores: faltantes }
  const resultado = await repositorio.actualizar({ tipo: 'carrusel', carrusel })
  return estadoDelResultado(resultado, AVISO_DEL_CARRUSEL, erroresDePayloadDelCarrusel)
}

// Más de las que puede tener la página: un pedido así no se lee.
const MAXIMO_DE_SECCIONES = 50

function leerIds(valor: unknown): string[] | null {
  if (!Array.isArray(valor) || valor.length > MAXIMO_DE_SECCIONES) return null
  const ids = valor.filter((id): id is string => typeof id === 'string' && id.length <= 64)
  return ids.length === valor.length ? ids : null
}

export async function ordenarSecciones(
  repositorio: RepositorioDeEscrituraDelInicio,
  entrada: { ids: unknown; actualizadoEn: unknown },
): Promise<EstadoDelGuardadoDelInicio<never>> {
  const ids = leerIds(entrada.ids)
  const actualizadoEn = leerMarcaDeTiempo(entrada.actualizadoEn)
  if (!ids || !actualizadoEn) return error(ERROR_DE_VALOR)
  const resultado = await repositorio.actualizar({ tipo: 'orden', ids, actualizadoEn })
  return estadoDelResultado<never>(resultado, AVISO_DE_ORDEN, () => null)
}
