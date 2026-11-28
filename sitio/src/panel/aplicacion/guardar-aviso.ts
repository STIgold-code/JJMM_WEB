import { avisoDeAvisoCreado, avisoDeAvisoGuardado } from '../dominio/avisos-para-clientes'
import { leerId } from '../dominio/identificadores'
import { ordenAlFinal } from '../dominio/orden'
import { ERROR_DE_CORREO } from '../dominio/respuesta-al-mensaje'
import { type ErroresDeAviso, validarFormularioDeAviso } from '../dominio/validacion-de-aviso'
import {
  ERROR_DE_AVISO_INEXISTENTE,
  type RepositorioDeEscrituraDeAvisos,
  TEXTOS_DE_RECHAZO_DE_AVISOS,
} from './gestionar-avisos'
import {
  type EstadoDelGuardado,
  estadoDelRechazo,
  type RechazoDelRepositorio,
} from './resultados-de-escritura'

// Guardar un aviso desde su panel lateral: `id` nulo crea uno nuevo (oculto y al final de la
// lista); cualquier otro valor tiene que ser el id de un aviso.
export type EstadoDelGuardadoDeAviso = EstadoDelGuardado<ErroresDeAviso>

const ERROR_DE_DOCUMENTOS = 'Revisa los documentos: cada línea debe tener texto.'

// Campos de la colección → campos del formulario, con el texto del panel.
function erroresDelCampo(campo: string): ErroresDeAviso | undefined {
  if (campo === 'titulo') return { titulo: 'Revisa el título del aviso.' }
  if (campo === 'cuandoAplica') return { cuandoAplica: 'Revisa cuándo aplica el aviso.' }
  if (campo === 'correoDeContacto') return { correo: ERROR_DE_CORREO }
  if (campo === 'documentos' || campo.startsWith('documentos.'))
    return { documentos: ERROR_DE_DOCUMENTOS }
  return undefined
}

const rechazado = (rechazo: RechazoDelRepositorio): EstadoDelGuardadoDeAviso =>
  estadoDelRechazo<ErroresDeAviso>(rechazo, erroresDelCampo, TEXTOS_DE_RECHAZO_DE_AVISOS)

export async function guardarAviso(
  repositorio: RepositorioDeEscrituraDeAvisos,
  entrada: { id: unknown; formulario: unknown },
): Promise<EstadoDelGuardadoDeAviso> {
  const id = entrada.id === null ? null : leerId(entrada.id)
  if (entrada.id !== null && id === null)
    return { estado: 'error', error: ERROR_DE_AVISO_INEXISTENTE }
  const validacion = validarFormularioDeAviso(entrada.formulario)
  if (!validacion.valido) return { estado: 'invalido', errores: validacion.errores }
  const { datos } = validacion
  if (id === null) {
    const orden = ordenAlFinal(await repositorio.listarPosiciones())
    const creacion = await repositorio.crear(datos, orden)
    if (creacion.estado !== 'hecho') return rechazado(creacion)
    return { estado: 'guardado', aviso: avisoDeAvisoCreado(datos.titulo) }
  }
  const escritura = await repositorio.guardar(id, datos)
  if (escritura.estado !== 'hecho') return rechazado(escritura)
  return { estado: 'guardado', aviso: avisoDeAvisoGuardado(escritura.visible) }
}
