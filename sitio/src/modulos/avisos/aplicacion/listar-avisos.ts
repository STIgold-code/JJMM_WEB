import { type AvisoPublico, prepararAviso } from '../dominio/aviso'
import type { RepositorioAvisos } from './repositorio-avisos'

export function crearListarAvisos(repositorio: RepositorioAvisos) {
  return async (): Promise<AvisoPublico[]> => {
    const avisos = await repositorio.listarActivos()
    return avisos.map(prepararAviso)
  }
}
