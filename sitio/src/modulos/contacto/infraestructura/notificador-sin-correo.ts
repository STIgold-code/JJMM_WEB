import type { NotificadorDeMensajes } from '../aplicacion/puertos-de-mensajes'

// Adaptador provisional: no avisa a nadie. El mensaje queda guardado en el panel
// («Mensajes de contacto») y la persona lo envía por WhatsApp. Para avisar por correo hace
// falta elegir un proveedor (por ejemplo Resend o SMTP con el adaptador de correo de Payload)
// y la casilla que recibe (decisión abierta en L6); el nuevo adaptador reemplaza a este.
export const notificadorSinCorreo: NotificadorDeMensajes = {
  async notificar() {},
}
