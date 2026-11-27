import { type DatosDelMenu, iniciales, menuDelPanel, nombreDelRol } from '../dominio/menu-del-panel'
import { crearRepositorioDelInicio } from './repositorio-del-inicio-payload'
import { rolDeLaSesion, type SesionDelPanel } from './sesion-del-panel'

// Datos del menú lateral para la cuenta que entró: secciones según su rol, contador de
// mensajes nuevos (leído con sus permisos) y su nombre y rol abajo.
export async function datosDelMenu(sesion: SesionDelPanel): Promise<DatosDelMenu> {
  const { usuario } = sesion
  const rol = rolDeLaSesion(sesion)
  const mensajesNuevos = await crearRepositorioDelInicio(sesion).contarMensajesNuevos()
  const nombre = usuario.nombre?.trim() || usuario.email
  return {
    grupos: menuDelPanel(rol, { mensajesNuevos }),
    usuario: {
      nombre,
      rol: nombreDelRol(rol),
      iniciales: iniciales(usuario.nombre, usuario.email),
    },
  }
}
