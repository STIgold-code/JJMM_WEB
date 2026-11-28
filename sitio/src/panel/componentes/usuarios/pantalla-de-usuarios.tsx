import { Plus } from 'lucide-react'

import type { UsuarioDelPanel } from '../../dominio/usuarios'
import { Button } from '../ui/button'
import { DialogoDeCuenta } from './dialogo-de-cuenta'
import { ListaDeCuentas } from './lista-de-cuentas'

interface Props {
  cuentas: UsuarioDelPanel[]
  idPropio: number
}

function Cabecera() {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="grid gap-1">
        <h1 className="font-marca text-[1.75rem] leading-[1.15] font-medium tracking-[0.005em] text-balance max-sm:text-2xl">
          Usuarios
        </h1>
        <p className="max-w-[60ch] text-muted-foreground">
          Las personas que entran al panel. El administrador ve todo; un editor cambia el contenido,
          pero no crea cuentas, no borra mensajes ni toca el menú ni los datos del estudio.
        </p>
      </div>
      <DialogoDeCuenta
        cuenta={null}
        disparador={
          <Button type="button" className="hover:bg-primary-hover max-sm:w-full">
            <Plus aria-hidden="true" />
            Nueva cuenta
          </Button>
        }
      />
    </div>
  )
}

// Pantalla «Usuarios» (presentación), solo para el administrador: cabecera con «Nueva cuenta» y
// el listado. Las cuentas llegan ya leídas con sus permisos.
export function PantallaDeUsuarios({ cuentas, idPropio }: Props) {
  return (
    <>
      <Cabecera />
      <ListaDeCuentas cuentas={cuentas} idPropio={idPropio} />
    </>
  )
}
