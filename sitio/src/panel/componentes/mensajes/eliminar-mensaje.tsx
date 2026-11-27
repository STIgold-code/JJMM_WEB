'use client'

import { Trash2 } from 'lucide-react'
import { type MouseEvent, useState, useTransition } from 'react'

import { eliminarElMensaje } from '../../acciones/mensajes'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { avisarResultado } from './avisos'

interface Props {
  id: number
  nombre: string
  alEliminar: () => void
}

interface PropsDeConfirmacion {
  nombre: string
  eliminando: boolean
  alConfirmar: (evento: MouseEvent<HTMLButtonElement>) => void
}

function Confirmacion({ nombre, eliminando, alConfirmar }: PropsDeConfirmacion) {
  return (
    <AlertDialogContent className="bg-card">
      <AlertDialogHeader>
        <AlertDialogTitle>¿Eliminar el mensaje de {nombre}?</AlertDialogTitle>
        <AlertDialogDescription>
          Se borra para siempre y no se puede recuperar. Si solo ya lo respondiste, márcalo como
          atendido.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={eliminando}>Cancelar</AlertDialogCancel>
        <AlertDialogAction variant="destructive" onClick={alConfirmar} disabled={eliminando}>
          {eliminando ? 'Eliminando…' : 'Eliminar mensaje'}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

// Borrado con confirmación en un diálogo propio (AlertDialog), nunca `window.confirm`. El foco
// empieza en «Cancelar»; el diálogo sigue abierto mientras se elimina.
export function EliminarMensaje({ id, nombre, alEliminar }: Props) {
  const [abierto, setAbierto] = useState(false)
  const [eliminando, iniciar] = useTransition()

  function confirmar(evento: MouseEvent<HTMLButtonElement>): void {
    evento.preventDefault()
    iniciar(async () => {
      const resultado = await eliminarElMensaje(id)
      avisarResultado(resultado)
      setAbierto(false)
      if (resultado.ok) alEliminar()
    })
  }

  return (
    <AlertDialog open={abierto} onOpenChange={(abrir) => eliminando || setAbierto(abrir)}>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="border-destructive/40 bg-card text-destructive hover:bg-error-fondo hover:text-destructive"
        >
          <Trash2 aria-hidden="true" />
          Eliminar
        </Button>
      </AlertDialogTrigger>
      <Confirmacion nombre={nombre} eliminando={eliminando} alConfirmar={confirmar} />
    </AlertDialog>
  )
}
