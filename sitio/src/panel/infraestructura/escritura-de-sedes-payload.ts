import type { Payload, TypedUser } from 'payload'

import type { ResultadoDelRepositorio } from '../aplicacion/gestionar-mensajes'
import type { RepositorioDeEscrituraDeSedes } from '../aplicacion/gestionar-sedes'
import type { SedeValidada } from '../dominio/validacion-de-sede'
import { traducirErrorDePayload } from './errores-de-payload'
import { reordenarEnTransaccion } from './reordenar-payload'
import type { SesionDelPanel } from './sesion-del-panel'

interface Contexto {
  payload: Payload
  permisos: { overrideAccess: false; user: TypedUser; depth: 0 }
}

// Solo los campos que edita el panel, con los nombres de la colección. Los celulares reemplazan
// la lista guardada entera, en el orden del formulario.
const datosDeLaSede = (datos: SedeValidada) => ({
  nombre: datos.nombre,
  direccion: datos.direccion,
  distrito: datos.distrito,
  ciudad: datos.ciudad,
  celulares: datos.celulares.map(({ numero, tieneWhatsApp }) => ({ numero, tieneWhatsApp })),
  correo: datos.correo,
  enlaceDeMapa: datos.mapa,
  activo: datos.visible,
})

async function escribir(
  operacion: () => Promise<{ nombre: string }>,
): Promise<ResultadoDelRepositorio> {
  try {
    const { nombre } = await operacion()
    return { estado: 'hecho', nombre }
  } catch (error) {
    return traducirErrorDePayload(error)
  }
}

async function crear({ payload, permisos }: Contexto, datos: SedeValidada, orden: number) {
  try {
    const data = { ...datosDeLaSede(datos), orden }
    const { id } = await payload.create({ collection: 'sedes', data, ...permisos })
    return { estado: 'hecho' as const, id }
  } catch (error) {
    return traducirErrorDePayload(error)
  }
}

async function guardar({ payload, permisos }: Contexto, id: number, datos: SedeValidada) {
  const data = datosDeLaSede(datos)
  const escritura = await escribir(() =>
    payload.update({ collection: 'sedes', id, data, ...permisos }),
  )
  return escritura.estado === 'hecho' ? { estado: 'hecho' as const } : escritura
}

// Adaptador de Payload de las escrituras de sedes. Toda escritura usa la Local API con
// `overrideAccess: false` y el usuario de la sesión, y pasa por los hooks y validaciones de la
// colección (celulares, mapa insertado): la caché del sitio público se invalida sola.
export function crearEscrituraDeSedes(sesion: SesionDelPanel): RepositorioDeEscrituraDeSedes {
  const { payload, usuario } = sesion
  const permisos = { overrideAccess: false, user: usuario, depth: 0 } as const
  const contexto: Contexto = { payload, permisos }
  return {
    listarPosiciones: async () => {
      const { docs } = await payload.find({
        collection: 'sedes',
        sort: 'orden',
        pagination: false,
        ...permisos,
      })
      return docs.map(({ id, orden }) => ({ id, orden }))
    },
    cambiarVisibilidad: (id, visible) =>
      escribir(() =>
        payload.update({ collection: 'sedes', id, data: { activo: visible }, ...permisos }),
      ),
    reordenar: (cambios) => reordenarEnTransaccion(payload, permisos, 'sedes', cambios),
    crear: (datos, orden) => crear(contexto, datos, orden),
    guardar: (id, datos) => guardar(contexto, id, datos),
    eliminar: (id) => escribir(() => payload.delete({ collection: 'sedes', id, ...permisos })),
  }
}
