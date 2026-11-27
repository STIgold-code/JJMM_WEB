'use client'

import { useEffect, useState } from 'react'

import { TrazoDelPanel } from './trazos-del-panel'
import { estadoDeVerContrasena } from './ver-contrasena'
import estilos from './boton-ver-contrasena.module.css'

interface Props {
  campo: HTMLInputElement
}

// Botón «ojo» de un campo de contraseña de Payload. Cambia el `type` del campo en el DOM: Payload
// no lo vuelve a escribir al redibujar porque su prop `type` no cambia. Antes de enviar el
// formulario lo devuelve a `password`, así los gestores de contraseñas lo reconocen y el
// navegador no lo guarda como texto.
export function BotonVerContrasena({ campo }: Props) {
  const [visible, setVisible] = useState(false)
  const estado = estadoDeVerContrasena(visible)

  useEffect(() => {
    const formulario = campo.form
    if (!formulario) return
    const ocultarAlEnviar = () => {
      campo.setAttribute('type', estadoDeVerContrasena(false).tipo)
      setVisible(false)
    }
    formulario.addEventListener('submit', ocultarAlEnviar, true)
    return () => formulario.removeEventListener('submit', ocultarAlEnviar, true)
  }, [campo])

  const alternar = () => {
    const siguiente = !visible
    campo.setAttribute('type', estadoDeVerContrasena(siguiente).tipo)
    setVisible(siguiente)
  }

  return (
    <button
      type="button"
      className={estilos.boton}
      aria-label={estado.etiqueta}
      aria-pressed={estado.presionado}
      aria-controls={campo.id || undefined}
      title={estado.etiqueta}
      disabled={campo.disabled}
      onClick={alternar}
    >
      <TrazoDelPanel nombre={visible ? 'ojo-tachado' : 'ojo'} />
    </button>
  )
}
