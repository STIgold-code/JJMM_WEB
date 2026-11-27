const PASOS: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 }

// Teclado de las pestañas de sedes, que forman una sola fila (patrón de pestañas de la
// WAI-ARIA): las flechas laterales mueven una pestaña y dan la vuelta; Inicio y Fin van a los
// extremos. Devuelve el índice destino o null si la tecla no mueve.
export function sedePorTecla(actual: number, tecla: string, total: number): number | null {
  if (tecla === 'Home') return 0
  if (tecla === 'End') return total - 1
  const paso = PASOS[tecla]
  if (paso === undefined) return null
  return (actual + paso + total) % total
}
