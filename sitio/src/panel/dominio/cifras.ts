import type { NombreDeIcono } from './iconos'
import { RUTA_DE_PLANES } from './planes'
import { listaEnAdmin } from './rutas-del-panel'
import { RUTA_DE_SEDES } from './sedes'

// «Lo que publica hoy el sitio»: cifras reales del contenido. `null` = la cuenta no puede
// leer esa colección y la cifra no se muestra.
export interface ConteosDelSitio {
  planes: number | null
  areas: number | null
  sedesActivas: number | null
  clientesActivos: number | null
  avisosActivos: number | null
  vencimientos: number | null
}

export interface Cifra {
  clave: string
  etiqueta: string
  cantidad: number
  icono: NombreDeIcono
  href: string
}

interface Definicion {
  clave: string
  conteo: keyof ConteosDelSitio
  etiqueta: string
  icono: NombreDeIcono
  slug: string
  // Sección del panel propio; sin ella, la cifra lleva a la lista del /admin.
  ruta?: string
}

const DEFINICIONES: readonly Definicion[] = [
  {
    clave: 'planes',
    conteo: 'planes',
    etiqueta: 'Planes',
    icono: 'capas',
    slug: 'planes',
    ruta: RUTA_DE_PLANES,
  },
  {
    clave: 'areas',
    conteo: 'areas',
    etiqueta: 'Áreas de servicio',
    icono: 'maletin',
    slug: 'areas-de-servicio',
  },
  {
    clave: 'sedes',
    conteo: 'sedesActivas',
    etiqueta: 'Sedes activas',
    icono: 'pin',
    slug: 'sedes',
    ruta: RUTA_DE_SEDES,
  },
  {
    clave: 'clientes',
    conteo: 'clientesActivos',
    etiqueta: 'Clientes en el inicio',
    icono: 'edificio',
    slug: 'clientes',
  },
  {
    clave: 'avisos',
    conteo: 'avisosActivos',
    etiqueta: 'Avisos para clientes',
    icono: 'libro',
    slug: 'avisos-para-clientes',
  },
  {
    clave: 'vencimientos',
    conteo: 'vencimientos',
    etiqueta: 'Vencimientos',
    icono: 'calendario',
    slug: 'vencimientos',
  },
]

export function cifrasDelSitio(conteos: ConteosDelSitio): Cifra[] {
  return DEFINICIONES.flatMap(({ clave, conteo, etiqueta, icono, slug, ruta }) => {
    const cantidad = conteos[conteo]
    if (cantidad === null) return []
    return [{ clave, etiqueta, cantidad, icono, href: ruta ?? listaEnAdmin(slug) }]
  })
}
