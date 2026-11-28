import type { Cliente } from '@/payload-types'

import type {
  RepositorioDeEscrituraDeClientes,
  RepositorioDeLecturaDeClientes,
} from '../aplicacion/gestionar-clientes'
import type { ClienteDelPanel } from '../dominio/clientes'
import type { ClienteValidado } from '../dominio/validacion-de-cliente'
import { aImagenElegida } from './bloque-de-carrusel-payload'
import { escribirDocumento } from './errores-de-payload'
import { listarPosicionesDe, reordenarEnTransaccion } from './reordenar-payload'
import type { SesionDelPanel } from './sesion-del-panel'

const COLECCION = 'clientes'

// `activo` vacío se lee como el sitio público: visible.
const aClienteDelPanel = (doc: Cliente): ClienteDelPanel => ({
  id: doc.id,
  nombre: doc.nombre,
  logo: aImagenElegida(doc.logo),
  enlace: doc.enlace?.trim() || null,
  visible: doc.activo !== false,
  orden: doc.orden,
})

// Solo los campos que edita el panel, con los nombres de la colección.
const datosDelCliente = (datos: ClienteValidado) => ({
  nombre: datos.nombre,
  logo: datos.logo,
  enlace: datos.enlace,
  activo: datos.visible,
})

async function conNombre(operacion: () => Promise<{ nombre: string }>) {
  const escritura = await escribirDocumento(operacion)
  if (escritura.estado !== 'hecho') return escritura
  return { estado: 'hecho' as const, nombre: escritura.documento.nombre }
}

// Adaptador de Payload de los clientes (lecturas y escrituras). Todo usa la Local API con
// `overrideAccess: false` y el usuario de la sesión, y pasa por los hooks y validaciones de la
// colección: la caché del sitio público se invalida sola. La lectura trae el logotipo
// (`depth: 1`) para su miniatura.
export function crearRepositorioDeClientes(
  sesion: SesionDelPanel,
): RepositorioDeLecturaDeClientes & RepositorioDeEscrituraDeClientes {
  const { payload, usuario } = sesion
  const permisos = { overrideAccess: false, user: usuario, depth: 0 } as const
  return {
    listarClientes: async () => {
      const { docs } = await payload.find({
        collection: COLECCION,
        sort: 'orden',
        pagination: false,
        ...permisos,
        depth: 1,
      })
      return docs.map(aClienteDelPanel)
    },
    listarPosiciones: () => listarPosicionesDe(payload, permisos, COLECCION),
    reordenar: (cambios) => reordenarEnTransaccion(payload, permisos, COLECCION, cambios),
    cambiarVisibilidad: (id, visible) =>
      conNombre(() =>
        payload.update({ collection: COLECCION, id, data: { activo: visible }, ...permisos }),
      ),
    crear: async (datos, orden) => {
      const data = { ...datosDelCliente(datos), orden }
      const escritura = await escribirDocumento(() =>
        payload.create({ collection: COLECCION, data, ...permisos }),
      )
      if (escritura.estado !== 'hecho') return escritura
      return { estado: 'hecho', id: escritura.documento.id }
    },
    guardar: (id, datos) =>
      conNombre(() =>
        payload.update({ collection: COLECCION, id, data: datosDelCliente(datos), ...permisos }),
      ),
    eliminar: (id) => conNombre(() => payload.delete({ collection: COLECCION, id, ...permisos })),
  }
}
