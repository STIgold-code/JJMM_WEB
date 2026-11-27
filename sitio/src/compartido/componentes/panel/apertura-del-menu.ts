// Payload cierra el menú lateral al cargar en pantallas de hasta 1440 px, aunque en un
// escritorio de 1025 a 1440 px cabe junto al contenido. Esta regla decide si abrirlo una vez.
export interface EstadoDelMenu {
  // Media queries de Payload: «l» (hasta 1440 px) y «m» (hasta 1024 px).
  hasta1440: boolean
  hasta1024: boolean
  abierto: boolean
  // Ya se abrió automáticamente en esta sesión: si la persona lo cerró, se respeta.
  yaAbierto: boolean
}

export function debeAbrirMenu({
  hasta1440,
  hasta1024,
  abierto,
  yaAbierto,
}: EstadoDelMenu): boolean {
  return hasta1440 && !hasta1024 && !abierto && !yaAbierto
}
