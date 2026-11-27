// Íconos del sprite que dibuja <SpriteDeIconos /> una sola vez en el layout.
// Los de interfaz son de trazo (Lucide, ISC); los de marcas, de relleno (Simple Icons, CC0).
export const ICONOS_DE_ESTRUCTURA = [
  'telefono',
  'correo',
  'menu',
  'cerrar',
  'arriba',
  'instagram',
  'linkedin',
  'musica',
] as const

// Íconos de las secciones del inicio (T7).
export const ICONOS_DEL_INICIO = [
  'pin',
  'anterior',
  'siguiente',
  'pausa',
  'reproducir',
  'incluido',
  'no-incluido',
  'incluido-circulo',
  'pulgar',
  'trofeo',
  'foco',
  'candado',
  'balanza',
  'equipo',
] as const

export const ICONOS_DE_INTERFAZ = [...ICONOS_DE_ESTRUCTURA, ...ICONOS_DEL_INICIO] as const

export const ICONOS_DE_MARCA = ['whatsapp', 'facebook', 'x', 'youtube'] as const

export type IconoDeEstructura = (typeof ICONOS_DE_ESTRUCTURA)[number]
export type IconoDelInicio = (typeof ICONOS_DEL_INICIO)[number]
export type IconoDeInterfaz = (typeof ICONOS_DE_INTERFAZ)[number]
export type IconoDeMarca = (typeof ICONOS_DE_MARCA)[number]
export type NombreDeIcono = IconoDeInterfaz | IconoDeMarca

const esDeMarca = (nombre: NombreDeIcono): nombre is IconoDeMarca =>
  (ICONOS_DE_MARCA as readonly string[]).includes(nombre)

export const idDeIcono = (nombre: NombreDeIcono): string =>
  esDeMarca(nombre) ? `m-${nombre}` : `i-${nombre}`

interface PropsDeIcono {
  nombre: NombreDeIcono
}

// Decorativo: el texto accesible lo pone quien lo usa.
export function Icono({ nombre }: PropsDeIcono) {
  return (
    <svg
      className={esDeMarca(nombre) ? 'marca-icono' : 'icono'}
      aria-hidden="true"
      focusable="false"
    >
      <use href={`#${idDeIcono(nombre)}`} />
    </svg>
  )
}
