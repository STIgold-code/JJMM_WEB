import { leerId } from '../dominio/identificadores'
import type { Aviso } from '../dominio/respuesta-al-mensaje'
import {
  type AreaValidada,
  ERROR_DE_POLIGONO,
  type ErroresDeArea,
  validarFormularioDeArea,
} from '../dominio/validacion-de-area'
import type { ResultadoDelRepositorio } from './gestionar-mensajes'
import { ordenarLista, type RepositorioOrdenable, type TextosDeOrden } from './ordenar-lista'
import {
  type EstadoDelGuardado,
  estadoDelRechazo,
  type ResultadoDeAccionRapida,
} from './resultados-de-escritura'

// Escrituras sobre las áreas de servicio: orden y edición. No hay crear ni eliminar (las nueve
// áreas son los gajos fijos de la rueda). Todo lo que llega del navegador es `unknown` y se valida
// aquí; el repositorio escribe con los permisos de la sesión.
export interface RepositorioDeEscrituraDeAreas extends RepositorioOrdenable {
  // Solo los campos que edita el panel: nunca el código ni el orden.
  guardar(id: number, datos: AreaValidada): Promise<ResultadoDelRepositorio>
}

export type EstadoDelGuardadoDeArea = EstadoDelGuardado<ErroresDeArea>

export const ERROR_DE_AREA_INEXISTENTE =
  'No encontramos esa área. Puede que alguien la haya eliminado; recarga la página.'

export const TEXTOS_DE_AREAS: TextosDeOrden = {
  inexistente: ERROR_DE_AREA_INEXISTENTE,
  invalido:
    'No se pudo guardar: el área tiene datos que no son válidos. Ábrela, corrígelos y vuelve a intentarlo.',
  listaCambiada:
    'La lista de áreas cambió mientras ordenabas. Recarga la página e inténtalo de nuevo.',
}

export const AVISO_DE_AREA_GUARDADA: Aviso = {
  titulo: 'Área guardada',
  detalle: '«Nuestros servicios» ya muestra los cambios en la rueda y en su pestaña.',
}

export function ordenarAreas(
  repositorio: RepositorioDeEscrituraDeAreas,
  idsEnOrden: unknown,
): Promise<ResultadoDeAccionRapida> {
  return ordenarLista(repositorio, idsEnOrden, TEXTOS_DE_AREAS)
}

const PUNTO = /^puntos\.(\d+)(?:\.texto)?$/

// Campos de la colección → campos del formulario, con el texto del panel.
function erroresDelCampo(campo: string): ErroresDeArea | undefined {
  const punto = PUNTO.exec(campo)
  if (punto?.[1]) return { punto: { [Number(punto[1])]: 'Revisa este punto.' } }
  const textos: Record<string, ErroresDeArea> = {
    nombre: { nombre: 'Revisa el nombre del área.' },
    nombreCorto: { nombreCorto: 'Revisa el nombre corto.' },
    descripcion: { descripcion: 'Revisa la descripción.' },
    puntos: { puntos: 'Revisa los puntos de «Qué incluye».' },
    mensajeDeConsulta: { mensaje: 'Revisa el mensaje de WhatsApp.' },
    poligonoEnLaRueda: { poligono: ERROR_DE_POLIGONO },
  }
  return textos[campo]
}

export async function guardarArea(
  repositorio: RepositorioDeEscrituraDeAreas,
  entrada: { id: unknown; formulario: unknown },
): Promise<EstadoDelGuardadoDeArea> {
  const id = leerId(entrada.id)
  if (id === null) return { estado: 'error', error: ERROR_DE_AREA_INEXISTENTE }
  const validacion = validarFormularioDeArea(entrada.formulario)
  if (!validacion.valido) return { estado: 'invalido', errores: validacion.errores }
  const escritura = await repositorio.guardar(id, validacion.datos)
  if (escritura.estado !== 'hecho')
    return estadoDelRechazo<ErroresDeArea>(escritura, erroresDelCampo, TEXTOS_DE_AREAS)
  return { estado: 'guardado', aviso: AVISO_DE_AREA_GUARDADA }
}
