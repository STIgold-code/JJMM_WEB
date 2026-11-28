import type { Rol } from '@/compartido/dominio/roles'

import { puedeEliminarEnLaGuia } from '../dominio/guia-de-clientes'
import { leerId } from '../dominio/identificadores'
import { ordenAlFinal, type PosicionGuardada } from '../dominio/orden'
import {
  type ErroresDeVencimiento,
  validarFormularioDeVencimiento,
  type VencimientoValidado,
} from '../dominio/validacion-de-vencimiento'
import {
  avisoDeVencimientoEliminado,
  avisoDeVencimientoGuardado,
} from '../dominio/vencimientos-del-panel'
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

// Escrituras sobre los vencimientos de la guía. Lo que llega del navegador es `unknown` y se
// valida aquí; el repositorio escribe con los permisos de la sesión.
export interface RepositorioDeEscrituraDeVencimientos {
  listarPosiciones(): Promise<PosicionGuardada[]>
  crear(datos: VencimientoValidado, orden: number): Promise<ResultadoDeCreacion>
  guardar(id: number, datos: VencimientoValidado): Promise<ResultadoDeEscritura>
  eliminar(id: number): Promise<ResultadoDelRepositorio>
}

export type EstadoDelGuardadoDeVencimiento = EstadoDelGuardado<ErroresDeVencimiento>

export const ERROR_DE_VENCIMIENTO_INEXISTENTE =
  'No encontramos ese vencimiento. Puede que alguien lo haya eliminado; recarga la página.'
export const ERROR_DE_DATOS_DEL_VENCIMIENTO =
  'No se pudo guardar: el vencimiento tiene datos que no son válidos. Revísalos y vuelve a intentarlo.'

const TEXTOS = {
  inexistente: ERROR_DE_VENCIMIENTO_INEXISTENTE,
  invalido: ERROR_DE_DATOS_DEL_VENCIMIENTO,
}

const ERRORES_POR_CAMPO: Readonly<Record<string, ErroresDeVencimiento>> = {
  obligacion: { obligacion: 'Revisa la obligación.' },
  cuandoVence: { cuandoVence: 'Revisa cuándo vence.' },
  nota: { nota: 'Revisa la nota.' },
}

const rechazado = (rechazo: RechazoDelRepositorio): EstadoDelGuardadoDeVencimiento =>
  estadoDelRechazo<ErroresDeVencimiento>(rechazo, (campo) => ERRORES_POR_CAMPO[campo], TEXTOS)

// `id` nulo crea uno nuevo, al final de la lista; cualquier otro valor tiene que ser un id.
export async function guardarVencimiento(
  repositorio: RepositorioDeEscrituraDeVencimientos,
  entrada: { id: unknown; formulario: unknown },
): Promise<EstadoDelGuardadoDeVencimiento> {
  const id = entrada.id === null ? null : leerId(entrada.id)
  if (entrada.id !== null && id === null)
    return { estado: 'error', error: ERROR_DE_VENCIMIENTO_INEXISTENTE }
  const validacion = validarFormularioDeVencimiento(entrada.formulario)
  if (!validacion.valido) return { estado: 'invalido', errores: validacion.errores }
  const { datos } = validacion
  const escritura =
    id === null
      ? await repositorio.crear(datos, ordenAlFinal(await repositorio.listarPosiciones()))
      : await repositorio.guardar(id, datos)
  if (escritura.estado !== 'hecho') return rechazado(escritura)
  return { estado: 'guardado', aviso: avisoDeVencimientoGuardado(datos.obligacion, id === null) }
}

// El rol sale de la sesión del servidor, nunca del navegador.
export async function eliminarVencimiento(
  repositorio: RepositorioDeEscrituraDeVencimientos,
  entrada: { id: unknown; rol: Rol },
): Promise<ResultadoDeAccionRapida> {
  if (!puedeEliminarEnLaGuia(entrada.rol)) return { ok: false, error: ERROR_SIN_PERMISO }
  const id = leerId(entrada.id)
  if (id === null) return { ok: false, error: ERROR_DE_VENCIMIENTO_INEXISTENTE }
  const escritura = await repositorio.eliminar(id)
  if (escritura.estado !== 'hecho') return { ok: false, error: textoDelRechazo(escritura, TEXTOS) }
  return { ok: true, aviso: avisoDeVencimientoEliminado(escritura.nombre) }
}
