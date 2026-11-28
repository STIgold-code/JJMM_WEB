import type { RepositorioDeEscrituraDeCronogramas } from '../aplicacion/gestionar-cronogramas'
import { instanteDelDia } from '../dominio/fechas-de-cronograma'
import type { CronogramaValidado } from '../dominio/validacion-de-cronograma'
import { escribirConPayload, escribirDocumento } from './errores-de-payload'
import type { SesionDelPanel } from './sesion-del-panel'

const COLECCION = 'cronogramas-sunat'
// Más de lo que el estudio cargará nunca (un periodo por mes).
const LIMITE_DE_PERIODOS = 500

// Solo los campos que edita el panel. Las fechas se escriben como el mediodía de Lima de su día
// (`instanteDelDia`), en el orden de su dígito; la fila de buenos contribuyentes vacía se borra.
// `periodo` lo calcula el hook de la colección.
const datosDelCronograma = (datos: CronogramaValidado) => ({
  anio: datos.anio,
  mes: datos.mes,
  fechasPorDigito: datos.fechas.map(({ digito, fecha }) => ({
    digito,
    fecha: instanteDelDia(fecha),
  })),
  fechaBuenosContribuyentes: datos.buenosContribuyentes
    ? instanteDelDia(datos.buenosContribuyentes)
    : null,
})

// Adaptador de Payload de las escrituras de cronogramas: Local API con `overrideAccess: false` y
// el usuario de la sesión. La colección vuelve a validar una fecha por dígito y el periodo único;
// sus hooks invalidan la caché del sitio público.
export function crearEscrituraDeCronogramas({
  payload,
  usuario,
}: SesionDelPanel): RepositorioDeEscrituraDeCronogramas {
  const permisos = { overrideAccess: false, user: usuario, depth: 0 } as const
  return {
    listarPeriodos: async () => {
      const { docs } = await payload.find({
        collection: COLECCION,
        limit: LIMITE_DE_PERIODOS,
        ...permisos,
      })
      return docs.map(({ id, anio, mes }) => ({ id, anio, mes }))
    },
    crear: async (datos) => {
      const data = datosDelCronograma(datos)
      const escritura = await escribirDocumento(() =>
        payload.create({ collection: COLECCION, data, ...permisos }),
      )
      return escritura.estado === 'hecho'
        ? { estado: 'hecho', id: escritura.documento.id }
        : escritura
    },
    guardar: (id, datos) =>
      escribirConPayload(() =>
        payload.update({ collection: COLECCION, id, data: datosDelCronograma(datos), ...permisos }),
      ),
    eliminar: async (id) => {
      const escritura = await escribirDocumento(() =>
        payload.delete({ collection: COLECCION, id, ...permisos }),
      )
      if (escritura.estado !== 'hecho') return escritura
      const { periodo, anio, mes } = escritura.documento
      return { estado: 'hecho', nombre: periodo || `${mes}/${anio}` }
    },
  }
}
