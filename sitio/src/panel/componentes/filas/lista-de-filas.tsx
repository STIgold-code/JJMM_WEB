'use client'

import type { DatosDeLasFilas } from '../../aplicacion/consultar-planes'
import { type FilaDelFormulario, resumenDeFila } from '../../dominio/filas-de-la-tabla'
import { useArrastre } from '../comunes/use-arrastre'
import { FilaDeLaTabla } from './fila-de-la-tabla'

interface Props {
  filas: FilaDelFormulario[]
  datos: DatosDeLasFilas
  // El error de cada fila, por su clave.
  errores: Record<number, string>
  puedeQuitar: boolean
  cambios: {
    renombrar: (clave: number, nombre: string) => void
    mover: (desde: number, hacia: number, paso?: -1 | 1) => void
  }
  // Abre el diálogo que confirma quitar la fila.
  alQuitar: (fila: FilaDelFormulario) => void
}

// Las filas en el orden de la tabla, con asa para arrastrar (ratón) y flechas.
export function ListaDeFilas({ filas, datos, errores, puedeQuitar, cambios, alQuitar }: Props) {
  const { propsDeFila, propsDeAsa } = useArrastre((desde, hacia) => cambios.mover(desde, hacia))
  if (filas.length === 0)
    return (
      <p className="px-5 py-6 text-sm text-muted-foreground">
        La tabla no tiene filas. Aquí aparecen las características que compara «Nuestros planes»;
        agrega la primera con «Agregar fila».
      </p>
    )
  return (
    <ol aria-labelledby="titulo-filas">
      {filas.map((fila, indice) => (
        <FilaDeLaTabla
          key={fila.clave}
          fila={fila}
          indice={indice}
          total={filas.length}
          resumen={resumenDeFila(fila.id, datos.planes, datos.inclusiones)}
          error={errores[fila.clave]}
          puedeQuitar={puedeQuitar}
          alRenombrar={(nombre) => cambios.renombrar(fila.clave, nombre)}
          alMover={cambios.mover}
          alQuitar={() => alQuitar(fila)}
          propsDeFila={propsDeFila(indice)}
          propsDeAsa={propsDeAsa(indice)}
        />
      ))}
    </ol>
  )
}
