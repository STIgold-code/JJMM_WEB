import type { Rol } from '@/compartido/dominio/roles'

import { puedeEliminarDelCatalogo } from '../dominio/catalogo'
import { leerId } from '../dominio/identificadores'
import { ordenAlFinal } from '../dominio/orden'
import {
  AVISO_DE_VALOR_CREADO,
  AVISO_DE_VALOR_GUARDADO,
  avisoDeValorEliminado,
  type ErroresDeValor,
  validarFormularioDeValor,
  type ValorValidado,
} from '../dominio/valores'
import { ERROR_SIN_PERMISO, type ResultadoDelRepositorio } from './gestionar-mensajes'
import { ordenarLista, type RepositorioOrdenable, type TextosDeOrden } from './ordenar-lista'
import {
  type EstadoDelGuardado,
  estadoDelRechazo,
  type RechazoDelRepositorio,
  type ResultadoDeAccionRapida,
  type ResultadoDeCreacion,
  textoDelRechazo,
} from './resultados-de-escritura'

// Escrituras sobre los valores de «¿Por qué elegirnos?». Todo lo que llega del navegador es
// `unknown` y se valida aquí; el repositorio escribe con los permisos de la sesión.
export interface RepositorioDeEscrituraDeValores extends RepositorioOrdenable {
  crear(datos: ValorValidado, orden: number): Promise<ResultadoDeCreacion>
  guardar(id: number, datos: ValorValidado): Promise<ResultadoDelRepositorio>
  eliminar(id: number): Promise<ResultadoDelRepositorio>
}

export type EstadoDelGuardadoDeValor = EstadoDelGuardado<ErroresDeValor>

export const TEXTOS_DE_VALORES: TextosDeOrden = {
  inexistente: 'No encontramos ese valor. Puede que alguien lo haya eliminado; recarga la página.',
  invalido:
    'No se pudo guardar: el valor tiene datos que no son válidos. Ábrelo, corrígelos y vuelve a intentarlo.',
  listaCambiada:
    'La lista de valores cambió mientras ordenabas. Recarga la página e inténtalo de nuevo.',
}

export function ordenarValores(repositorio: RepositorioDeEscrituraDeValores, ids: unknown) {
  return ordenarLista(repositorio, ids, TEXTOS_DE_VALORES)
}

function erroresDelCampo(campo: string): ErroresDeValor | undefined {
  if (campo === 'nombre') return { nombre: 'Revisa el nombre del valor.' }
  if (campo === 'icono') return { icono: 'Elige un ícono.' }
  return undefined
}

const rechazado = (rechazo: RechazoDelRepositorio): EstadoDelGuardadoDeValor =>
  estadoDelRechazo<ErroresDeValor>(rechazo, erroresDelCampo, TEXTOS_DE_VALORES)

// `id` nulo crea un valor nuevo, al final de la sección; cualquier otro valor tiene que ser un id.
export async function guardarValor(
  repositorio: RepositorioDeEscrituraDeValores,
  entrada: { id: unknown; formulario: unknown },
): Promise<EstadoDelGuardadoDeValor> {
  const id = entrada.id === null ? null : leerId(entrada.id)
  if (entrada.id !== null && id === null)
    return { estado: 'error', error: TEXTOS_DE_VALORES.inexistente }
  const validacion = validarFormularioDeValor(entrada.formulario)
  if (!validacion.valido) return { estado: 'invalido', errores: validacion.errores }
  if (id === null) {
    const orden = ordenAlFinal(await repositorio.listarPosiciones())
    const creacion = await repositorio.crear(validacion.datos, orden)
    return creacion.estado === 'hecho'
      ? { estado: 'guardado', aviso: AVISO_DE_VALOR_CREADO }
      : rechazado(creacion)
  }
  const escritura = await repositorio.guardar(id, validacion.datos)
  if (escritura.estado !== 'hecho') return rechazado(escritura)
  return { estado: 'guardado', aviso: AVISO_DE_VALOR_GUARDADO }
}

// El rol sale de la sesión del servidor, nunca del navegador.
export async function eliminarValor(
  repositorio: RepositorioDeEscrituraDeValores,
  entrada: { id: unknown; rol: Rol },
): Promise<ResultadoDeAccionRapida> {
  if (!puedeEliminarDelCatalogo(entrada.rol)) return { ok: false, error: ERROR_SIN_PERMISO }
  const id = leerId(entrada.id)
  if (id === null) return { ok: false, error: TEXTOS_DE_VALORES.inexistente }
  const escritura = await repositorio.eliminar(id)
  if (escritura.estado !== 'hecho')
    return { ok: false, error: textoDelRechazo(escritura, TEXTOS_DE_VALORES) }
  return { ok: true, aviso: avisoDeValorEliminado(escritura.nombre) }
}
