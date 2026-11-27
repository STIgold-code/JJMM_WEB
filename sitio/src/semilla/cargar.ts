import { cargarAdministrador, type CredencialesDeAdministrador } from './carga/cargar-administrador'
import {
  cargarAreas,
  cargarAvisos,
  cargarClientes,
  cargarValores,
  cargarVencimientos,
} from './carga/cargar-colecciones'
import { cargarMedios } from './carga/cargar-medios'
import { cargarPaginaDeInicio } from './carga/cargar-pagina-de-inicio'
import { cargarPlanes } from './carga/cargar-planes'
import { cargarConfiguracion, cargarNavegacion, cargarSedes } from './carga/cargar-sitio'
import type { DatosDeSemilla } from './datos/tipos'
import type { PuertoDeCarga } from './puerto-de-carga'

export interface OpcionesDeCarga {
  // Convierte la ruta de un medio (relativa a la raíz del repositorio) en una ruta absoluta.
  resolverRuta: (archivo: string) => string
  administrador: CredencialesDeAdministrador | null
}

export interface ResultadoDeCarga {
  administradorCreado: boolean
}

// Carga inicial e idempotente del contenido real (T5). Primero lo que otros documentos
// referencian (medios y sedes), luego colecciones y al final las globales que las usan.
export async function cargarSemilla(
  puerto: PuertoDeCarga,
  datos: DatosDeSemilla,
  opciones: OpcionesDeCarga,
): Promise<ResultadoDeCarga> {
  const medios = await cargarMedios(puerto, datos.medios, opciones.resolverRuta)
  const sedes = await cargarSedes(puerto, datos.sedes)

  await cargarAreas(puerto, datos.areas)
  await cargarPlanes(puerto, datos.planes, datos.caracteristicas)
  await cargarValores(puerto, datos.valores)
  await cargarClientes(puerto, datos.clientes, medios)
  await cargarAvisos(puerto, datos.avisos)
  await cargarVencimientos(puerto, datos.vencimientos)

  await cargarConfiguracion(puerto, datos.configuracion, medios)
  await cargarNavegacion(puerto, datos.navegacion, medios)
  await cargarPaginaDeInicio(puerto, datos.paginaDeInicio, medios, sedes)
  await puerto.actualizarGlobal('guia-de-clientes', datos.guia)
  await puerto.actualizarGlobal('pagina-del-blog', datos.blog)

  return { administradorCreado: await cargarAdministrador(puerto, opciones.administrador) }
}
