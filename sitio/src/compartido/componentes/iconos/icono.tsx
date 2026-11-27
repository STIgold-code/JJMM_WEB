// Íconos del sprite que dibuja <SpriteDeIconos /> una sola vez en el layout.
// Los de interfaz son de trazo (Lucide, ISC); los de marcas, de relleno (Simple Icons, CC0).
export const ICONOS_DE_INTERFAZ = [
  'telefono',
  'correo',
  'menu',
  'cerrar',
  'arriba',
  'instagram',
  'linkedin',
  'musica',
] as const

export const ICONOS_DE_MARCA = ['whatsapp', 'facebook', 'x', 'youtube'] as const

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
