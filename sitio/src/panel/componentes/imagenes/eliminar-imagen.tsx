'use client'

import { Trash2 } from 'lucide-react'
import { useState, useTransition } from 'react'

import { eliminarLaImagen } from '../../acciones/imagenes'
import { Confirmacion } from '../comunes/confirmacion'
import { avisarResultado } from '../mensajes/avisos'
import { Button } from '../ui/button'

interface Props {
  id: number
  nombre: string
  alEliminar: () => void
}

// «Eliminar» del panel lateral, solo para el administrador y solo si la imagen no se usa (el
// servidor lo vuelve a comprobar). Confirma en un diálogo propio.
export function EliminarImagen({ id, nombre, alEliminar }: Props) {
  const [abierta, setAbierta] = useState(false)
  const [eliminando, iniciar] = useTransition()
  const confirmar = () =>
    iniciar(async () => {
      const resultado = await eliminarLaImagen(id)
      avisarResultado(resultado)
      setAbierta(false)
      if (resultado.ok) alEliminar()
    })
  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setAbierta(true)}
        className="border-destructive/40 bg-card text-destructive hover:bg-error-fondo hover:text-destructive"
      >
        <Trash2 aria-hidden="true" />
        Eliminar
      </Button>
      <Confirmacion
        abierta={abierta}
        titulo={`¿Eliminar «${nombre}»?`}
        texto="Se borran la imagen y su archivo para siempre. No se puede recuperar."
        accion={eliminando ? 'Eliminando…' : 'Eliminar imagen'}
        ocupada={eliminando}
        alConfirmar={confirmar}
        alCerrar={() => setAbierta(false)}
      />
    </>
  )
}
