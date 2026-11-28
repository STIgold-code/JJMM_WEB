import { Layers } from 'lucide-react'

import { EstadoVacio } from '../comunes/estado-vacio'

// Estado vacío: todavía no hay planes. La tabla «Nuestros planes» del inicio no se muestra.
export function SinPlanes() {
  return (
    <EstadoVacio
      Icono={Layers}
      titulo="Todavía no hay planes"
      texto="Cada plan que crees aparecerá aquí como una columna de la tabla «Nuestros planes» del inicio. Mientras no haya ninguno visible, el sitio no muestra esa tabla."
    />
  )
}
