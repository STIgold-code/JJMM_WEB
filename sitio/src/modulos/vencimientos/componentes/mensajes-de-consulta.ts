import type { MotivoDeRucInvalido } from '../dominio/ruc'

// Mensajes de la consulta por RUC: dicen qué pasó y qué hacer.
export const MENSAJES_DE_ERROR: Record<MotivoDeRucInvalido, string> = {
  vacio: 'Escribe tu RUC para ver tu fecha de vencimiento.',
  formato: 'El RUC tiene 11 dígitos. Revisa el número que escribiste.',
  invalido: 'Ese número no es un RUC válido. Revisa que esté bien escrito.',
}

export const textoDelResultado = (digito: number, periodo: string, fecha: string): string =>
  `Si tu RUC termina en ${digito}, tu declaración del periodo ${periodo} vence el ${fecha}.`
