import type { Valor } from '../dominio/valor'

export interface RepositorioValores {
  // En el orden del panel.
  listar(): Promise<readonly Valor[]>
}

export function crearListarValores(repositorio: RepositorioValores) {
  return (): Promise<readonly Valor[]> => repositorio.listar()
}
