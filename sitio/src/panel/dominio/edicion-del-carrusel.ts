import {
  type BotonDelFormulario,
  botonNuevo,
  type FormularioDelCarrusel,
  MAXIMO_DE_BOTONES,
  MAXIMO_DE_PORTADAS,
  type PortadaDelFormulario,
  portadaNueva,
} from './carrusel-de-portadas'
import { moverEnLista } from './orden'

// Cambios del formulario del carrusel. Las portadas y sus botones se identifican por su `clave`.
const siguienteClave = (filas: readonly { clave: number }[]) =>
  Math.max(0, ...filas.map((fila) => fila.clave)) + 1

const conPortadas = (formulario: FormularioDelCarrusel, portadas: PortadaDelFormulario[]) => ({
  ...formulario,
  portadas,
})

export function agregarPortada(formulario: FormularioDelCarrusel): FormularioDelCarrusel {
  if (formulario.portadas.length >= MAXIMO_DE_PORTADAS) return formulario
  const nueva = portadaNueva(siguienteClave(formulario.portadas))
  return conPortadas(formulario, [...formulario.portadas, nueva])
}

// El bloque exige al menos una portada: la última no se quita.
export function quitarPortada(
  formulario: FormularioDelCarrusel,
  clave: number,
): FormularioDelCarrusel {
  if (formulario.portadas.length <= 1) return formulario
  return conPortadas(
    formulario,
    formulario.portadas.filter((portada) => portada.clave !== clave),
  )
}

export function moverPortada(
  formulario: FormularioDelCarrusel,
  desde: number,
  hacia: number,
): FormularioDelCarrusel {
  return conPortadas(formulario, moverEnLista(formulario.portadas, desde, hacia))
}

export type CambioDePortada = Partial<Omit<PortadaDelFormulario, 'clave' | 'botones'>>

export function cambiarPortada(
  formulario: FormularioDelCarrusel,
  clave: number,
  cambio: CambioDePortada,
): FormularioDelCarrusel {
  return conPortadas(
    formulario,
    formulario.portadas.map((p) => (p.clave === clave ? { ...p, ...cambio } : p)),
  )
}

function cambiarBotones(
  formulario: FormularioDelCarrusel,
  clave: number,
  cambiar: (botones: BotonDelFormulario[]) => BotonDelFormulario[],
): FormularioDelCarrusel {
  return conPortadas(
    formulario,
    formulario.portadas.map((p) => (p.clave === clave ? { ...p, botones: cambiar(p.botones) } : p)),
  )
}

export function agregarBoton(formulario: FormularioDelCarrusel, clave: number) {
  const portada = formulario.portadas.find((p) => p.clave === clave)
  if (!portada || portada.botones.length >= MAXIMO_DE_BOTONES) return formulario
  return cambiarBotones(formulario, clave, (botones) => [
    ...botones,
    botonNuevo(siguienteClave(botones)),
  ])
}

export function quitarBoton(formulario: FormularioDelCarrusel, clave: number, boton: number) {
  return cambiarBotones(formulario, clave, (botones) => botones.filter((b) => b.clave !== boton))
}

export function cambiarBoton(
  formulario: FormularioDelCarrusel,
  clave: number,
  boton: number,
  cambio: Partial<Omit<BotonDelFormulario, 'clave'>>,
) {
  return cambiarBotones(formulario, clave, (botones) =>
    botones.map((b) => (b.clave === boton ? { ...b, ...cambio } : b)),
  )
}
