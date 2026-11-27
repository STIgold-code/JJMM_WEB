'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import type { MensajeDeContacto } from '../../aplicacion/consultar-mensajes'
import { Sheet, SheetContent } from '../ui/sheet'
import { AccionesDelMensaje } from './acciones-del-mensaje'
import { CabeceraDelMensaje, CuerpoDelMensaje } from './contenido-del-mensaje'
import { ID_DE_LISTA, idDeFila } from './ids-de-mensajes'

interface Props {
  mensaje: MensajeDeContacto | null
  recibido: string | null
  puedeEliminar: boolean
  rutaAlCerrar: string
}

interface Visible {
  mensaje: MensajeDeContacto
  recibido: string
}

// Radix devuelve el foco al disparador del panel; aquí el panel se abre desde la URL, así que el
// foco vuelve a la fila del mensaje o, si ya no está en la lista, al listado o al contenido.
function devolverFoco(evento: Event, id: number): void {
  evento.preventDefault()
  const destino =
    document.getElementById(idDeFila(id)) ??
    document.getElementById(ID_DE_LISTA) ??
    document.getElementById('contenido')
  destino?.focus()
}

// Panel lateral con el mensaje abierto (`?mensaje=<id>`). Cerrarlo quita el id de la URL. El
// último mensaje se conserva mientras dura la animación de salida.
export function HojaDelMensaje({ mensaje, recibido, puedeEliminar, rutaAlCerrar }: Props) {
  const router = useRouter()
  const [cerrado, setCerrado] = useState<number | null>(null)
  const [visible, setVisible] = useState<Visible | null>(null)
  if (mensaje && recibido && visible?.mensaje !== mensaje) setVisible({ mensaje, recibido })
  if (!mensaje && cerrado !== null) setCerrado(null)
  const abierto = mensaje !== null && cerrado !== mensaje.id

  function cerrar(): void {
    if (mensaje) setCerrado(mensaje.id)
    router.replace(rutaAlCerrar, { scroll: false })
  }

  if (!visible) return null
  const actual = visible.mensaje
  return (
    <Sheet open={abierto} onOpenChange={(abrir) => (abrir ? undefined : cerrar())}>
      <SheetContent
        showCloseButton={false}
        onCloseAutoFocus={(evento) => devolverFoco(evento, actual.id)}
        className="w-full gap-0 bg-card p-0 sm:max-w-lg"
      >
        <CabeceraDelMensaje mensaje={actual} recibido={visible.recibido} />
        <CuerpoDelMensaje mensaje={actual} />
        <AccionesDelMensaje
          id={actual.id}
          nombre={actual.nombre}
          estado={actual.estado}
          puedeEliminar={puedeEliminar}
          alEliminar={cerrar}
        />
      </SheetContent>
    </Sheet>
  )
}
