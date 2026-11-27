import { type TarjetaDeAtencion, tarjetasDeAtencion } from '../dominio/atencion'
import { type Cifra, cifrasDelSitio, type ConteosDelSitio } from '../dominio/cifras'
import {
  type AvanceDelSitio,
  cantidadPorCompletar,
  type Faltante,
  faltantesDelSitio,
} from '../dominio/faltantes'
import {
  type BorradorPendiente,
  type FilaPendiente,
  filasPendientes,
  LIMITE_DE_PENDIENTES,
  type MensajePendiente,
} from '../dominio/pendientes'

// Lo que el inicio necesita leer. Cada método devuelve `null` cuando la cuenta no puede leer
// la colección: el adaptador nunca convierte un «no puedo» en un cero.
export interface RepositorioDelInicio {
  contarMensajesNuevos(): Promise<number | null>
  contarBorradores(): Promise<number | null>
  listarMensajesNuevos(limite: number): Promise<MensajePendiente[] | null>
  listarBorradores(limite: number): Promise<BorradorPendiente[] | null>
  contarContenido(): Promise<ConteosDelSitio>
  leerAvance(): Promise<AvanceDelSitio>
}

export interface DatosDelInicio {
  tarjetas: TarjetaDeAtencion[]
  cifras: Cifra[]
  // `null`: la cuenta no puede leer ni mensajes ni publicaciones; la tabla no se muestra.
  pendientes: FilaPendiente[] | null
  faltantes: Faltante[]
}

export async function obtenerInicio(repositorio: RepositorioDelInicio): Promise<DatosDelInicio> {
  const [mensajesNuevos, borradores, mensajes, listaDeBorradores, contenido, avance] =
    await Promise.all([
      repositorio.contarMensajesNuevos(),
      repositorio.contarBorradores(),
      repositorio.listarMensajesNuevos(LIMITE_DE_PENDIENTES),
      repositorio.listarBorradores(LIMITE_DE_PENDIENTES),
      repositorio.contarContenido(),
      repositorio.leerAvance(),
    ])
  const faltantes = faltantesDelSitio(avance)
  const sinPermisoParaPendientes = mensajes === null && listaDeBorradores === null
  return {
    tarjetas: tarjetasDeAtencion({
      mensajesNuevos,
      borradores,
      datosPorCompletar: faltantes.length > 0 ? cantidadPorCompletar(faltantes) : null,
    }),
    cifras: cifrasDelSitio(contenido),
    pendientes: sinPermisoParaPendientes
      ? null
      : filasPendientes(mensajes ?? [], listaDeBorradores ?? []),
    faltantes,
  }
}
