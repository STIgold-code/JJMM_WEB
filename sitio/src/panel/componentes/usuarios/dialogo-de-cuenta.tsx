'use client'

import { type ReactNode, useState } from 'react'

import { nombreVisible, type UsuarioDelPanel } from '../../dominio/usuarios'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { CamposDeCuenta } from './campos-de-cuenta'
import { useFormularioDeCuenta } from './use-formulario-de-cuenta'

interface PropsDelFormulario {
  // Nula: «Nueva cuenta».
  cuenta: UsuarioDelPanel | null
  alTerminar: () => void
}

function Cabecera({ cuenta }: { cuenta: UsuarioDelPanel | null }) {
  return (
    <DialogHeader>
      <DialogTitle>
        {cuenta ? `Editar la cuenta de ${nombreVisible(cuenta)}` : 'Nueva cuenta'}
      </DialogTitle>
      <DialogDescription>
        {cuenta
          ? 'Los cambios valen desde su próximo clic en el panel.'
          : 'La persona entra al panel con este correo y la contraseña temporal.'}
      </DialogDescription>
    </DialogHeader>
  )
}

// El formulario vive dentro del contenido del diálogo: al cerrarlo se desmonta y la próxima vez
// empieza de nuevo (sin contraseñas escritas de antes).
function Formulario({ cuenta, alTerminar }: PropsDelFormulario) {
  const edicion = useFormularioDeCuenta(cuenta, alTerminar)
  const { guardando } = edicion
  const textoDeGuardar = cuenta ? 'Guardar cambios' : 'Crear cuenta'
  return (
    <form
      noValidate
      className="grid gap-4"
      onSubmit={(evento) => {
        evento.preventDefault()
        edicion.guardar()
      }}
    >
      <Cabecera cuenta={cuenta} />
      <CamposDeCuenta
        formulario={edicion.formulario}
        errores={edicion.errores}
        nueva={cuenta === null}
        cambiar={edicion.cambiar}
      />
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={guardando} className="bg-card">
            Cancelar
          </Button>
        </DialogClose>
        <Button
          type="submit"
          disabled={!edicion.sucio || guardando}
          className="hover:bg-primary-hover"
        >
          {guardando ? 'Guardando…' : textoDeGuardar}
        </Button>
      </DialogFooter>
    </form>
  )
}

// Diálogo para crear una cuenta o editar la de otra persona. El foco vuelve al botón que lo abrió.
export function DialogoDeCuenta({
  cuenta,
  disparador,
}: Pick<PropsDelFormulario, 'cuenta'> & { disparador: ReactNode }) {
  const [abierto, setAbierto] = useState(false)
  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger asChild>{disparador}</DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto bg-card">
        <Formulario cuenta={cuenta} alTerminar={() => setAbierto(false)} />
      </DialogContent>
    </Dialog>
  )
}
