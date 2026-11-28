import { esAdministrador } from '@/compartido/dominio/roles'
import type { Usuario } from '@/payload-types'

import type { RepositorioDeUsuarios } from '../aplicacion/gestionar-usuarios'
import { nombreVisible, type UsuarioDelPanel } from '../dominio/usuarios'
import type { CambiosDeCuenta, DatosDeCuenta } from '../dominio/validacion-de-usuario'
import { escribirConPayload, traducirErrorDePayload } from './errores-de-payload'
import type { SesionDeAdministrador } from './sesion-del-panel'

export const aUsuarioDelPanel = (doc: Pick<Usuario, 'id' | 'nombre' | 'email' | 'rol'>) => ({
  id: doc.id,
  nombre: doc.nombre?.trim() || null,
  correo: doc.email,
  rol: esAdministrador(doc) ? ('administrador' as const) : ('editor' as const),
})

// Solo los campos que edita el panel, con los nombres de la colección. La contraseña viaja solo si
// se escribió una nueva; Payload la convierte en hash y nunca la devuelve.
const datosDeLaCuenta = ({ nombre, correo, rol }: DatosDeCuenta) => ({ nombre, email: correo, rol })

const conClave = (datos: CambiosDeCuenta) =>
  datos.clave === null
    ? datosDeLaCuenta(datos)
    : { ...datosDeLaCuenta(datos), password: datos.clave }

// Adaptador de Payload de las cuentas, solo para la sesión de un administrador (el tipo lo
// exige). Toda lectura y escritura usa la Local API con `overrideAccess: false` y el usuario de la
// sesión: el acceso de la colección `usuarios` (solo administradores crean, editan a otros y
// borran; el rol solo lo cambia un administrador) también rige aquí.
export function crearRepositorioDeUsuarios(sesion: SesionDeAdministrador): RepositorioDeUsuarios {
  const { payload, usuario } = sesion
  const permisos = { overrideAccess: false, user: usuario, depth: 0 } as const
  return {
    listar: async (): Promise<UsuarioDelPanel[]> => {
      const consulta = { collection: 'usuarios', pagination: false, ...permisos } as const
      const { docs } = await payload.find(consulta)
      return docs.map(aUsuarioDelPanel)
    },
    crear: async (datos) => {
      try {
        const data = { ...datosDeLaCuenta(datos), password: datos.clave }
        const { id } = await payload.create({ collection: 'usuarios', data, ...permisos })
        return { estado: 'hecho', id }
      } catch (error) {
        return traducirErrorDePayload(error)
      }
    },
    guardar: (id, datos) =>
      escribirConPayload(() =>
        payload.update({ collection: 'usuarios', id, data: conClave(datos), ...permisos }),
      ),
    eliminar: async (id) => {
      try {
        const cuenta = await payload.delete({ collection: 'usuarios', id, ...permisos })
        return { estado: 'hecho', nombre: nombreVisible(aUsuarioDelPanel(cuenta)) }
      } catch (error) {
        return traducirErrorDePayload(error)
      }
    },
  }
}
