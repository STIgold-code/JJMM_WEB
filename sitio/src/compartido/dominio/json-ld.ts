import { urlAbsoluta } from './url-del-sitio'

// Datos estructurados (JSON-LD, schema.org) que se insertan en <script type="application/ld+json">.
export type ObjetoJsonLd = Record<string, unknown>

export const CONTEXTO_SCHEMA_ORG = 'https://schema.org'

// JSON seguro dentro de <script>: un `<` del contenido nunca puede cerrar la etiqueta y los
// separadores U+2028/U+2029 no rompen el script. JSON.parse devuelve el mismo objeto.
const SEPARADOR_DE_LINEA = new RegExp(String.fromCharCode(0x2028), 'g')
const SEPARADOR_DE_PARRAFO = new RegExp(String.fromCharCode(0x2029), 'g')

export function serializarJsonLd(datos: ObjetoJsonLd): string {
  return JSON.stringify(datos)
    .replace(/</g, '\\u003c')
    .replace(SEPARADOR_DE_LINEA, '\\u2028')
    .replace(SEPARADOR_DE_PARRAFO, '\\u2029')
}

export interface Miga {
  nombre: string
  ruta: string
}

export function migasDeNavegacion(origen: URL, migas: readonly Miga[]): ObjetoJsonLd {
  return {
    '@context': CONTEXTO_SCHEMA_ORG,
    '@type': 'BreadcrumbList',
    itemListElement: migas.map(({ nombre, ruta }, indice) => ({
      '@type': 'ListItem',
      position: indice + 1,
      name: nombre,
      item: urlAbsoluta(origen, ruta),
    })),
  }
}
