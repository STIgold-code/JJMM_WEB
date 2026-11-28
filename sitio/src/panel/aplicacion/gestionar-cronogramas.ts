import type { Rol } from '@/compartido/dominio/roles'
import { nombreDelPeriodo } from '@/modulos/vencimientos/dominio/cronograma-sunat'

import {
  avisoDeCronogramaEliminado,
  avisoDeCronogramaGuardado,
} from '../dominio/cronogramas-del-panel'
import { puedeEliminarEnLaGuia } from '../dominio/guia-de-clientes'
import { leerId } from '../dominio/identificadores'
import {
  type CronogramaValidado,
  ERROR_DE_FECHA,
  type ErroresDeCronograma,
  validarFormularioDeCronograma,
} from '../dominio/validacion-de-cronograma'
import { ERROR_SIN_PERMISO, type ResultadoDelRepositorio } from './gestionar-mensajes'
import {
  type EstadoDelGuardado,
  estadoDelRechazo,
  type RechazoDelRepositorio,
  type ResultadoDeAccionRapida,
  type ResultadoDeCreacion,
  type ResultadoDeEscritura,
  textoDelRechazo,
} from './resultados-de-escritura'

// Escrituras sobre los cronogramas de SUNAT. Lo que llega del navegador es `unknown` y se valida
// aquí; el repositorio escribe con los permisos de la sesión y la colección vuelve a validar.
export interface PeriodoGuardado {
  id: number
  anio: number
  mes: number
}

export interface RepositorioDeEscrituraDeCronogramas {
  listarPeriodos(): Promise<PeriodoGuardado[]>
  crear(datos: CronogramaValidado): Promise<ResultadoDeCreacion>
  guardar(id: number, datos: CronogramaValidado): Promise<ResultadoDeEscritura>
  eliminar(id: number): Promise<ResultadoDelRepositorio>
}

export type EstadoDelGuardadoDeCronograma = EstadoDelGuardado<ErroresDeCronograma>

export const ERROR_DE_CRONOGRAMA_INEXISTENTE =
  'No encontramos ese cronograma. Puede que alguien lo haya eliminado; recarga la página.'
export const ERROR_DE_DATOS_DEL_CRONOGRAMA =
  'No se pudo guardar: el cronograma tiene datos que no son válidos. Revísalos y vuelve a intentarlo.'
export const ERROR_DE_PERIODO_REPETIDO =
  'Ya hay un cronograma para ese periodo. Edítalo en la lista en vez de crear otro.'

const TEXTOS = {
  inexistente: ERROR_DE_CRONOGRAMA_INEXISTENTE,
  invalido: ERROR_DE_DATOS_DEL_CRONOGRAMA,
}

// Las fechas se escriben en el orden de su dígito, así la fila que nombra Payload es el dígito.
const CAMPO_DE_FECHA = /^fechasPorDigito\.(\d)\./

function erroresDelCampo(campo: string): ErroresDeCronograma | undefined {
  const digito = CAMPO_DE_FECHA.exec(campo)?.[1]
  if (digito !== undefined) return { fechas: { [Number(digito)]: ERROR_DE_FECHA } }
  if (campo === 'anio') return { anio: 'Revisa el año.' }
  if (campo === 'mes') return { mes: 'Revisa el mes.' }
  if (campo === 'fechaBuenosContribuyentes') return { buenosContribuyentes: ERROR_DE_FECHA }
  return undefined
}

const rechazado = (rechazo: RechazoDelRepositorio): EstadoDelGuardadoDeCronograma =>
  estadoDelRechazo<ErroresDeCronograma>(rechazo, erroresDelCampo, TEXTOS)

// Un solo cronograma por año y mes (la colección tiene un índice único): se avisa antes de
// escribir, junto al mes.
const repetido = (
  periodos: readonly PeriodoGuardado[],
  datos: CronogramaValidado,
  id: number | null,
) => periodos.some((p) => p.anio === datos.anio && p.mes === datos.mes && p.id !== id)

async function escribir(
  repositorio: RepositorioDeEscrituraDeCronogramas,
  id: number | null,
  datos: CronogramaValidado,
): Promise<EstadoDelGuardadoDeCronograma> {
  if (repetido(await repositorio.listarPeriodos(), datos, id))
    return { estado: 'invalido', errores: { mes: ERROR_DE_PERIODO_REPETIDO } }
  const escritura =
    id === null ? await repositorio.crear(datos) : await repositorio.guardar(id, datos)
  if (escritura.estado !== 'hecho') return rechazado(escritura)
  const periodo = nombreDelPeriodo(datos.anio, datos.mes)
  return { estado: 'guardado', aviso: avisoDeCronogramaGuardado(periodo, id === null) }
}

// `id` nulo crea un cronograma nuevo; cualquier otro valor tiene que ser un id.
export async function guardarCronograma(
  repositorio: RepositorioDeEscrituraDeCronogramas,
  entrada: { id: unknown; formulario: unknown },
): Promise<EstadoDelGuardadoDeCronograma> {
  const id = entrada.id === null ? null : leerId(entrada.id)
  if (entrada.id !== null && id === null)
    return { estado: 'error', error: ERROR_DE_CRONOGRAMA_INEXISTENTE }
  const validacion = validarFormularioDeCronograma(entrada.formulario)
  if (!validacion.valido) return { estado: 'invalido', errores: validacion.errores }
  return escribir(repositorio, id, validacion.datos)
}

// El rol sale de la sesión del servidor, nunca del navegador.
export async function eliminarCronograma(
  repositorio: RepositorioDeEscrituraDeCronogramas,
  entrada: { id: unknown; rol: Rol },
): Promise<ResultadoDeAccionRapida> {
  if (!puedeEliminarEnLaGuia(entrada.rol)) return { ok: false, error: ERROR_SIN_PERMISO }
  const id = leerId(entrada.id)
  if (id === null) return { ok: false, error: ERROR_DE_CRONOGRAMA_INEXISTENTE }
  const escritura = await repositorio.eliminar(id)
  if (escritura.estado !== 'hecho') return { ok: false, error: textoDelRechazo(escritura, TEXTOS) }
  return { ok: true, aviso: avisoDeCronogramaEliminado(escritura.nombre) }
}
