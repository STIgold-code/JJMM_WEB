'use client'

import { Check, Undo2 } from 'lucide-react'
import { useTransition } from 'react'

import { cambiarEstadoDelMensaje } from '../../acciones/mensajes'
import type { EstadoDeMensaje } from '../../dominio/mensajes'
import { Button } from '../ui/button'
import { SheetFooter } from '../ui/sheet'
import { avisarResultado } from './avisos'
import { EliminarMensaje } from './eliminar-mensaje'

interface Props {
  id: number
  nombre: string
  estado: EstadoDeMensaje
  // Lo decide el servidor con el rol de la sesión; la acción de borrar lo vuelve a comprobar.
  puedeEliminar: boolean
  alEliminar: () => void
}

// Pie del panel lateral: marcar como atendido (o volver a «Nuevo») y, solo para el
// administrador, eliminar con confirmación.
export function AccionesDelMensaje({ id, nombre, estado, puedeEliminar, alEliminar }: Props) {
  const [cambiando, iniciar] = useTransition()
  const esNuevo = estado === 'nuevo'

  function cambiarEstado(): void {
    iniciar(async () => {
      avisarResultado(await cambiarEstadoDelMensaje(id, esNuevo ? 'atendido' : 'nuevo'))
    })
  }

  return (
    <SheetFooter className="mt-0 flex-row flex-wrap gap-2 border-t bg-background px-5 py-4">
      <Button
        type="button"
        variant={esNuevo ? 'default' : 'outline'}
        onClick={cambiarEstado}
        disabled={cambiando}
        className={esNuevo ? 'hover:bg-primary-hover' : 'bg-card'}
      >
        {esNuevo ? <Check aria-hidden="true" /> : <Undo2 aria-hidden="true" />}
        {esNuevo ? 'Marcar como atendido' : 'Volver a «Nuevo»'}
      </Button>
      <span className="flex-1" />
      {puedeEliminar && <EliminarMensaje id={id} nombre={nombre} alEliminar={alEliminar} />}
    </SheetFooter>
  )
}
