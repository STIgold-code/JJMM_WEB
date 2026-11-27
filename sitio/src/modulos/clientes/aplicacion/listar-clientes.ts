import type { Imagen } from '@/compartido/dominio/imagen'

// Cliente visible del carrusel «Nuestros clientes». Solo clientes reales (S9).
export interface ClienteVisible {
  nombre: string
  logo: Imagen
  enlace: string | null
}

export interface RepositorioClientes {
  // Solo los visibles, en el orden del panel.
  listarVisibles(): Promise<readonly ClienteVisible[]>
}

export function crearListarClientes(repositorio: RepositorioClientes) {
  return (): Promise<readonly ClienteVisible[]> => repositorio.listarVisibles()
}
