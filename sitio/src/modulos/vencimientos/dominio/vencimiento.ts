// Obligación de la guía de clientes y cuándo vence, como texto (S7).
export type Periodicidad = 'mensual' | 'anual'

export interface Vencimiento {
  obligacion: string
  periodicidad: Periodicidad
  cuandoVence: string
  nota: string | null
}

export interface GrupoDeVencimientos {
  periodicidad: Periodicidad
  titulo: string
  vencimientos: Vencimiento[]
}

// Orden de los grupos en la página y su nombre, igual que las opciones del panel.
const GRUPOS: readonly { periodicidad: Periodicidad; titulo: string }[] = [
  { periodicidad: 'mensual', titulo: 'Mensuales' },
  { periodicidad: 'anual', titulo: 'Anuales' },
]

// Agrupa por periodicidad y respeta, dentro de cada grupo, el orden del panel.
export function agruparPorPeriodicidad(
  vencimientos: readonly Vencimiento[],
): GrupoDeVencimientos[] {
  return GRUPOS.map(({ periodicidad, titulo }) => ({
    periodicidad,
    titulo,
    vencimientos: vencimientos.filter((v) => v.periodicidad === periodicidad),
  })).filter((grupo) => grupo.vencimientos.length > 0)
}
