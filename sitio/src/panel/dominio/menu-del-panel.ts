import type { Rol } from '@/compartido/dominio/roles'

import type { NombreDeIcono } from './iconos'
import { RUTA_DE_MENSAJES } from './mensajes'
import { RUTA_DE_PLANES } from './planes'
import { RUTA_DEL_INICIO } from './rutas-del-panel'
import { RUTA_DE_NUEVA_SEDE, RUTA_DE_SEDES } from './sedes'

// Menú lateral del panel, agrupado por tarea como en la maqueta aprobada. Una entrada sin
// `ruta` es una sección que aún no se construye: se muestra deshabilitada («Próximamente»).
export interface EntradaDelMenu {
  clave: string
  texto: string
  icono: NombreDeIcono
  ruta: string | null
  contador: number
}

export interface GrupoDelMenu {
  titulo: string
  entradas: EntradaDelMenu[]
}

// La cuenta que se muestra abajo del menú.
export interface UsuarioVisible {
  nombre: string
  rol: string
  iniciales: string
}

export interface DatosDelMenu {
  grupos: GrupoDelMenu[]
  usuario: UsuarioVisible
}

export interface ContadoresDelMenu {
  // `null`: la cuenta no puede leer los mensajes; no se muestra contador.
  mensajesNuevos: number | null
}

type Definicion = Omit<EntradaDelMenu, 'contador'>

interface DefinicionDeGrupo {
  titulo: string
  soloAdministrador: boolean
  entradas: Definicion[]
}

const entrada = (
  clave: string,
  texto: string,
  icono: NombreDeIcono,
  ruta: string | null = null,
) => ({
  clave,
  texto,
  icono,
  ruta,
})

const MENU: readonly DefinicionDeGrupo[] = [
  {
    titulo: 'Atención diaria',
    soloAdministrador: false,
    entradas: [
      entrada('inicio', 'Inicio', 'casa', RUTA_DEL_INICIO),
      entrada('mensajes', 'Mensajes de contacto', 'bandeja', RUTA_DE_MENSAJES),
    ],
  },
  {
    titulo: 'Lo que ofreces',
    soloAdministrador: false,
    entradas: [
      entrada('planes', 'Planes', 'capas', RUTA_DE_PLANES),
      entrada('areas', 'Áreas de servicio', 'maletin'),
    ],
  },
  {
    titulo: 'Sitio web',
    soloAdministrador: false,
    entradas: [
      entrada('pagina-de-inicio', 'Página de inicio', 'diseno'),
      entrada('sedes', 'Sedes', 'pin', RUTA_DE_SEDES),
      entrada('clientes', 'Clientes', 'edificio'),
    ],
  },
  {
    titulo: 'Para tus clientes',
    soloAdministrador: false,
    entradas: [
      entrada('guia', 'Guía de clientes', 'libro'),
      entrada('publicaciones', 'Publicaciones', 'periodico'),
      entrada('medios', 'Imágenes', 'imagen'),
    ],
  },
  {
    titulo: 'Administración',
    soloAdministrador: true,
    entradas: [
      entrada('usuarios', 'Usuarios', 'usuarios'),
      entrada('configuracion', 'Datos del estudio', 'ajustes'),
      entrada('navegacion', 'Menú del sitio', 'lista'),
    ],
  },
]

export function menuDelPanel(rol: Rol, contadores: ContadoresDelMenu): GrupoDelMenu[] {
  const contadorDe = (clave: string) =>
    clave === 'mensajes' ? (contadores.mensajesNuevos ?? 0) : 0
  return MENU.filter((grupo) => rol === 'administrador' || !grupo.soloAdministrador).map(
    ({ titulo, entradas }) => ({
      titulo,
      entradas: entradas.map((e) => ({ ...e, contador: contadorDe(e.clave) })),
    }),
  )
}

export interface Miga {
  texto: string
  ruta: string | null
}

// Una sección queda marcada también en sus páginas internas (por ejemplo, la edición de un plan).
export function esRutaActual(rutaDeLaEntrada: string, ruta: string): boolean {
  if (ruta === rutaDeLaEntrada) return true
  return rutaDeLaEntrada !== RUTA_DEL_INICIO && ruta.startsWith(`${rutaDeLaEntrada}/`)
}

// Última miga de las páginas internas de una sección; las de creación tienen ruta propia.
const PAGINAS_INTERNAS: Readonly<Record<string, string>> = {
  planes: 'Editar plan',
  sedes: 'Editar sede',
}
const PAGINAS_DE_CREACION: Readonly<Record<string, string>> = {
  [RUTA_DE_NUEVA_SEDE]: 'Nueva sede',
}

const paginaInterna = (clave: string, ruta: string): string =>
  PAGINAS_DE_CREACION[ruta] ?? PAGINAS_INTERNAS[clave] ?? 'Detalle'

// Ruta de la barra superior. La última miga es la página actual y no lleva enlace; toda
// sección cuelga del inicio y sus páginas internas, de la sección.
export function migasDeRuta(ruta: string): Miga[] {
  const actual = MENU.flatMap((g) => g.entradas).find(
    (e) => e.ruta !== null && esRutaActual(e.ruta, ruta),
  )
  if (!actual?.ruta || actual.ruta === RUTA_DEL_INICIO) return [{ texto: 'Inicio', ruta: null }]
  const enLaSeccion = actual.ruta === ruta
  const migas = [
    { texto: 'Inicio', ruta: RUTA_DEL_INICIO },
    { texto: actual.texto, ruta: enLaSeccion ? null : actual.ruta },
  ]
  if (enLaSeccion) return migas
  return [...migas, { texto: paginaInterna(actual.clave, ruta), ruta: null }]
}

const NOMBRES_DE_ROL: Readonly<Record<Rol, string>> = {
  administrador: 'Administrador',
  editor: 'Editor',
}

export function nombreDelRol(rol: Rol): string {
  return NOMBRES_DE_ROL[rol]
}

export function iniciales(nombre: string | null | undefined, correo: string): string {
  const palabras = (nombre ?? '').trim().split(/\s+/).filter(Boolean)
  if (palabras.length === 0) return correo.charAt(0).toUpperCase()
  return palabras
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('')
}
