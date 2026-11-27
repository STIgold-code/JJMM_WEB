import {
  type DatosDelFormulario,
  type ErroresDelMensaje,
  validarMensajeDeContacto,
} from '../dominio/mensaje-de-contacto'
import type { LimitadorDeEnvios } from './limitador-de-envios'
import type { NotificadorDeMensajes, RepositorioMensajes } from './puertos-de-mensajes'

// Una persona tarda más que esto en completar el formulario; un robot, no.
export const TIEMPO_MINIMO_MS = 3000

export interface SolicitudDeEnvio {
  datos: DatosDelFormulario
  // Campo oculto que una persona no ve ni llena.
  trampa: string
  // Momento en que se mostró el formulario (milisegundos), o null si no llegó.
  inicioEn: number | null
  ip: string
  ahora: number
}

export type ResultadoDeEnvio =
  { estado: 'enviado' } | { estado: 'invalido'; errores: ErroresDelMensaje } | { estado: 'limite' }

interface Dependencias {
  repositorio: RepositorioMensajes
  notificador: NotificadorDeMensajes
  limitador: LimitadorDeEnvios
}

function pareceRobot({ trampa, inicioEn, ahora }: SolicitudDeEnvio): boolean {
  if (trampa.trim() !== '' || inicioEn === null) return true
  const transcurrido = ahora - inicioEn
  return transcurrido < TIEMPO_MINIMO_MS
}

// El envío de un robot se descarta respondiendo «enviado», para no darle pistas.
export function crearEnviarMensajeDeContacto({
  repositorio,
  notificador,
  limitador,
}: Dependencias) {
  return async (solicitud: SolicitudDeEnvio): Promise<ResultadoDeEnvio> => {
    if (pareceRobot(solicitud)) return { estado: 'enviado' }
    if (!limitador.permitir(solicitud.ip, solicitud.ahora)) return { estado: 'limite' }
    const validacion = validarMensajeDeContacto(solicitud.datos)
    if (!validacion.valido) return { estado: 'invalido', errores: validacion.errores }
    await repositorio.guardar(validacion.mensaje)
    await notificador.notificar(validacion.mensaje)
    return { estado: 'enviado' }
  }
}
