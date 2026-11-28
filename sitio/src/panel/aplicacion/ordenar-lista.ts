import { ordenesAActualizar, type PosicionGuardada } from '../dominio/orden'
import {
  type ResultadoDeAccionRapida,
  type ResultadoDeEscritura,
  textoDelRechazo,
  type TextosDeRechazo,
} from './resultados-de-escritura'

// Lo que necesita cualquier listado ordenable (áreas, valores, clientes) para guardar su orden.
export interface RepositorioOrdenable {
  listarPosiciones(): Promise<PosicionGuardada[]>
  // Todos los cambios o ninguno (una transacción).
  reordenar(cambios: readonly PosicionGuardada[]): Promise<ResultadoDeEscritura>
}

export interface TextosDeOrden extends TextosDeRechazo {
  // La lista del navegador ya no coincide con la guardada.
  listaCambiada: string
}

// Recibe la lista completa de ids en el orden nuevo (`unknown`, del navegador). Sin cambios no
// escribe nada; una lista que no coincide con la guardada no se adivina.
export async function ordenarLista(
  repositorio: RepositorioOrdenable,
  idsEnOrden: unknown,
  textos: TextosDeOrden,
): Promise<ResultadoDeAccionRapida> {
  const cambios = ordenesAActualizar(await repositorio.listarPosiciones(), idsEnOrden)
  if (cambios === null) return { ok: false, error: textos.listaCambiada }
  if (cambios.length === 0) return { ok: true }
  const escritura = await repositorio.reordenar(cambios)
  if (escritura.estado === 'hecho') return { ok: true }
  return { ok: false, error: textoDelRechazo(escritura, textos) }
}
