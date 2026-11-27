import type { RepositorioPaginaDeInicio } from './repositorio-pagina-de-inicio'

// Secciones del inicio en el orden del panel; sin secciones guardadas, una lista vacía.
export function crearObtenerSeccionesDeInicio<S>(repositorio: RepositorioPaginaDeInicio<S>) {
  return (): Promise<readonly S[]> => repositorio.obtenerSecciones()
}
