import type { Rol } from '@/compartido/dominio/roles'

import { puedeEliminarDelCatalogo } from '../dominio/catalogo'
import {
  avisoDeClienteCreado,
  avisoDeClienteEliminado,
  avisoDeClienteGuardado,
  avisoDeVisibilidadDeCliente,
  type ClienteDelPanel,
} from '../dominio/clientes'
import { leerId } from '../dominio/identificadores'
import { ordenAlFinal } from '../dominio/orden'
import {
  type ClienteValidado,
  ERROR_DE_ENLACE,
  ERROR_DE_LOGO,
  type ErroresDeCliente,
  validarFormularioDeCliente,
} from '../dominio/validacion-de-cliente'
import { ERROR_SIN_PERMISO, type ResultadoDelRepositorio } from './gestionar-mensajes'
import { ordenarLista, type RepositorioOrdenable, type TextosDeOrden } from './ordenar-lista'
import {
  ERROR_DE_VALOR,
  type EstadoDelGuardado,
  estadoDelRechazo,
  type RechazoDelRepositorio,
  type ResultadoDeAccionRapida,
  type ResultadoDeCreacion,
  textoDelRechazo,
} from './resultados-de-escritura'

// Lecturas de la pantalla «Clientes», con los permisos de quien entra y en el orden del sitio.
export interface RepositorioDeLecturaDeClientes {
  listarClientes(): Promise<ClienteDelPanel[]>
}

// Escrituras sobre los clientes. Todo lo que llega del navegador es `unknown` y se valida aquí;
// el repositorio escribe con los permisos de la sesión.
export interface RepositorioDeEscrituraDeClientes extends RepositorioOrdenable {
  cambiarVisibilidad(id: number, visible: boolean): Promise<ResultadoDelRepositorio>
  crear(datos: ClienteValidado, orden: number): Promise<ResultadoDeCreacion>
  guardar(id: number, datos: ClienteValidado): Promise<ResultadoDelRepositorio>
  eliminar(id: number): Promise<ResultadoDelRepositorio>
}

export type EstadoDelGuardadoDeCliente = EstadoDelGuardado<ErroresDeCliente>

export const TEXTOS_DE_CLIENTES: TextosDeOrden = {
  inexistente:
    'No encontramos ese cliente. Puede que alguien lo haya eliminado; recarga la página.',
  invalido:
    'No se pudo guardar: el cliente tiene datos que no son válidos. Ábrelo, corrígelos y vuelve a intentarlo.',
  listaCambiada:
    'La lista de clientes cambió mientras ordenabas. Recarga la página e inténtalo de nuevo.',
}

const fallo = (error: string): ResultadoDeAccionRapida => ({ ok: false, error })

export function ordenarClientes(repositorio: RepositorioDeEscrituraDeClientes, ids: unknown) {
  return ordenarLista(repositorio, ids, TEXTOS_DE_CLIENTES)
}

export async function cambiarVisibilidadDeCliente(
  repositorio: RepositorioDeEscrituraDeClientes,
  entrada: { id: unknown; visible: unknown },
): Promise<ResultadoDeAccionRapida> {
  const id = leerId(entrada.id)
  if (id === null) return fallo(TEXTOS_DE_CLIENTES.inexistente)
  const { visible } = entrada
  if (typeof visible !== 'boolean') return fallo(ERROR_DE_VALOR)
  const escritura = await repositorio.cambiarVisibilidad(id, visible)
  if (escritura.estado !== 'hecho') return fallo(textoDelRechazo(escritura, TEXTOS_DE_CLIENTES))
  return { ok: true, aviso: avisoDeVisibilidadDeCliente(escritura.nombre, visible) }
}

function erroresDelCampo(campo: string): ErroresDeCliente | undefined {
  if (campo === 'nombre') return { nombre: 'Revisa el nombre del cliente.' }
  if (campo === 'logo') return { logo: ERROR_DE_LOGO }
  if (campo === 'enlace') return { enlace: ERROR_DE_ENLACE }
  return undefined
}

const rechazado = (rechazo: RechazoDelRepositorio): EstadoDelGuardadoDeCliente =>
  estadoDelRechazo<ErroresDeCliente>(rechazo, erroresDelCampo, TEXTOS_DE_CLIENTES)

// `id` nulo crea un cliente nuevo, al final del carrusel; cualquier otro valor tiene que ser un id.
export async function guardarCliente(
  repositorio: RepositorioDeEscrituraDeClientes,
  entrada: { id: unknown; formulario: unknown },
): Promise<EstadoDelGuardadoDeCliente> {
  const id = entrada.id === null ? null : leerId(entrada.id)
  if (entrada.id !== null && id === null)
    return { estado: 'error', error: TEXTOS_DE_CLIENTES.inexistente }
  const validacion = validarFormularioDeCliente(entrada.formulario)
  if (!validacion.valido) return { estado: 'invalido', errores: validacion.errores }
  const { datos } = validacion
  if (id === null) {
    const orden = ordenAlFinal(await repositorio.listarPosiciones())
    const creacion = await repositorio.crear(datos, orden)
    if (creacion.estado !== 'hecho') return rechazado(creacion)
    return { estado: 'guardado', aviso: avisoDeClienteCreado(datos.visible) }
  }
  const escritura = await repositorio.guardar(id, datos)
  if (escritura.estado !== 'hecho') return rechazado(escritura)
  return { estado: 'guardado', aviso: avisoDeClienteGuardado(datos.visible) }
}

// El rol sale de la sesión del servidor, nunca del navegador.
export async function eliminarCliente(
  repositorio: RepositorioDeEscrituraDeClientes,
  entrada: { id: unknown; rol: Rol },
): Promise<ResultadoDeAccionRapida> {
  if (!puedeEliminarDelCatalogo(entrada.rol)) return fallo(ERROR_SIN_PERMISO)
  const id = leerId(entrada.id)
  if (id === null) return fallo(TEXTOS_DE_CLIENTES.inexistente)
  const escritura = await repositorio.eliminar(id)
  if (escritura.estado !== 'hecho') return fallo(textoDelRechazo(escritura, TEXTOS_DE_CLIENTES))
  return { ok: true, aviso: avisoDeClienteEliminado(escritura.nombre) }
}
