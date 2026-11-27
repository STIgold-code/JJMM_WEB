import type { ReactNode } from 'react'

import type { CampoDelMensaje } from '../dominio/mensaje-de-contacto'
import estilos from './contacto.module.css'

export interface PropsDeControl {
  id: string
  name: CampoDelMensaje
  'aria-invalid': boolean
  'aria-describedby'?: string
}

interface PropsCampoDeFormulario {
  campo: CampoDelMensaje
  etiqueta: string
  error: string | undefined
  // Prefijo único del formulario (useId), para que los id no choquen.
  prefijo: string
  // Dibuja el control (input, select o textarea) con las props de accesibilidad ya armadas.
  children: (props: PropsDeControl) => ReactNode
}

// Campo con su etiqueta y su error en línea, enlazado con aria-describedby.
export function CampoDeFormulario(props: PropsCampoDeFormulario) {
  const { campo, etiqueta, error, prefijo, children } = props
  const id = `${prefijo}-${campo}`
  const idDelError = `${id}-error`
  return (
    <div className={estilos.campo}>
      <label htmlFor={id}>{etiqueta}</label>
      {children({
        id,
        name: campo,
        'aria-invalid': Boolean(error),
        'aria-describedby': error ? idDelError : undefined,
      })}
      {error ? (
        <span className={estilos.error} id={idDelError}>
          {error}
        </span>
      ) : null}
    </div>
  )
}
