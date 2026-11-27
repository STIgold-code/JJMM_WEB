import { prepararSede, type SedePublica } from '../dominio/sede'
import type { RepositorioSedes } from './repositorio-sedes'

export function crearListarSedes(repositorio: RepositorioSedes) {
  return async (): Promise<SedePublica[]> => {
    const sedes = await repositorio.listarActivas()
    return sedes.map(prepararSede)
  }
}
