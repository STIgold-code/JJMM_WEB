import type { ErroresDelCarrusel, ErroresDePortada } from './errores-del-carrusel'

// Qué error borra el cambio de cada campo de una portada.
const ERROR_DEL_CAMPO: Readonly<Record<string, keyof ErroresDePortada>> = {
  imagen: 'imagen',
  imagenParaCelular: 'imagenParaCelular',
  sello: 'sello',
  encuadreEnCelular: 'encuadre',
  titulo: 'titulo',
  subtitulo: 'subtitulo',
  lista: 'lista',
}

function conPortada(
  errores: ErroresDelCarrusel,
  indice: number,
  cambiar: (actuales: ErroresDePortada) => ErroresDePortada,
): ErroresDelCarrusel {
  const actuales = errores.portada?.[indice]
  if (!actuales) return errores
  const portada = { ...errores.portada }
  const nuevos = cambiar(actuales)
  if (Object.keys(nuevos).length > 0) portada[indice] = nuevos
  else delete portada[indice]
  return { ...errores, portada }
}

// Al corregir un campo de una portada, su error se borra.
export function sinErroresDeCampos(
  errores: ErroresDelCarrusel,
  indice: number,
  campos: readonly string[],
): ErroresDelCarrusel {
  const quitar = new Set<string>(campos.flatMap((campo) => ERROR_DEL_CAMPO[campo] ?? []))
  return conPortada(errores, indice, (actuales) =>
    Object.fromEntries(Object.entries(actuales).filter(([clave]) => !quitar.has(clave))),
  )
}

export function sinErroresDeBotones(errores: ErroresDelCarrusel, indice: number) {
  return conPortada(errores, indice, ({ boton: _, botones: __, ...resto }) => resto)
}

// Al agregar, quitar o mover portadas, los errores por posición ya no corresponden.
export function sinErroresDePortadas({
  portada: _,
  portadas: __,
  ...resto
}: ErroresDelCarrusel): ErroresDelCarrusel {
  return resto
}
