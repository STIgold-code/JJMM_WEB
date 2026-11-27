import { crearLimitadorEnMemoria } from './limitador-en-memoria'

// Hasta 5 mensajes cada 10 minutos por dirección: suficiente para una persona, corta los
// envíos en ráfaga. Una sola instancia por proceso (ver la limitación en el limitador).
export const limitadorDeContacto = crearLimitadorEnMemoria({ maximo: 5, ventanaMs: 10 * 60_000 })
