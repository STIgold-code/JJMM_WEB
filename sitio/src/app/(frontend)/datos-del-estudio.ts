import type { DatosDelSitio } from '@/compartido/aplicacion/obtener-datos-del-sitio'
import type { DatosDelEstudio } from '@/compartido/dominio/datos-estructurados-del-estudio'
import type { EnlaceDeContacto } from '@/compartido/dominio/enlaces-de-contacto'
import type { SedePublica } from '@/modulos/sedes/dominio/sede'

// Une la configuración del sitio y las sedes en los datos del estudio para schema.org.
// Los teléfonos salen de los enlaces de llamada (`tel:+51…`), que solo se arman con celulares.
const PREFIJO_DE_LLAMADA = 'tel:'

const telefonoDe = ({ href }: EnlaceDeContacto): string => href.slice(PREFIJO_DE_LLAMADA.length)

export function datosDelEstudio(
  sitio: DatosDelSitio,
  sedes: readonly SedePublica[],
): DatosDelEstudio {
  const { marca, canales, redes } = sitio
  return {
    nombre: marca.nombreComercial,
    razonSocial: marca.razonSocial,
    logo: marca.logo?.url ?? null,
    correo: canales.correo.texto,
    telefonos: [telefonoDe(canales.llamadas)],
    redes: redes.map(({ url }) => url),
    sedes: sedes.map((sede) => ({
      nombre: sede.nombre,
      direccion: sede.direccion,
      localidad: sede.localidad,
      telefonos: sede.celulares.map(telefonoDe),
      correo: sede.correo?.texto ?? null,
    })),
  }
}
