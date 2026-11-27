import { prepararSedeDeContacto, type SedeDeContacto } from '../dominio/sede-de-contacto'
import type { RepositorioSedesDeContacto } from './repositorio-sedes'

// El mensaje de WhatsApp es el del sitio (configuración), el mismo para todas las sedes.
export function crearListarSedesDeContacto(repositorio: RepositorioSedesDeContacto) {
  return async (mensajeWhatsApp: string): Promise<SedeDeContacto[]> => {
    const sedes = await repositorio.listarParaContacto()
    return sedes.map((sede) => prepararSedeDeContacto(sede, mensajeWhatsApp))
  }
}
