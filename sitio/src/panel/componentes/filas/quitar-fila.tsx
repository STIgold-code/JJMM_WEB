'use client'

import type { DatosDeLasFilas } from '../../aplicacion/consultar-planes'
import { celdasDeLaFila, type FilaDelFormulario } from '../../dominio/filas-de-la-tabla'
import { Confirmacion } from '../comunes/confirmacion'

interface Props {
  // La fila que se quiere quitar; `null`: el diálogo está cerrado.
  fila: FilaDelFormulario | null
  datos: Pick<DatosDeLasFilas, 'planes' | 'inclusiones'>
  alQuitar: (clave: number) => void
  alCerrar: () => void
}

// Confirmación de la maqueta antes de quitar una fila: dice qué tenía cada plan en ella. Quitarla
// solo cambia el formulario; se aplica al guardar.
export function QuitarFila({ fila, datos, alQuitar, alCerrar }: Props) {
  const nombre = fila?.nombre.trim() || 'sin nombre'
  const total = datos.planes.length
  const celdas = celdasDeLaFila(fila?.id ?? null, datos.planes, datos.inclusiones)
  return (
    <Confirmacion
      abierta={fila !== null}
      titulo={`¿Eliminar la fila «${nombre}»?`}
      texto={`Se quita de la tabla y se borran sus ${total} celdas (${celdas}). Si solo un plan no la incluye, márcala «No incluido» en ese plan. Se aplica al guardar.`}
      accion="Eliminar fila"
      alConfirmar={() => {
        if (fila) alQuitar(fila.clave)
        alCerrar()
      }}
      alCerrar={alCerrar}
    />
  )
}
