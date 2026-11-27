import { prepararCanalesDeContacto } from '../dominio/canales-de-contacto'
import type {
  CanalesDeContacto,
  EnlaceDeRed,
  Marca,
  SeoPorDefecto,
} from '../dominio/configuracion-del-sitio'
import type { RepositorioConfiguracion } from './repositorio-configuracion'

export interface DatosDelSitio {
  marca: Marca
  canales: CanalesDeContacto
  redes: readonly EnlaceDeRed[]
  seo: SeoPorDefecto
}

// Datos que usa la estructura común del sitio, con los enlaces de contacto ya armados.
export function crearObtenerDatosDelSitio(repositorio: RepositorioConfiguracion) {
  return async (): Promise<DatosDelSitio | null> => {
    const configuracion = await repositorio.obtener()
    if (!configuracion) return null
    return {
      marca: configuracion.marca,
      canales: prepararCanalesDeContacto(configuracion.contacto),
      redes: configuracion.redes,
      seo: configuracion.seo,
    }
  }
}
