import type { RepositorioConfiguracion } from '@/compartido/aplicacion/repositorio-configuracion'
import type { ContactoDelSitio } from '@/compartido/dominio/configuracion-del-sitio'

// Contacto del sitio sin formatear (celulares y mensaje por defecto de WhatsApp), o null si la
// configuración nunca se guardó.
export function crearObtenerContacto(repositorio: RepositorioConfiguracion) {
  return async (): Promise<ContactoDelSitio | null> => {
    const configuracion = await repositorio.obtener()
    return configuracion?.contacto ?? null
  }
}
