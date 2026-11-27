export interface TextoEncontrado {
  ruta: string
  texto: string
}

// Devuelve todos los textos de una estructura de datos con la ruta donde aparecen, para
// revisar reglas de contenido (S9) sobre la semilla completa.
export function recorrerTextos(valor: unknown, ruta = ''): TextoEncontrado[] {
  if (typeof valor === 'string') return [{ ruta, texto: valor }]
  if (Array.isArray(valor)) {
    return valor.flatMap((elemento, indice) => recorrerTextos(elemento, `${ruta}[${indice}]`))
  }
  if (valor !== null && typeof valor === 'object') {
    return Object.entries(valor).flatMap(([clave, elemento]) =>
      recorrerTextos(elemento, ruta === '' ? clave : `${ruta}.${clave}`),
    )
  }
  return []
}
