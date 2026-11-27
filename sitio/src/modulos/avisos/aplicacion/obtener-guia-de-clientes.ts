import { type GuiaDeClientes, prepararGuia } from '../dominio/guia-de-clientes'
import type { RepositorioGuiaDeClientes } from './repositorio-guia-de-clientes'

export function crearObtenerGuiaDeClientes(repositorio: RepositorioGuiaDeClientes) {
  return async (): Promise<GuiaDeClientes | null> => prepararGuia(await repositorio.obtener())
}
