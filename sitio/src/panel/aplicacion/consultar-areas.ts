import type { AreaDelPanel } from '../dominio/areas-de-servicio'
import { type FormularioDeArea, formularioDeArea } from '../dominio/formulario-de-area'
import { leerId } from '../dominio/identificadores'

// La sección «Nuestros servicios» del inicio, para la vista previa: su título, la imagen de la
// rueda (sobre la que se marcan los gajos) y el texto del botón de cada área.
export interface RuedaDelSitio {
  titulo: string
  imagen: { url: string; alt: string; ancho: number; alto: number } | null
  textoDelBoton: string
}

// Lecturas con los permisos de quien entra. Las áreas, en el orden del sitio.
export interface RepositorioDeLecturaDeAreas {
  listarAreas(): Promise<AreaDelPanel[]>
  // `null` si la página de inicio no tiene la sección.
  leerRueda(): Promise<RuedaDelSitio | null>
  // El mensaje de WhatsApp de «Datos del estudio»; `null` si nunca se guardó.
  leerMensajePorDefecto(): Promise<string | null>
}

export interface DatosDeEdicionDeArea {
  area: AreaDelPanel
  formulario: FormularioDeArea
  areas: AreaDelPanel[]
  rueda: RuedaDelSitio
  mensajePorDefecto: string
}

// Los valores con que se crea la sección (`bloque-servicios.ts` y la semilla).
export const RUEDA_PREDETERMINADA: RuedaDelSitio = {
  titulo: 'Nuestros servicios',
  imagen: null,
  textoDelBoton: 'Consultar este servicio',
}

export function obtenerListadoDeAreas(repositorio: RepositorioDeLecturaDeAreas) {
  return repositorio.listarAreas()
}

// `null` si el id de la URL no es válido o el área no existe (la página lo explica).
export async function obtenerEdicionDeArea(
  repositorio: RepositorioDeLecturaDeAreas,
  idEnLaUrl: unknown,
): Promise<DatosDeEdicionDeArea | null> {
  const id = leerId(idEnLaUrl)
  if (id === null) return null
  const [areas, rueda, mensaje] = await Promise.all([
    repositorio.listarAreas(),
    repositorio.leerRueda(),
    repositorio.leerMensajePorDefecto(),
  ])
  const area = areas.find((a) => a.id === id)
  if (!area) return null
  return {
    area,
    formulario: formularioDeArea(area),
    areas,
    rueda: rueda ?? RUEDA_PREDETERMINADA,
    mensajePorDefecto: mensaje ?? '',
  }
}
