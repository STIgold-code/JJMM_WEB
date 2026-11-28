import type { RepositorioDeLecturaDeValores } from '../aplicacion/consultar-valores'
import type { RepositorioDeEscrituraDeValores } from '../aplicacion/gestionar-valores'
import { escribirDocumento } from './errores-de-payload'
import { listarPosicionesDe, reordenarEnTransaccion } from './reordenar-payload'
import type { SesionDelPanel } from './sesion-del-panel'

const COLECCION = 'valores'

async function conNombre(operacion: () => Promise<{ nombre: string }>) {
  const escritura = await escribirDocumento(operacion)
  if (escritura.estado !== 'hecho') return escritura
  return { estado: 'hecho' as const, nombre: escritura.documento.nombre }
}

// Textos de la sección «¿Por qué elegirnos?» de la página de inicio, o `null` si no la tiene.
async function leerTextosDeLaSeccion({ payload, usuario }: SesionDelPanel) {
  const pagina = await payload.findGlobal({
    slug: 'pagina-de-inicio',
    overrideAccess: false,
    user: usuario,
    depth: 0,
  })
  const seccion = pagina.secciones?.find((bloque) => bloque.blockType === 'por-que-elegirnos')
  if (seccion?.blockType !== 'por-que-elegirnos') return null
  return { titulo: seccion.titulo, bajada: seccion.bajada?.trim() || null }
}

// Adaptador de Payload de los valores (lecturas y escrituras). Todo usa la Local API con
// `overrideAccess: false` y el usuario de la sesión, y pasa por los hooks y validaciones de la
// colección: la caché del sitio público se invalida sola. Solo se escriben nombre e ícono (y el
// orden al crear o reordenar).
export function crearRepositorioDeValores(
  sesion: SesionDelPanel,
): RepositorioDeLecturaDeValores & RepositorioDeEscrituraDeValores {
  const { payload, usuario } = sesion
  const permisos = { overrideAccess: false, user: usuario, depth: 0 } as const
  return {
    listarValores: async () => {
      const { docs } = await payload.find({
        collection: COLECCION,
        sort: 'orden',
        pagination: false,
        ...permisos,
      })
      return docs.map(({ id, nombre, icono, orden }) => ({ id, nombre, icono, orden }))
    },
    leerTextosDeLaSeccion: () => leerTextosDeLaSeccion(sesion),
    listarPosiciones: () => listarPosicionesDe(payload, permisos, COLECCION),
    reordenar: (cambios) => reordenarEnTransaccion(payload, permisos, COLECCION, cambios),
    crear: async ({ nombre, icono }, orden) => {
      const data = { nombre, icono, orden }
      const escritura = await escribirDocumento(() =>
        payload.create({ collection: COLECCION, data, ...permisos }),
      )
      if (escritura.estado !== 'hecho') return escritura
      return { estado: 'hecho', id: escritura.documento.id }
    },
    guardar: (id, { nombre, icono }) =>
      conNombre(() =>
        payload.update({ collection: COLECCION, id, data: { nombre, icono }, ...permisos }),
      ),
    eliminar: (id) => conNombre(() => payload.delete({ collection: COLECCION, id, ...permisos })),
  }
}
