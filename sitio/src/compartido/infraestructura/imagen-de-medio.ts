import type { Medio } from '@/payload-types'

import type { Imagen } from '../dominio/imagen'

// Un upload llega como id (sin poblar) o como el documento de `medios`. Sin dirección o sin
// dimensiones no se puede dibujar sin saltos de diseño, así que se trata como ausente.
export function aImagen(medio: number | Medio | null | undefined): Imagen | null {
  if (!medio || typeof medio === 'number') return null
  const { url, width, height, alt } = medio
  if (!url || !width || !height) return null
  return { url, alt, ancho: width, alto: height }
}
