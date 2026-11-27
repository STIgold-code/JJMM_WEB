// Identificadores del DOM que comparten el listado y el panel lateral: al cerrar el panel, el
// foco vuelve a la fila del mensaje o, si ya no está (eliminado o fuera del filtro), al listado.
export const ID_DE_LISTA = 'lista-de-mensajes'

export const idDeFila = (id: number): string => `fila-mensaje-${id}`
