import type { Rol } from '@/compartido/dominio/roles'

import { RUTA_DE_AREAS } from './areas-de-servicio'
import { RUTA_DE_CLIENTES } from './clientes'
import type { NombreDeIcono } from './iconos'
import { RUTA_DE_IMAGENES } from './imagenes'
import { RUTA_DE_MENSAJES } from './mensajes'
import { RUTA_DE_PLANES } from './planes'
import { RUTA_DE_LA_GUIA, RUTA_DE_LA_PAGINA_DE_INICIO, RUTA_DEL_INICIO } from './rutas-del-panel'
import { RUTA_DE_SEDES } from './sedes'
import { RUTA_DE_USUARIOS } from './usuarios'

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
      entrada('areas', 'Áreas de servicio', 'maletin', RUTA_DE_AREAS),
    ],
  },
  {
    titulo: 'Sitio web',
    soloAdministrador: false,
    entradas: [
      entrada('pagina-de-inicio', 'Página de inicio', 'diseno', RUTA_DE_LA_PAGINA_DE_INICIO),
      entrada('sedes', 'Sedes', 'pin', RUTA_DE_SEDES),
      entrada('clientes', 'Clientes', 'edificio', RUTA_DE_CLIENTES),
    ],
  },
  {
    titulo: 'Para tus clientes',
    soloAdministrador: false,
    entradas: [
      entrada('guia', 'Guía de clientes', 'libro', RUTA_DE_LA_GUIA),
      entrada('publicaciones', 'Publicaciones', 'periodico'),
      entrada('medios', 'Imágenes', 'imagen', RUTA_DE_IMAGENES),
    ],
  },
  {
    titulo: 'Administración',
    soloAdministrador: true,
    entradas: [
      entrada('usuarios', 'Usuarios', 'usuarios', RUTA_DE_USUARIOS),
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

// Una sección queda marcada también en sus páginas internas (por ejemplo, la edición de un plan).
export function esRutaActual(rutaDeLaEntrada: string, ruta: string): boolean {
  if (ruta === rutaDeLaEntrada) return true
  return rutaDeLaEntrada !== RUTA_DEL_INICIO && ruta.startsWith(`${rutaDeLaEntrada}/`)
}

// La entrada del menú de la sección a la que pertenece una ruta (también una página interna).
export function seccionDeLaRuta(ruta: string): Definicion | undefined {
  return MENU.flatMap((g) => g.entradas).find((e) => e.ruta !== null && esRutaActual(e.ruta, ruta))
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
