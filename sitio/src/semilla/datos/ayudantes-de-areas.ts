import type { AreaSemilla } from './tipos'

// Mensaje de WhatsApp de cada área, tal como lo arma el inicio v4.
export const consultaDelServicio = (servicio: string): string =>
  `Hola, quiero información del servicio ${servicio}.`

export const listaDePuntos = (...textos: string[]): AreaSemilla['puntos'] =>
  textos.map((texto) => ({ texto }))
