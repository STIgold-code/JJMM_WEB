'use client'

import { Trash2 } from 'lucide-react'
import { useState, useTransition } from 'react'

import { eliminarElUsuario } from '../../acciones/usuarios'
import { nombreVisible, type UsuarioDelPanel } from '../../dominio/usuarios'
import { Confirmacion } from '../comunes/confirmacion'
import { avisarResultado } from '../mensajes/avisos'
import { AlertDialogTrigger } from '../ui/alert-dialog'
import { Button } from '../ui/button'

// «Eliminar cuenta» con confirmación en un diálogo propio. El servidor vuelve a comprobar que no
// sea la cuenta propia ni la del último administrador.
export function EliminarCuenta({ cuenta }: { cuenta: UsuarioDelPanel }) {
  const [abierta, setAbierta] = useState(false)
  const [eliminando, iniciar] = useTransition()
  const nombre = nombreVisible(cuenta)

  const confirmar = () =>
    iniciar(async () => {
      avisarResultado(await eliminarElUsuario(cuenta.id))
      setAbierta(false)
    })

  return (
    <Confirmacion
      abierta={abierta}
      titulo={`¿Eliminar la cuenta de ${nombre}?`}
      texto="La persona ya no podrá entrar al panel. Lo que publicó se conserva."
      accion={eliminando ? 'Eliminando…' : 'Eliminar cuenta'}
      ocupada={eliminando}
      alConfirmar={confirmar}
      alCerrar={() => setAbierta(false)}
      disparador={
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Eliminar la cuenta de ${nombre}`}
            onClick={() => setAbierta(true)}
            className="text-muted-foreground hover:bg-error-fondo hover:text-destructive"
          >
            <Trash2 aria-hidden="true" />
          </Button>
        </AlertDialogTrigger>
      }
    />
  )
}
