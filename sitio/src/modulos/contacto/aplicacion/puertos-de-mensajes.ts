import type { MensajeDeContacto } from '../dominio/mensaje-de-contacto'

// Guarda el mensaje en el panel: es el registro que atiende el estudio.
export interface RepositorioMensajes {
  guardar(mensaje: MensajeDeContacto): Promise<void>
}

// Avisa al estudio que llegó un mensaje (por ejemplo, por correo). Hoy el adaptador no hace
// nada: falta elegir el proveedor de correo y la casilla que recibe (L6).
export interface NotificadorDeMensajes {
  notificar(mensaje: MensajeDeContacto): Promise<void>
}
