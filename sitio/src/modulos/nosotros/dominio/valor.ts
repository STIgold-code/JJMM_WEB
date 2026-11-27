// Valores de «¿Por qué elegirnos?». El ícono es uno de un conjunto cerrado del panel.
export const ICONOS_DE_VALOR = ['pulgar', 'trofeo', 'foco', 'candado', 'balanza', 'equipo'] as const
export type IconoDeValor = (typeof ICONOS_DE_VALOR)[number]

export interface Valor {
  nombre: string
  icono: IconoDeValor
}
