// Id de un documento que llega del navegador o de la URL (`unknown`): un entero positivo, como
// número o como texto de solo dígitos. Cualquier otra cosa es `null` y nunca llega a Payload.
const SOLO_DIGITOS = /^\d+$/

export function leerId(valor: unknown): number | null {
  const numero = typeof valor === 'string' && SOLO_DIGITOS.test(valor) ? Number(valor) : valor
  if (typeof numero !== 'number' || !Number.isSafeInteger(numero) || numero < 1) return null
  return numero
}
