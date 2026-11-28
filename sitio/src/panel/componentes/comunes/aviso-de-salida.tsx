'use client'

import { Confirmacion } from './confirmacion'
import { useAvisoDeSalida } from './use-aviso-de-salida'

// Con cambios sin guardar, salir por un enlace del panel pide confirmación.
export function AvisoDeSalida({ sucio }: { sucio: boolean }) {
  const { destino, salirSinGuardar, seguirEditando } = useAvisoDeSalida(sucio)
  return (
    <Confirmacion
      abierta={destino !== null}
      titulo="Tienes cambios sin guardar"
      texto="Si sales ahora, se pierden. Vuelve y pulsa «Guardar cambios» para conservarlos."
      accion="Salir sin guardar"
      cancelar="Seguir editando"
      alConfirmar={salirSinGuardar}
      alCerrar={seguirEditando}
    />
  )
}
