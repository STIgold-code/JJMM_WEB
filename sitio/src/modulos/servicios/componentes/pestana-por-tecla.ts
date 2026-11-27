// Teclado de las pestañas de áreas en rejilla (patrón de pestañas de la WAI-ARIA): las flechas
// laterales mueven una pestaña, las verticales una fila; Inicio y Fin van a los extremos.
// Devuelve el índice destino o null si la tecla no mueve.
export function pestanaPorTecla(
  actual: number,
  tecla: string,
  total: number,
  columnas: number,
): number | null {
  const desplazamientos: Record<string, number> = {
    ArrowRight: 1,
    ArrowLeft: -1,
    ArrowDown: columnas,
    ArrowUp: -columnas,
  }
  if (tecla === 'Home') return 0
  if (tecla === 'End') return total - 1
  const paso = desplazamientos[tecla]
  if (paso === undefined) return null
  return (((actual + paso) % total) + total) % total
}
