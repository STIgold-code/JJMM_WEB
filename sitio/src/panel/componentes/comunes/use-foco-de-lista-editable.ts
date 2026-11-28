'use client'

import { useEffect, useRef } from 'react'

// Listas de filas que se agregan y quitan en un formulario (puntos de un área, filas de la tabla):
// tras agregar una fila, el foco va a su campo; tras quitar una, al botón «Agregar» (la fila con
// el foco ya no existe).
export function useFocoDeListaEditable(
  claves: readonly number[],
  idDelCampo: (clave: number) => string,
  idDeAgregar: string,
) {
  const anteriores = useRef(claves)
  useEffect(() => {
    const previas = anteriores.current
    anteriores.current = claves
    const nueva = claves.find((clave) => !previas.includes(clave))
    if (claves.length > previas.length && nueva !== undefined)
      document.getElementById(idDelCampo(nueva))?.focus()
    else if (claves.length < previas.length) document.getElementById(idDeAgregar)?.focus()
  }, [claves, idDelCampo, idDeAgregar])
}
