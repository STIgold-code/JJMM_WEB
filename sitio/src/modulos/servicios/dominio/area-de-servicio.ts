// Las nueve áreas del sistema SIGE Mype se identifican de P1 a P9.
const PATRON_CODIGO = /^P[1-9]$/

// Gajo de la rueda SIGE Mype: puntos «x,y» de un polígono SVG sobre la imagen de la rueda.
const PATRON_PUNTO = /^\d+(?:\.\d+)?,\d+(?:\.\d+)?$/
const MINIMO_DE_PUNTOS = 3

export function esCodigoDeAreaValido(codigo: string): boolean {
  return PATRON_CODIGO.test(codigo)
}

export function esListaDePuntosValida(puntos: string): boolean {
  const pares = puntos.trim().split(/\s+/)
  return pares.length >= MINIMO_DE_PUNTOS && pares.every((par) => PATRON_PUNTO.test(par))
}
