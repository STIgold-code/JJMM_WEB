import type { Rol } from '@/compartido/dominio/roles'

import type { Aviso } from './respuesta-al-mensaje'
import { RUTA_DEL_INICIO } from './rutas-del-panel'

// Cuentas del panel. Solo el administrador las gestiona (`/panel/usuarios`); cada persona cambia su
// nombre y su contraseña en «Mi cuenta» (`/panel/cuenta`). La colección no guarda el último
// ingreso, así que el listado no lo muestra.
export const RUTA_DE_USUARIOS = `${RUTA_DEL_INICIO}/usuarios`
export const RUTA_DE_MI_CUENTA = `${RUTA_DEL_INICIO}/cuenta`

export interface UsuarioDelPanel {
  id: number
  nombre: string | null
  correo: string
  rol: Rol
}

export type FiltroDeUsuarios = 'todos' | Rol

export interface FiltroDeUsuariosConConteo {
  filtro: FiltroDeUsuarios
  texto: string
  cantidad: number
}

export const nombreVisible = ({ nombre, correo }: Pick<UsuarioDelPanel, 'nombre' | 'correo'>) =>
  nombre?.trim() || correo

// Orden del listado: por nombre (o correo, si no tiene nombre), como lo lee una persona.
export function ordenarUsuarios(usuarios: readonly UsuarioDelPanel[]): UsuarioDelPanel[] {
  return [...usuarios].sort((a, b) =>
    nombreVisible(a).localeCompare(nombreVisible(b), 'es', { sensitivity: 'base' }),
  )
}

export function filtrosDeUsuarios(
  usuarios: readonly Pick<UsuarioDelPanel, 'rol'>[],
): FiltroDeUsuariosConConteo[] {
  const administradores = usuarios.filter((u) => u.rol === 'administrador').length
  return [
    { filtro: 'todos', texto: 'Todas', cantidad: usuarios.length },
    { filtro: 'administrador', texto: 'Administradores', cantidad: administradores },
    { filtro: 'editor', texto: 'Editores', cantidad: usuarios.length - administradores },
  ]
}

// Sin tildes ni mayúsculas: «maria» encuentra a «María».
const normalizar = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()

export function filtrarUsuarios(
  usuarios: readonly UsuarioDelPanel[],
  filtro: FiltroDeUsuarios,
  busqueda: string,
): UsuarioDelPanel[] {
  const buscado = normalizar(busqueda)
  return usuarios.filter(
    (u) =>
      (filtro === 'todos' || u.rol === filtro) &&
      (!buscado || normalizar(`${u.nombre ?? ''} ${u.correo}`).includes(buscado)),
  )
}

const VACIO_POR_FILTRO: Readonly<Record<FiltroDeUsuarios, string>> = {
  todos: 'No hay cuentas.',
  administrador: 'No hay administradores.',
  editor: 'No hay editores. Crea una cuenta con el rol «Editor» para quien cambie el contenido.',
}

export function textoSinUsuarios(filtro: FiltroDeUsuarios, busqueda: string): string {
  const limpio = busqueda.trim()
  if (limpio) return `Ninguna cuenta coincide con «${limpio}». Prueba con otra palabra.`
  return VACIO_POR_FILTRO[filtro]
}

// Lo que se escribe en el diálogo de una cuenta. La contraseña siempre empieza vacía: al editar,
// vacía significa «no cambiarla».
export interface FormularioDeCuenta {
  nombre: string
  correo: string
  rol: Rol
  clave: string
}

export function formularioDeCuenta(cuenta: UsuarioDelPanel | null): FormularioDeCuenta {
  if (!cuenta) return { nombre: '', correo: '', rol: 'editor', clave: '' }
  return { nombre: cuenta.nombre ?? '', correo: cuenta.correo, rol: cuenta.rol, clave: '' }
}

export function hayCambiosEnLaCuenta(
  original: FormularioDeCuenta,
  actual: FormularioDeCuenta,
): boolean {
  return (
    original.nombre.trim() !== actual.nombre.trim() ||
    original.correo.trim().toLowerCase() !== actual.correo.trim().toLowerCase() ||
    original.rol !== actual.rol ||
    actual.clave !== ''
  )
}

// Avisos breves tras escribir, con el texto de la maqueta aprobada.
export function avisoDeCuentaCreada(nombre: string): Aviso {
  return {
    titulo: 'Cuenta creada',
    detalle: `Comparte con ${nombre} su correo y la contraseña temporal.`,
  }
}

export function avisoDeCuentaGuardada(nombre: string, claveCambiada: boolean): Aviso {
  return {
    titulo: 'Cambios guardados',
    detalle: claveCambiada
      ? `Comparte con ${nombre} su contraseña nueva. Sus sesiones abiertas se cerraron.`
      : `Los cambios de ${nombre} valen desde su próximo clic en el panel.`,
  }
}

export function avisoDeCuentaEliminada(nombre: string): Aviso {
  return { titulo: 'Cuenta eliminada', detalle: `${nombre} ya no puede entrar al panel.` }
}
