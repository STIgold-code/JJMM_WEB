'use client'

import { useState } from 'react'

import { Button } from '../ui/button'
import { Confirmacion } from './confirmacion'

interface Props {
  sucio: boolean
  guardando: boolean
  guardadoRecien: boolean
  alDescartar: () => void
  // Texto del botón principal; en una creación, por ejemplo, «Crear sede».
  textoDeGuardar?: string
  // Pie fijo de una tarjeta corta (por ejemplo, «Mi cuenta»), en vez de flotar al pie de la página.
  enTarjeta?: boolean
}

const DISPOSICION = 'flex flex-wrap items-center justify-end gap-3 px-4 py-[0.85rem]'
const ESTILO_FLOTANTE = `sticky bottom-0 z-15 mt-6 rounded-lg border bg-white/96 shadow-md ${DISPOSICION}`
const ESTILO_EN_TARJETA = `rounded-b-lg border-t ${DISPOSICION}`

function Estado({ sucio, guardadoRecien }: Pick<Props, 'sucio' | 'guardadoRecien'>) {
  if (sucio)
    return (
      <span className="mr-auto inline-flex items-center gap-[0.45rem] text-sm font-[650] text-pendiente before:size-2 before:rounded-full before:bg-pendiente-solido before:content-[''] max-sm:w-full">
        Cambios sin guardar
      </span>
    )
  return (
    <span className="mr-auto text-sm text-muted-foreground max-sm:w-full">
      {guardadoRecien ? 'Guardado hace un momento.' : 'Sin cambios.'}
    </span>
  )
}

// Barra fija al pie de la edición: estado de los cambios, «Descartar cambios» (con confirmación)
// y «Guardar cambios», activo solo si hay algo que guardar. El botón de guardar envía el
// formulario que la contiene.
export function BarraDeGuardado(props: Props) {
  const { sucio, guardando, guardadoRecien, alDescartar } = props
  const [confirmando, setConfirmando] = useState(false)
  return (
    <div className={props.enTarjeta ? ESTILO_EN_TARJETA : ESTILO_FLOTANTE}>
      <p aria-live="polite" className="contents">
        <Estado sucio={sucio} guardadoRecien={guardadoRecien} />
      </p>
      {sucio && (
        <Button
          type="button"
          variant="outline"
          disabled={guardando}
          onClick={() => setConfirmando(true)}
          className="bg-card max-sm:flex-1"
        >
          Descartar cambios
        </Button>
      )}
      <Button
        type="submit"
        disabled={!sucio || guardando}
        className="hover:bg-primary-hover max-sm:flex-1"
      >
        {guardando ? 'Guardando…' : (props.textoDeGuardar ?? 'Guardar cambios')}
      </Button>
      <Confirmacion
        abierta={confirmando}
        titulo="¿Descartar los cambios?"
        texto="Se pierde todo lo que cambiaste desde la última vez que guardaste."
        accion="Descartar cambios"
        alConfirmar={() => {
          alDescartar()
          setConfirmando(false)
        }}
        alCerrar={() => setConfirmando(false)}
      />
    </div>
  )
}
