// Regla de contraseñas del panel. La colección `usuarios` solo tiene la de Payload (al menos 3
// caracteres), así que el panel pide 10 en el servidor, como dice la maqueta aprobada. El tope
// evita entradas desmedidas; ninguna contraseña real se le acerca.
export const LARGO_MINIMO_DE_CLAVE = 10
const LARGO_MAXIMO_DE_CLAVE = 256

export const ERROR_CLAVE_CORTA = `La contraseña necesita al menos ${LARGO_MINIMO_DE_CLAVE} caracteres.`
export const ERROR_CLAVE_LARGA = `Es demasiado larga: usa hasta ${LARGO_MAXIMO_DE_CLAVE} caracteres.`

export const ERROR_CLAVE_EN_BLANCO = 'La contraseña no puede ser solo espacios.'

// Los espacios cuentan: una frase con espacios es una buena contraseña. Pero una hecha solo de
// espacios no sirve: el ingreso de Payload la rechaza y la cuenta no podría entrar nunca.
export function errorDeClaveNueva(clave: string): string | null {
  if (clave.length < LARGO_MINIMO_DE_CLAVE) return ERROR_CLAVE_CORTA
  if (clave.trim() === '') return ERROR_CLAVE_EN_BLANCO
  if (clave.length > LARGO_MAXIMO_DE_CLAVE) return ERROR_CLAVE_LARGA
  return null
}

// Ayuda en vivo bajo el campo de la contraseña nueva.
export function requisitoDeLargo(largo: number): { cumple: boolean; texto: string } {
  if (largo >= LARGO_MINIMO_DE_CLAVE)
    return { cumple: true, texto: `Tiene ${LARGO_MINIMO_DE_CLAVE} caracteres o más` }
  const base = `Al menos ${LARGO_MINIMO_DE_CLAVE} caracteres`
  return { cumple: false, texto: largo === 0 ? base : `${base} (llevas ${largo})` }
}
