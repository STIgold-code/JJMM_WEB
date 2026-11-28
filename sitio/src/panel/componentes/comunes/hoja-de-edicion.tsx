'use client'

import { X } from 'lucide-react'
import { type ReactNode, useState } from 'react'

import { Button } from '../ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet'
import { Confirmacion } from './confirmacion'

interface Props {
  abierta: boolean
  alCerrar: () => void
  titulo: string
  descripcion: string
  sucio: boolean
  guardando: boolean
  textoDeGuardar: string
  alGuardar: () => void
  // «Eliminar…», solo si la cuenta puede borrar.
  eliminar?: ReactNode
  children: ReactNode
}

function Estado({ sucio }: { sucio: boolean }) {
  if (!sucio) return <span className="text-muted-foreground">Sin cambios.</span>
  return (
    <span className="inline-flex items-center gap-[0.45rem] font-[650] text-pendiente before:size-2 before:rounded-full before:bg-pendiente-solido before:content-['']">
      Cambios sin guardar
    </span>
  )
}

// Panel lateral de edición de la maqueta («Editar aviso», «Editar vencimiento»): título, campos
// con desplazamiento propio y pie con el estado de los cambios, «Guardar» (activo solo con
// cambios) y «Cancelar». Cerrarlo con cambios sin guardar pide confirmación. Radix devuelve el
// foco al botón que lo abrió.
export function HojaDeEdicion(props: Props) {
  const { abierta, sucio, guardando, alCerrar } = props
  const [confirmando, setConfirmando] = useState(false)
  const intentarCerrar = () => {
    if (guardando) return
    if (sucio) setConfirmando(true)
    else alCerrar()
  }
  return (
    <Sheet open={abierta} onOpenChange={(abrir) => !abrir && intentarCerrar()}>
      <SheetContent showCloseButton={false} className="w-full gap-0 bg-card p-0 sm:max-w-lg">
        <form
          noValidate
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(evento) => {
            evento.preventDefault()
            props.alGuardar()
          }}
        >
          <Cabecera {...props} alCerrar={intentarCerrar} />
          <div className="grid flex-1 content-start gap-5 overflow-y-auto p-5">
            {props.children}
          </div>
          <Pie {...props} alCancelar={intentarCerrar} />
        </form>
      </SheetContent>
      <ConfirmarDescarte
        abierta={confirmando}
        alDescartar={() => {
          setConfirmando(false)
          alCerrar()
        }}
        alSeguir={() => setConfirmando(false)}
      />
    </Sheet>
  )
}

function ConfirmarDescarte(props: {
  abierta: boolean
  alDescartar: () => void
  alSeguir: () => void
}) {
  return (
    <Confirmacion
      abierta={props.abierta}
      titulo="¿Descartar los cambios?"
      texto="Se pierde todo lo que escribiste desde que abriste este panel."
      accion="Descartar cambios"
      cancelar="Seguir editando"
      alConfirmar={props.alDescartar}
      alCerrar={props.alSeguir}
    />
  )
}

function Pie(props: Props & { alCancelar: () => void }) {
  const { sucio, guardando } = props
  return (
    <SheetFooter className="mt-0 flex-row flex-wrap items-center gap-2 border-t bg-background px-5 py-4">
      <p aria-live="polite" className="w-full text-sm">
        <Estado sucio={sucio} />
      </p>
      <Button type="submit" disabled={!sucio || guardando} className="hover:bg-primary-hover">
        {guardando ? 'Guardando…' : props.textoDeGuardar}
      </Button>
      <Button type="button" variant="outline" className="bg-card" onClick={props.alCancelar}>
        Cancelar
      </Button>
      {props.eliminar && <span className="flex-1" />}
      {props.eliminar}
    </SheetFooter>
  )
}

function Cabecera(props: { titulo: string; descripcion: string; alCerrar: () => void }) {
  return (
    <SheetHeader className="flex-row items-start justify-between gap-4 border-b px-5 pt-5 pb-4">
      <div className="grid gap-[0.3rem]">
        <SheetTitle className="text-lg leading-snug font-[650]">{props.titulo}</SheetTitle>
        <SheetDescription>{props.descripcion}</SheetDescription>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Cerrar"
        onClick={props.alCerrar}
      >
        <X aria-hidden="true" />
      </Button>
    </SheetHeader>
  )
}
