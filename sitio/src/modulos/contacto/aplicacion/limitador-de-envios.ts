// Límite de envíos por clave (la dirección IP de quien escribe) dentro de una ventana.
export interface LimitadorDeEnvios {
  permitir(clave: string, ahora: number): boolean
}
