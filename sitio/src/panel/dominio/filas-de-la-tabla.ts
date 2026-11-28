import { contieneMonto, MENSAJE_SIN_MONTOS } from '@/modulos/planes/dominio/inclusion-de-plan'

import { normalizarParaBuscar } from './busqueda'
import { agregarFila } from './filas-editables'
import type { CaracteristicaDelPanel, InclusionDelPanel, PlanDelPanel } from './planes'
import { aCelda, type VistaPreviaDePlanes } from './vista-previa-de-planes'

// «Filas de la tabla»: las características que compara «Nuestros planes», comunes a todos los
// planes. Se renombran en la misma fila, se ordenan, se agregan y se quitan, y todo se aplica al
// guardar (maqueta «Planes › Filas de la tabla»). Una fila nueva es «No incluido» en todos los
// planes: no se crean celdas (la que falta ya se ve como no incluida).
export interface FilaDelFormulario {
  clave: number
  // `null`: una fila nueva, todavía sin guardar.
  id: number | null
  nombre: string
}

export function formularioDeFilas(guardadas: readonly CaracteristicaDelPanel[]) {
  return guardadas.map(({ id, nombre }, indice) => ({ clave: indice + 1, id, nombre }))
}

export const agregarFilaNueva = (filas: readonly FilaDelFormulario[]): FilaDelFormulario[] =>
  agregarFila(filas, (clave) => ({ clave, id: null, nombre: '' }))

// Los ids de las filas que se cargaron: el servidor solo borra filas que el navegador conocía.
export const conocidasDe = (guardadas: readonly { id: number }[]): number[] =>
  guardadas.map(({ id }) => id)

// Lo que el navegador manda a la acción: los ids que conoce y cada fila con su id (o nulo) y su
// nombre, en orden.
export const filasParaGuardar = (
  conocidas: readonly number[],
  filas: readonly FilaDelFormulario[],
) => ({
  conocidas: [...conocidas],
  filas: filas.map(({ id, nombre }) => ({ id, nombre })),
})

const clave = (filas: readonly FilaDelFormulario[]) =>
  JSON.stringify(filas.map((f) => [f.id, f.nombre.trim()]))

export function hayCambiosEnLasFilas(
  original: readonly FilaDelFormulario[],
  actual: readonly FilaDelFormulario[],
): boolean {
  return clave(original) !== clave(actual)
}

export const errorDeFilaRepetida = (posicion: number): string =>
  `Ya hay una fila con ese nombre (posición ${posicion}).`

// Montos y nombres repetidos (sin tildes ni mayúsculas), por la clave de la fila, mientras se
// escribe. El servidor vuelve a validar todo.
export function erroresEnVivoDeFilas(filas: readonly FilaDelFormulario[]): Record<number, string> {
  const vistas = new Map<string, number>()
  const errores: Record<number, string> = {}
  filas.forEach((fila, indice) => {
    const nombre = normalizarParaBuscar(fila.nombre)
    const anterior = vistas.get(nombre)
    if (contieneMonto(fila.nombre)) errores[fila.clave] = MENSAJE_SIN_MONTOS
    else if (nombre && anterior !== undefined) errores[fila.clave] = errorDeFilaRepetida(anterior)
    if (nombre && anterior === undefined) vistas.set(nombre, indice + 1)
  })
  return errores
}

// Las celdas guardadas de una fila, por plan. Una fila nueva (`null`) no tiene ninguna.
const celdasDe = (caracteristica: number | null, inclusiones: readonly InclusionDelPanel[]) =>
  new Map(
    inclusiones
      .filter((i) => caracteristica !== null && i.caracteristica === caracteristica)
      .map((i) => [i.plan, i]),
  )

// Dato secundario de la fila: en cuántos planes está incluida (todos los planes, también los
// ocultos: la fila es de la tabla, no del sitio).
export function resumenDeFila(
  caracteristica: number | null,
  planes: readonly PlanDelPanel[],
  inclusiones: readonly InclusionDelPanel[],
): string {
  const total = planes.length
  if (caracteristica === null)
    return `Nueva: en los ${total} planes empieza como «No incluido». Márcala en cada plan.`
  const guardadas = celdasDe(caracteristica, inclusiones)
  const celdas = planes.map((p) => aCelda(guardadas.get(p.id)))
  const textos = celdas.filter((c) => c.tipo === 'texto').length
  const incluidas = celdas.filter((c) => c.tipo === 'incluido').length
  if (textos > 0) return `Con texto en ${textos} de ${total} planes`
  if (incluidas === 0) return 'No incluida en ningún plan'
  if (incluidas === total) return `Incluida en los ${total} planes`
  return `Incluida en ${incluidas} de ${total} planes`
}

// Para el diálogo de borrado: lo que tiene cada plan en esa fila.
export function celdasDeLaFila(
  caracteristica: number | null,
  planes: readonly PlanDelPanel[],
  inclusiones: readonly InclusionDelPanel[],
): string {
  const guardadas = celdasDe(caracteristica, inclusiones)
  return planes
    .map((plan) => {
      const celda = aCelda(guardadas.get(plan.id))
      if (celda.tipo === 'texto') return `${plan.nombre}: «${celda.texto}»`
      return `${plan.nombre}: ${celda.tipo === 'incluido' ? 'Incluido' : 'No incluido'}`
    })
    .join(' · ')
}

// La tabla del sitio con las filas del formulario: solo los planes visibles, en su orden.
export function vistaPreviaDeFilas(
  planes: readonly PlanDelPanel[],
  inclusiones: readonly InclusionDelPanel[],
  filas: readonly FilaDelFormulario[],
): VistaPreviaDePlanes {
  const visibles = planes.filter((p) => p.visible)
  return {
    columnas: visibles.map((p) => ({ nombre: p.nombre, editado: false })),
    filas: filas.map((fila) => {
      const guardadas = celdasDe(fila.id, inclusiones)
      return {
        caracteristica: fila.nombre.trim() || '…',
        celdas: visibles.map((p) => aCelda(guardadas.get(p.id))),
      }
    }),
    planOculto: false,
  }
}
