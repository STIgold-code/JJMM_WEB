import type { Periodicidad } from '@/modulos/vencimientos/dominio/vencimiento'

import { normalizarParaBuscar } from './busqueda'
import type { Aviso } from './respuesta-al-mensaje'

// Vencimientos de la guía: cada obligación y cuándo vence, en palabras. La colección no guarda
// fechas (las fechas exactas son el cronograma de SUNAT).
export interface VencimientoDelPanel {
  id: number
  obligacion: string
  periodicidad: Periodicidad
  cuandoVence: string
  nota: string | null
  orden: number
}

export type FiltroDeVencimientos = 'todos' | Periodicidad

export interface FiltroDeVencimientosConConteo {
  filtro: FiltroDeVencimientos
  texto: string
  cantidad: number
}

// El texto que la guía usa cuando el estudio no tiene la fecha (semilla y ayuda del formulario).
export const SIN_FECHA_PUBLICADA = 'Consulta la fecha con el estudio.'

const sinPunto = (texto: string) => normalizarParaBuscar(texto).replace(/\.$/, '')

// «Fecha por confirmar»: lo único que los datos permiten saber es si «Cuándo vence» es ese texto.
export function sinFechaPublicada(cuandoVence: string): boolean {
  return sinPunto(cuandoVence) === sinPunto(SIN_FECHA_PUBLICADA)
}

export function contarSinFecha(vencimientos: readonly VencimientoDelPanel[]): number {
  return vencimientos.filter((v) => sinFechaPublicada(v.cuandoVence)).length
}

export function filtrosDeVencimientos(
  vencimientos: readonly Pick<VencimientoDelPanel, 'periodicidad'>[],
): FiltroDeVencimientosConConteo[] {
  const mensuales = vencimientos.filter((v) => v.periodicidad === 'mensual').length
  return [
    { filtro: 'todos', texto: 'Todos', cantidad: vencimientos.length },
    { filtro: 'mensual', texto: 'Mensuales', cantidad: mensuales },
    { filtro: 'anual', texto: 'Anuales', cantidad: vencimientos.length - mensuales },
  ]
}

export function filtrarVencimientos(
  vencimientos: readonly VencimientoDelPanel[],
  filtro: FiltroDeVencimientos,
  busqueda: string,
): VencimientoDelPanel[] {
  const buscado = normalizarParaBuscar(busqueda)
  return vencimientos.filter(
    (v) =>
      (filtro === 'todos' || v.periodicidad === filtro) &&
      (!buscado || normalizarParaBuscar(v.obligacion).includes(buscado)),
  )
}

const VACIO_POR_FILTRO: Readonly<Record<FiltroDeVencimientos, string>> = {
  todos: 'No hay vencimientos.',
  mensual: 'No hay vencimientos mensuales.',
  anual: 'No hay vencimientos anuales.',
}

export function textoSinVencimientos(filtro: FiltroDeVencimientos, busqueda: string): string {
  const limpio = busqueda.trim()
  if (limpio) return `Ninguna obligación coincide con «${limpio}». Prueba con otra palabra.`
  return VACIO_POR_FILTRO[filtro]
}

export const NOMBRES_DE_PERIODICIDAD: Readonly<Record<Periodicidad, string>> = {
  mensual: 'Mensual',
  anual: 'Anual',
}

// Lo que se escribe en el panel lateral de un vencimiento.
export interface FormularioDeVencimiento {
  obligacion: string
  periodicidad: Periodicidad
  cuandoVence: string
  nota: string
}

export function formularioDeVencimiento(
  vencimiento: VencimientoDelPanel | null,
): FormularioDeVencimiento {
  return {
    obligacion: vencimiento?.obligacion ?? '',
    periodicidad: vencimiento?.periodicidad ?? 'mensual',
    cuandoVence: vencimiento?.cuandoVence ?? '',
    nota: vencimiento?.nota ?? '',
  }
}

export function hayCambiosEnElVencimiento(
  original: FormularioDeVencimiento,
  actual: FormularioDeVencimiento,
): boolean {
  return (Object.keys(original) as (keyof FormularioDeVencimiento)[]).some(
    (campo) => original[campo] !== actual[campo],
  )
}

export function avisoDeVencimientoGuardado(obligacion: string, nuevo: boolean): Aviso {
  return {
    titulo: nuevo ? `${obligacion} agregado` : 'Cambios guardados',
    detalle: 'La guía de clientes ya muestra el vencimiento.',
  }
}

export function avisoDeVencimientoEliminado(obligacion: string): Aviso {
  return { titulo: 'Vencimiento eliminado', detalle: `Se borró ${obligacion}.` }
}
