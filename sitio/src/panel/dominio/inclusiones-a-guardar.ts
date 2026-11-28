import type { InclusionDelPanel } from './planes'
import type { CeldaValidada } from './validacion-de-plan'

// Del formulario a `inclusiones-de-plan` (una fila por plan + característica): se escribe solo
// lo que cambió. Una celda sin fila guardada ya se muestra como «No incluido», así que no se
// crea una fila para dejarla igual.
export interface CambiosDeInclusiones {
  crear: CeldaValidada[]
  actualizar: (CeldaValidada & { id: number })[]
}

const igual = (guardada: InclusionDelPanel, celda: CeldaValidada): boolean =>
  guardada.tipo === celda.tipo && (guardada.texto ?? null) === celda.texto

export function cambiosDeInclusiones(
  guardadasDelPlan: readonly InclusionDelPanel[],
  celdas: readonly CeldaValidada[],
): CambiosDeInclusiones {
  const porCaracteristica = new Map(guardadasDelPlan.map((i) => [i.caracteristica, i]))
  const cambios: CambiosDeInclusiones = { crear: [], actualizar: [] }
  for (const celda of celdas) {
    const guardada = porCaracteristica.get(celda.caracteristica)
    if (guardada && !igual(guardada, celda)) cambios.actualizar.push({ id: guardada.id, ...celda })
    if (!guardada && celda.tipo !== 'no-incluido') cambios.crear.push(celda)
  }
  return cambios
}
