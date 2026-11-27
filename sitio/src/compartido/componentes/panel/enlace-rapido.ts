// Acceso directo del inicio del panel.
export interface EnlaceRapido {
  clave: string
  etiqueta: string
  href: string
}

// «1 mensaje nuevo», «3 mensajes nuevos» o nada cuando no hay pendientes.
export function textoDeMensajesNuevos(cantidad: number): string | null {
  if (cantidad <= 0) return null
  return cantidad === 1 ? '1 mensaje nuevo' : `${cantidad} mensajes nuevos`
}

export function saludo(nombre: string | null | undefined): string {
  const limpio = nombre?.trim()
  return limpio ? `Hola, ${limpio}.` : 'Hola.'
}
