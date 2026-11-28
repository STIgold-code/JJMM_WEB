'use client'

import type { ReactNode } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog'

interface Props {
  abierta: boolean
  titulo: string
  texto: string
  accion: string
  cancelar?: string
  ocupada?: boolean
  destructiva?: boolean
  alConfirmar: () => void
  alCerrar: () => void
  disparador?: ReactNode
}

// Confirmación en un diálogo propio (AlertDialog), nunca `window.confirm`. El foco empieza en
// «Cancelar»; mientras `ocupada`, el diálogo no se cierra.
export function Confirmacion(props: Props) {
  const { abierta, titulo, texto, accion, ocupada = false, destructiva = true } = props
  return (
    <AlertDialog open={abierta} onOpenChange={(abrir) => !abrir && !ocupada && props.alCerrar()}>
      {props.disparador}
      <AlertDialogContent className="bg-card">
        <AlertDialogHeader>
          <AlertDialogTitle>{titulo}</AlertDialogTitle>
          <AlertDialogDescription>{texto}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={ocupada}>{props.cancelar ?? 'Cancelar'}</AlertDialogCancel>
          <AlertDialogAction
            variant={destructiva ? 'destructive' : 'default'}
            disabled={ocupada}
            onClick={(evento) => {
              evento.preventDefault()
              props.alConfirmar()
            }}
          >
            {accion}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
