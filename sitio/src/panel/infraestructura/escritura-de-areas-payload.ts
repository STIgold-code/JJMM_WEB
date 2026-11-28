import type { RepositorioDeEscrituraDeAreas } from '../aplicacion/gestionar-areas'
import type { AreaValidada } from '../dominio/validacion-de-area'
import { escribirDocumento } from './errores-de-payload'
import { listarPosicionesDe, reordenarEnTransaccion } from './reordenar-payload'
import type { SesionDelPanel } from './sesion-del-panel'

const COLECCION = 'areas-de-servicio'

// Solo los campos que edita el panel, con los nombres de la colección: nunca `codigo` (identifica
// el gajo) ni `orden`. Los puntos reemplazan la lista guardada entera, en el orden del formulario.
// Un gajo vacío se guarda vacío: el área queda solo en las pestañas.
const datosDelArea = (datos: AreaValidada) => ({
  nombre: datos.nombre,
  nombreCorto: datos.nombreCorto,
  descripcion: datos.descripcion,
  puntos: datos.puntos.map((texto) => ({ texto })),
  mensajeDeConsulta: datos.mensajeDeConsulta,
  poligonoEnLaRueda: datos.poligono,
})

// Adaptador de Payload de las escrituras de áreas. Toda escritura usa la Local API con
// `overrideAccess: false` y el usuario de la sesión, y pasa por los hooks y validaciones de la
// colección: la caché del sitio público se invalida sola.
export function crearEscrituraDeAreas(sesion: SesionDelPanel): RepositorioDeEscrituraDeAreas {
  const { payload, usuario } = sesion
  const permisos = { overrideAccess: false, user: usuario, depth: 0 } as const
  return {
    listarPosiciones: () => listarPosicionesDe(payload, permisos, COLECCION),
    reordenar: (cambios) => reordenarEnTransaccion(payload, permisos, COLECCION, cambios),
    guardar: async (id, datos) => {
      const escritura = await escribirDocumento(() =>
        payload.update({ collection: COLECCION, id, data: datosDelArea(datos), ...permisos }),
      )
      if (escritura.estado !== 'hecho') return escritura
      return { estado: 'hecho', nombre: escritura.documento.nombre }
    },
  }
}
