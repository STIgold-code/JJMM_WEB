import { CircleAlert } from 'lucide-react'

// Error de un campo, con el ícono de alerta de la maqueta. El campo lo enlaza con
// `aria-describedby`, así el lector de pantalla lo lee al llegar al campo.
export function MensajeDeError({ id, texto }: { id: string; texto: string }) {
  return (
    <p id={id} className="flex gap-[0.35rem] text-[0.8125rem] font-semibold text-error">
      <CircleAlert aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
      {texto}
    </p>
  )
}
