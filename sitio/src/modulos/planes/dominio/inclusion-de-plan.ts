// Cada celda de la matriz de planes: la característica está incluida, no incluida o se
// describe con un texto corto («2 trabajadores», «Consultar»).
export const TIPOS_DE_INCLUSION = ['incluido', 'no-incluido', 'texto'] as const
export type TipoDeInclusion = (typeof TIPOS_DE_INCLUSION)[number]

// S9: no se publican montos. Detecta símbolos y nombres de moneda (soles, dólares).
const PATRON_MONTO = /S\/\.?\s*\d|US\$|\$\s*\d|\b(?:USD|PEN)\b|\bsoles?\b|\bd[oó]lares?\b/i

export function contieneMonto(texto: string): boolean {
  return PATRON_MONTO.test(texto)
}

export const MENSAJE_SIN_MONTOS = 'No publiques montos: los precios se muestran como «Consultar».'

export function validarTextoDeInclusion(
  tipo: TipoDeInclusion,
  texto: string | null | undefined,
): string | null {
  const contenido = texto?.trim() ?? ''
  if (tipo !== 'texto') {
    return contenido === ''
      ? null
      : 'Deja el texto vacío cuando la celda es «incluido» o «no incluido».'
  }
  if (contenido === '')
    return 'Escribe el texto que se muestra en la celda, por ejemplo «Consultar».'
  return contieneMonto(contenido) ? MENSAJE_SIN_MONTOS : null
}
