// Relación de contraste de WCAG 2.1 entre dos colores hexadecimales (#rgb o #rrggbb).
// La usa la prueba de colores del panel para comprobar los pares de `_tokens.scss`.
const HEXADECIMAL = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

function canales(color: string): [number, number, number] {
  if (!HEXADECIMAL.test(color)) throw new Error(`«${color}» no es un color hexadecimal`)
  const cifras = color.slice(1)
  const largo = cifras.length === 3 ? cifras.replace(/./g, '$&$&') : cifras
  return [0, 2, 4].map((inicio) => parseInt(largo.slice(inicio, inicio + 2), 16) / 255) as [
    number,
    number,
    number,
  ]
}

const lineal = (canal: number) =>
  canal <= 0.03928 ? canal / 12.92 : ((canal + 0.055) / 1.055) ** 2.4

function luminancia(color: string): number {
  const [rojo, verde, azul] = canales(color).map(lineal) as [number, number, number]
  return 0.2126 * rojo + 0.7152 * verde + 0.0722 * azul
}

export function relacionDeContraste(colorA: string, colorB: string): number {
  const [clara, oscura] = [luminancia(colorA), luminancia(colorB)].sort((a, b) => b - a) as [
    number,
    number,
  ]
  return (clara + 0.05) / (oscura + 0.05)
}
