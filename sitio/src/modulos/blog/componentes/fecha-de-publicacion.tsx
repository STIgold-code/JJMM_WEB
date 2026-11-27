import { formatearFechaDePublicacion } from '../dominio/fecha-de-publicacion'

interface PropsFechaDePublicacion {
  // Fecha ISO 8601 guardada en el panel.
  valor: string
  clase?: string
}

// Fecha legible (hora de Lima) con su valor de máquina en datetime.
export function FechaDePublicacion({ valor, clase }: PropsFechaDePublicacion) {
  const fecha = formatearFechaDePublicacion(valor)
  if (!fecha) return null
  return (
    <time className={clase} dateTime={fecha.iso}>
      {fecha.texto}
    </time>
  )
}
