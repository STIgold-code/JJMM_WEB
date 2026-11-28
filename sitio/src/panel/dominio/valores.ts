import { ICONOS_DE_VALOR, type IconoDeValor } from '@/modulos/nosotros/dominio/valor'

import { ERROR_DE_FORMULARIO, esObjeto } from './formularios'
import { leerTexto, soloConError, textoDemasiadoLargo } from './guia-de-clientes'
import type { Aviso } from './respuesta-al-mensaje'
import { RUTA_DE_LA_PAGINA_DE_INICIO } from './rutas-del-panel'

// Valores de «¿Por qué elegirnos?»: cada uno con su ícono de una lista cerrada (los símbolos del
// sitio). No tienen «Visible»: uno nuevo se ve en el sitio al crearlo. Se llega a ellos desde
// «Página de inicio» (L14), sin entrada propia en el menú.
export const RUTA_DE_VALORES = `${RUTA_DE_LA_PAGINA_DE_INICIO}/valores`

export { ICONOS_DE_VALOR, type IconoDeValor }

export interface ValorDelPanel {
  id: number
  nombre: string
  icono: IconoDeValor
  orden: number
}

// Los nombres de la colección `valores`.
const NOMBRES_DE_ICONO: Readonly<Record<IconoDeValor, string>> = {
  pulgar: 'Pulgar arriba',
  trofeo: 'Trofeo',
  foco: 'Foco',
  candado: 'Candado',
  balanza: 'Balanza',
  equipo: 'Equipo',
}

export const nombreDelIcono = (icono: IconoDeValor): string => NOMBRES_DE_ICONO[icono]

export const secundarioDeValor = (valor: Pick<ValorDelPanel, 'icono'>): string =>
  `Ícono: ${nombreDelIcono(valor.icono)}`

export const esIconoDeValor = (valor: unknown): valor is IconoDeValor =>
  ICONOS_DE_VALOR.some((icono) => icono === valor)

// Lo que se escribe en el panel lateral; un valor nuevo empieza sin ícono elegido.
export interface FormularioDeValor {
  nombre: string
  icono: IconoDeValor | ''
}

export function formularioDeValor(valor: ValorDelPanel | null): FormularioDeValor {
  return { nombre: valor?.nombre ?? '', icono: valor?.icono ?? '' }
}

export function hayCambiosEnElValor(original: FormularioDeValor, actual: FormularioDeValor) {
  return original.nombre.trim() !== actual.nombre.trim() || original.icono !== actual.icono
}

export interface ValorValidado {
  nombre: string
  icono: IconoDeValor
}

export interface ErroresDeValor {
  general?: string
  nombre?: string
  icono?: string
}

const LARGO_MAXIMO_DEL_NOMBRE = 100

function errorDelNombre(nombre: string): string | null {
  if (nombre === '') return 'Escribe el nombre del valor.'
  return nombre.length > LARGO_MAXIMO_DEL_NOMBRE
    ? textoDemasiadoLargo(LARGO_MAXIMO_DEL_NOMBRE)
    : null
}

// Validación en el servidor (`unknown`): nombre obligatorio y un ícono de la lista cerrada.
export function validarFormularioDeValor(
  entrada: unknown,
): { valido: true; datos: ValorValidado } | { valido: false; errores: ErroresDeValor } {
  const nombre = esObjeto(entrada) ? leerTexto(entrada.nombre) : null
  if (!esObjeto(entrada) || nombre === null)
    return { valido: false, errores: { general: ERROR_DE_FORMULARIO } }
  const { icono } = entrada
  const errores = soloConError({
    nombre: errorDelNombre(nombre),
    icono: esIconoDeValor(icono) ? null : 'Elige un ícono.',
  })
  if (Object.keys(errores).length > 0 || !esIconoDeValor(icono)) return { valido: false, errores }
  return { valido: true, datos: { nombre, icono } }
}

// Avisos breves tras escribir.
export const AVISO_DE_VALOR_GUARDADO: Aviso = {
  titulo: 'Valor guardado',
  detalle: '«¿Por qué elegirnos?» ya lo muestra.',
}
export const AVISO_DE_VALOR_CREADO: Aviso = {
  titulo: 'Valor creado',
  detalle: 'Se agregó al final de la sección.',
}
export const avisoDeValorEliminado = (nombre: string): Aviso => ({
  titulo: 'Valor eliminado',
  detalle: `Se borró «${nombre}».`,
})
