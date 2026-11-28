import type { AreaDelPanel } from './areas-de-servicio'
import { agregarFila, cambiarFila, moverFila, quitarFila } from './filas-editables'
import { ERROR_DE_POLIGONO, type ErroresDeArea, esPoligonoValido } from './validacion-de-area'

// Formulario de edición de un área, tal como se escribe (el servidor recorta). El código no está:
// es fijo. Cada punto lleva una `clave` estable para la lista de React; no se guarda.
export interface PuntoDelFormulario {
  clave: number
  texto: string
}

export interface FormularioDeArea {
  nombre: string
  nombreCorto: string
  descripcion: string
  puntos: PuntoDelFormulario[]
  mensaje: string
  poligono: string
}

export function formularioDeArea(area: AreaDelPanel): FormularioDeArea {
  return {
    nombre: area.nombre,
    nombreCorto: area.nombreCorto,
    descripcion: area.descripcion,
    puntos: area.puntos.map((texto, indice) => ({ clave: indice + 1, texto })),
    mensaje: area.mensajeDeConsulta ?? '',
    poligono: area.poligono ?? '',
  }
}

const conPuntos = (formulario: FormularioDeArea, puntos: PuntoDelFormulario[]) => ({
  ...formulario,
  puntos,
})

export const agregarPunto = (formulario: FormularioDeArea): FormularioDeArea =>
  conPuntos(
    formulario,
    agregarFila(formulario.puntos, (clave) => ({ clave, texto: '' })),
  )

export const quitarPunto = (formulario: FormularioDeArea, clave: number): FormularioDeArea =>
  conPuntos(formulario, quitarFila(formulario.puntos, clave))

export const moverPunto = (
  formulario: FormularioDeArea,
  desde: number,
  hacia: number,
): FormularioDeArea => conPuntos(formulario, moverFila(formulario.puntos, desde, hacia))

export const cambiarPunto = (
  formulario: FormularioDeArea,
  clave: number,
  texto: string,
): FormularioDeArea => conPuntos(formulario, cambiarFila(formulario.puntos, clave, { texto }))

// Lo que el navegador manda a la acción: los puntos como textos, en su orden.
export const formularioParaGuardar = (formulario: FormularioDeArea) => ({
  ...formulario,
  puntos: formulario.puntos.map((punto) => punto.texto),
})

// Valor que se guardaría: textos recortados, puntos en su orden (una fila nueva vacía cuenta).
const claveDelFormulario = (f: FormularioDeArea): string =>
  JSON.stringify([
    [f.nombre, f.nombreCorto, f.descripcion, f.mensaje, f.poligono].map((t) => t.trim()),
    f.puntos.map((p) => p.texto.trim()),
  ])

// «Guardar cambios» se activa solo si lo que se guardaría difiere de lo guardado.
export function hayCambiosEnElArea(original: FormularioDeArea, actual: FormularioDeArea): boolean {
  return claveDelFormulario(original) !== claveDelFormulario(actual)
}

// Un gajo mal escrito se marca mientras se escribe (vacío no es un error). El servidor vuelve a
// validar todo.
export function erroresEnVivoDeArea({ poligono }: FormularioDeArea): ErroresDeArea {
  const texto = poligono.trim()
  return texto !== '' && !esPoligonoValido(texto) ? { poligono: ERROR_DE_POLIGONO } : {}
}
