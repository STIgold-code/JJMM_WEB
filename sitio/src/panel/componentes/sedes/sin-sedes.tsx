import { MapPin } from 'lucide-react'

import { EstadoVacio } from '../comunes/estado-vacio'

// Estado vacío: todavía no hay sedes. El pie y «Contáctanos» se muestran sin sedes.
export function SinSedes() {
  return (
    <EstadoVacio
      Icono={MapPin}
      titulo="Todavía no hay sedes"
      texto="Cada sede que crees aparecerá aquí, con su dirección y sus celulares. Las visibles salen en el pie del sitio y como una pestaña de «Contáctanos»."
    />
  )
}
