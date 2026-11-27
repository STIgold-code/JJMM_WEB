// Payload cierra el menú lateral al cargar y en cada cambio de página en pantallas de hasta
// 1440 px, aunque en un escritorio de 1025 a 1440 px cabe junto al contenido. Estas reglas lo
// mantienen abierto ahí, salvo que la persona lo haya cerrado con el botón.
export interface EstadoDelMenu {
  // Media queries de Payload: «l» (hasta 1440 px) y «m» (hasta 1024 px).
  hasta1440: boolean
  hasta1024: boolean
  abierto: boolean
  // La persona lo cerró con el botón del menú: se respeta hasta que lo vuelva a abrir.
  cerradoPorLaPersona: boolean
}

export type EleccionDelMenu = 'abierto' | 'cerrado'

export function debeAbrirMenu({
  hasta1440,
  hasta1024,
  abierto,
  cerradoPorLaPersona,
}: EstadoDelMenu): boolean {
  return hasta1440 && !hasta1024 && !abierto && !cerradoPorLaPersona
}

// El botón del menú alterna su estado: pulsarlo con el menú abierto es pedir que se cierre.
export function eleccionAlPulsarElBoton(abierto: boolean): EleccionDelMenu {
  return abierto ? 'cerrado' : 'abierto'
}
