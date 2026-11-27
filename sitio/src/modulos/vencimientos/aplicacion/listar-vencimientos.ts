import { agruparPorPeriodicidad, type GrupoDeVencimientos } from '../dominio/vencimiento'
import type { RepositorioVencimientos } from './repositorio-vencimientos'

export function crearListarVencimientos(repositorio: RepositorioVencimientos) {
  return async (): Promise<GrupoDeVencimientos[]> =>
    agruparPorPeriodicidad(await repositorio.listar())
}
