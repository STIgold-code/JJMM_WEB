import { comoTexto, leerCampo } from '@/compartido/infraestructura/campos/validaciones'

import {
  contieneMonto,
  MENSAJE_SIN_MONTOS,
  TIPOS_DE_INCLUSION,
  validarTextoDeInclusion,
} from '../dominio/inclusion-de-plan'

// S9: ningún texto de los planes publica montos.
export const validarSinMontos = (valor: unknown): true | string =>
  !contieneMonto(comoTexto(valor)) || MENSAJE_SIN_MONTOS

export const validarTextoDeLaCelda = (
  valor: unknown,
  { siblingData }: { siblingData: unknown },
): true | string => {
  const tipo = TIPOS_DE_INCLUSION.find((t) => t === leerCampo(siblingData, 'tipo'))
  if (!tipo) return 'Elige si la característica está incluida, no incluida o es un texto.'
  return validarTextoDeInclusion(tipo, comoTexto(valor)) ?? true
}
