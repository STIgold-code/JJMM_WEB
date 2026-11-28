import { seccionDeLaRuta } from './menu-del-panel'
import { RUTA_DEL_CARRUSEL } from './pagina-de-inicio'
import { RUTA_DE_FILAS_DE_LA_TABLA } from './planes'
import { RUTA_DEL_INICIO } from './rutas-del-panel'
import { RUTA_DE_NUEVA_SEDE } from './sedes'
import { RUTA_DE_MI_CUENTA } from './usuarios'
import { RUTA_DE_VALORES } from './valores'

export interface Miga {
  texto: string
  ruta: string | null
}

// Última miga de las páginas internas: primero las que tienen ruta fija (creación, pantallas
// internas como «Valores»); si no, la de la sección (por ejemplo, la edición de un plan).
const PAGINAS_CON_RUTA: Readonly<Record<string, string>> = {
  [RUTA_DE_NUEVA_SEDE]: 'Nueva sede',
  [RUTA_DEL_CARRUSEL]: 'Carrusel de portadas',
  [RUTA_DE_VALORES]: 'Valores',
  [RUTA_DE_FILAS_DE_LA_TABLA]: 'Filas de la tabla',
}
const PAGINAS_INTERNAS: Readonly<Record<string, string>> = {
  planes: 'Editar plan',
  sedes: 'Editar sede',
  areas: 'Editar área',
}

const paginaInterna = (clave: string, ruta: string): string =>
  PAGINAS_CON_RUTA[ruta] ?? PAGINAS_INTERNAS[clave] ?? 'Detalle'

// Primera miga de toda página que no es el inicio.
const INICIO: Miga = { texto: 'Inicio', ruta: RUTA_DEL_INICIO }

// Ruta de la barra superior. La última miga es la página actual y no lleva enlace; toda
// sección cuelga del inicio y sus páginas internas, de la sección. «Mi cuenta» no está en el menú
// (se entra desde la cuenta, abajo) y cuelga del inicio.
export function migasDeRuta(ruta: string): Miga[] {
  if (ruta === RUTA_DE_MI_CUENTA) return [INICIO, { texto: 'Mi cuenta', ruta: null }]
  const actual = seccionDeLaRuta(ruta)
  if (!actual?.ruta || actual.ruta === RUTA_DEL_INICIO) return [{ texto: 'Inicio', ruta: null }]
  const enLaSeccion = actual.ruta === ruta
  const migas = [INICIO, { texto: actual.texto, ruta: enLaSeccion ? null : actual.ruta }]
  if (enLaSeccion) return migas
  return [...migas, { texto: paginaInterna(actual.clave, ruta), ruta: null }]
}
