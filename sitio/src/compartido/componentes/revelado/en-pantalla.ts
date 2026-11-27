interface BordesVerticales {
  top: number
  bottom: number
}

// Indica si un elemento ya se ve, aunque sea en parte, en la ventana del navegador.
export function estaEnPantalla(bordes: BordesVerticales, altoDeVentana: number): boolean {
  return bordes.top < altoDeVentana && bordes.bottom > 0
}
