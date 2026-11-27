// Textos del inicio del panel.

const FECHA_DE_LIMA = new Intl.DateTimeFormat('es-PE', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'America/Lima',
})

// «Viernes, 27 de noviembre de 2026», con la fecha de Lima aunque el servidor esté en otra zona.
export function fechaLarga(fecha: Date): string {
  const texto = FECHA_DE_LIMA.format(fecha)
  return texto.charAt(0).toLocaleUpperCase('es-PE') + texto.slice(1)
}

// Primera oración de una descripción del panel, para que cada entrada quepa en una línea.
// No corta dentro de «comillas latinas» ni dentro de paréntesis.
export function primeraOracion(texto: string): string {
  const limpio = texto.trim()
  let profundidad = 0
  for (let indice = 0; indice < limpio.length; indice += 1) {
    const caracter = limpio[indice]
    if (caracter === '«' || caracter === '(') profundidad += 1
    if (caracter === '»' || caracter === ')') profundidad = Math.max(0, profundidad - 1)
    const fin = caracter === '.' && profundidad === 0
    if (fin && (indice === limpio.length - 1 || limpio[indice + 1] === ' ')) {
      return limpio.slice(0, indice + 1)
    }
  }
  return limpio
}

export function cantidadConNombre(cantidad: number, singular: string, plural: string): string {
  return cantidad === 1 ? singular : plural
}
