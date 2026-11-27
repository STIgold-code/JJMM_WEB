import {
  armarMatrizDePlanes,
  type CaracteristicaGuardada,
  type InclusionGuardada,
  type MatrizDePlanes,
  type PlanGuardado,
} from '../dominio/matriz-de-planes'

// Las tres colecciones normalizadas de la matriz, cada una en el orden del panel.
export interface RepositorioPlanes {
  listarPlanes(): Promise<readonly PlanGuardado[]>
  listarCaracteristicas(): Promise<readonly CaracteristicaGuardada[]>
  listarInclusiones(): Promise<readonly InclusionGuardada[]>
}

export function crearObtenerMatrizDePlanes(repositorio: RepositorioPlanes) {
  return async (): Promise<MatrizDePlanes | null> => {
    const [planes, caracteristicas, inclusiones] = await Promise.all([
      repositorio.listarPlanes(),
      repositorio.listarCaracteristicas(),
      repositorio.listarInclusiones(),
    ])
    return armarMatrizDePlanes(planes, caracteristicas, inclusiones)
  }
}
