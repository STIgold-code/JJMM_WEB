import { obtenerPayload } from '@/compartido/infraestructura/instancia-payload'

import type { RepositorioMensajes } from '../aplicacion/puertos-de-mensajes'

// Crea el mensaje con los permisos del público (overrideAccess: false, sin usuario): aplica
// el acceso de creación pública de la colección, y su hook fuerza el estado «nuevo».
export const repositorioMensajesPayload: RepositorioMensajes = {
  async guardar(mensaje) {
    const payload = await obtenerPayload()
    await payload.create({
      collection: 'mensajes-de-contacto',
      overrideAccess: false,
      data: {
        nombre: mensaje.nombre,
        celular: mensaje.celular,
        correo: mensaje.correo,
        servicioDeInteres: mensaje.servicio,
        mensaje: mensaje.mensaje,
        // El tipo lo exige; de todos modos el hook de la colección lo fuerza para el público.
        estado: 'nuevo',
      },
    })
  },
}
