// Pantallas del panel que Payload dibuja con su plantilla mínima (sin menú): ingreso, primer
// usuario, contraseña olvidada o nueva, salida y verificación de correo. En ellas se muestra
// el panel de marca. Las rutas salen de `config.admin.routes`, así respeta las que se cambien.
type ClaveDeAcceso =
  'login' | 'createFirstUser' | 'forgot' | 'reset' | 'logout' | 'inactivity' | 'unauthorized'

const CLAVES_DE_ACCESO: readonly ClaveDeAcceso[] = [
  'login',
  'createFirstUser',
  'forgot',
  'reset',
  'logout',
  'inactivity',
  'unauthorized',
]

// `reset` lleva el token detrás (/reset/<token>); las demás son exactas.
const CON_SEGMENTO: ReadonlySet<ClaveDeAcceso> = new Set(['reset'])

// /<coleccion>/verify/<token>: verificación del correo de una cuenta.
const VERIFICACION = /^\/[^/]+\/verify\/[^/]+$/

export function esPantallaDeAcceso(
  ruta: string,
  rutaDelPanel: string,
  rutas: Partial<Record<string, string>>,
): boolean {
  if (ruta !== rutaDelPanel && !ruta.startsWith(`${rutaDelPanel}/`)) return false
  const resto = ruta.slice(rutaDelPanel.length)
  if (VERIFICACION.test(resto)) return true
  return CLAVES_DE_ACCESO.some((clave) => {
    const propia = rutas[clave]
    if (!propia) return false
    return resto === propia || (CON_SEGMENTO.has(clave) && resto.startsWith(`${propia}/`))
  })
}
