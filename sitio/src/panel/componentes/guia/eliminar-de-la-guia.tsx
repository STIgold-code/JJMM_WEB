'use client'

import { Trash2 } from 'lucide-react'
import { useState, useTransition } from 'react'

import type { ResultadoDeAccionRapida } from '../../aplicacion/resultados-de-escritura'
import { Confirmacion } from '../comunes/confirmacion'
import { avisarResultado } from '../mensajes/avisos'
import { AlertDialogTrigger } from '../ui/alert-dialog'
import { Button } from '../ui/button'

interface Props {
  // «Eliminar aviso», «Eliminar cronograma»…
  accion: string
  titulo: string
  texto: string
  eliminar: () => Promise<ResultadoDeAccionRapida>
  // Tras borrar, el panel lateral se cierra.
  alEliminar: () => void
}

// Botón «Eliminar» del panel lateral, solo para el administrador, con confirmación en un diálogo
// propio. La acción vuelve a comprobar el rol en el servidor.
export function EliminarDeLaGuia({ accion, titulo, texto, eliminar, alEliminar }: Props) {
  const [abierta, setAbierta] = useState(false)
  const [eliminando, iniciar] = useTransition()

  const confirmar = () =>
    iniciar(async () => {
      const resultado = await eliminar()
      avisarResultado(resultado)
      setAbierta(false)
      if (resultado.ok) alEliminar()
    })

  return (
    <Confirmacion
      abierta={abierta}
      titulo={titulo}
      texto={texto}
      accion={eliminando ? 'Eliminando…' : accion}
      ocupada={eliminando}
      alConfirmar={confirmar}
      alCerrar={() => setAbierta(false)}
      disparador={
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setAbierta(true)}
            className="text-destructive hover:bg-error-fondo hover:text-destructive"
          >
            <Trash2 aria-hidden="true" />
            Eliminar
          </Button>
        </AlertDialogTrigger>
      }
    />
  )
}
