import { CONTEXTO_SCHEMA_ORG, type ObjetoJsonLd } from './json-ld'
import { urlAbsoluta } from './url-del-sitio'

// Datos del estudio para schema.org, todos tomados del panel. Los teléfonos son celulares
// ya validados (S9) en formato internacional (+51…).
export interface SedeDelEstudio {
  nombre: string
  direccion: string
  localidad: string
  telefonos: readonly string[]
  correo: string | null
}

export interface DatosDelEstudio {
  nombre: string
  razonSocial: string
  logo: string | null
  correo: string
  telefonos: readonly string[]
  redes: readonly string[]
  sedes: readonly SedeDelEstudio[]
}

const PAIS = 'PE'

const direccionPostal = (sede: SedeDelEstudio): ObjetoJsonLd => ({
  '@type': 'PostalAddress',
  streetAddress: sede.direccion,
  addressLocality: sede.localidad,
  addressCountry: PAIS,
})

const departamento = (sede: SedeDelEstudio): ObjetoJsonLd => ({
  '@type': 'AccountingService',
  name: sede.nombre,
  address: direccionPostal(sede),
  telephone: [...sede.telefonos],
  ...(sede.correo ? { email: sede.correo } : {}),
})

const sinRepetir = (valores: readonly string[]): string[] => [...new Set(valores)]

// Solo agrega una propiedad de lista si tiene elementos: no se publican campos vacíos.
const siHay = (clave: string, valores: readonly unknown[]): ObjetoJsonLd =>
  valores.length > 0 ? { [clave]: valores } : {}

export function datosEstructuradosDelEstudio(origen: URL, datos: DatosDelEstudio): ObjetoJsonLd {
  const logo = datos.logo ? urlAbsoluta(origen, datos.logo) : null
  const telefonos = sinRepetir([...datos.telefonos, ...datos.sedes.flatMap((s) => s.telefonos)])
  return {
    '@context': CONTEXTO_SCHEMA_ORG,
    '@type': 'AccountingService',
    '@id': urlAbsoluta(origen, '/#estudio'),
    name: datos.nombre,
    legalName: datos.razonSocial,
    url: urlAbsoluta(origen, '/'),
    email: datos.correo,
    telephone: telefonos,
    ...(logo ? { logo, image: logo } : {}),
    ...siHay('sameAs', datos.redes),
    ...siHay('address', datos.sedes.map(direccionPostal)),
    ...siHay('department', datos.sedes.map(departamento)),
  }
}
