'use client'

import { CLASE_DE_AYUDA } from './campo'
import { Interruptor } from './interruptor'

interface Props {
  // Prefijo de los ids de la etiqueta y la ayuda, único en la página.
  id: string
  visible: boolean
  ayuda: string
  alCambiar: (visible: boolean) => void
  // Otro interruptor de sí o no con el mismo dibujo (por ejemplo, «La imagen es decorativa»).
  etiqueta?: string
}

// «Visible en el sitio» de una edición: el interruptor con su etiqueta y su ayuda.
export function FilaVisible({
  id,
  visible,
  ayuda,
  alCambiar,
  etiqueta = 'Visible en el sitio',
}: Props) {
  return (
    <div className="flex items-start gap-3">
      <Interruptor
        activo={visible}
        alCambiar={alCambiar}
        aria-labelledby={`${id}-etiqueta`}
        aria-describedby={`${id}-ayuda`}
        className="mt-[0.15rem]"
      />
      <div>
        <p id={`${id}-etiqueta`} className="text-sm font-semibold">
          {etiqueta}
        </p>
        <p id={`${id}-ayuda`} className={CLASE_DE_AYUDA}>
          {ayuda}
        </p>
      </div>
    </div>
  )
}
