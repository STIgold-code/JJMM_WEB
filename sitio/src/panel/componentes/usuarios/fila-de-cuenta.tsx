'use client'

import Link from 'next/link'

import { iniciales, nombreDelRol } from '../../dominio/menu-del-panel'
import { nombreVisible, RUTA_DE_MI_CUENTA, type UsuarioDelPanel } from '../../dominio/usuarios'
import { CELDA_DE_LISTADO as CELDA, FILA_DE_LISTADO } from '../comunes/controles-de-orden'
import { Button } from '../ui/button'
import { DialogoDeCuenta } from './dialogo-de-cuenta'
import { EliminarCuenta } from './eliminar-cuenta'
import { InsigniaDeRol } from './insignia-de-rol'

interface Props {
  cuenta: UsuarioDelPanel
  propia: boolean
}

function CeldaDeLaPersona({ cuenta, propia }: Props) {
  return (
    <td className={`${CELDA} max-sm:col-start-1`}>
      <div className="flex min-w-0 items-center gap-3">
        <span
          aria-hidden="true"
          className="grid size-8 flex-none place-items-center rounded-full bg-accent text-xs font-bold text-accent-foreground"
        >
          {iniciales(cuenta.nombre, cuenta.correo)}
        </span>
        <div className="grid min-w-0 leading-[1.35]">
          <strong className="truncate font-[650]">{nombreVisible(cuenta)}</strong>
          <span className="truncate text-[0.8125rem] text-muted-foreground">
            {cuenta.correo}
            {propia && ' · tú'}
          </span>
        </div>
      </div>
    </td>
  )
}

// La cuenta propia no se edita ni se elimina aquí: se cambia en «Mi cuenta».
function Acciones({ cuenta, propia }: Props) {
  if (propia)
    return (
      <Link
        href={RUTA_DE_MI_CUENTA}
        className="text-[0.8125rem] font-semibold text-muted-foreground hover:text-primary hover:underline"
      >
        Tu cuenta
      </Link>
    )
  const nombre = nombreVisible(cuenta)
  return (
    <div className="flex items-center justify-end gap-1 max-sm:justify-start">
      <DialogoDeCuenta
        cuenta={cuenta}
        disparador={
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label={`Editar la cuenta de ${nombre}`}
            className="bg-card"
          >
            Editar
          </Button>
        }
      />
      <EliminarCuenta cuenta={cuenta} />
    </div>
  )
}

// Fila del listado de cuentas. En celulares se apila: persona y rol arriba; acciones debajo.
export function FilaDeCuenta({ cuenta, propia }: Props) {
  return (
    <tr className={FILA_DE_LISTADO}>
      <CeldaDeLaPersona cuenta={cuenta} propia={propia} />
      <td
        className={`${CELDA} max-sm:col-start-2 max-sm:row-start-1 max-sm:self-center max-sm:justify-self-end`}
      >
        <InsigniaDeRol rol={nombreDelRol(cuenta.rol)} />
      </td>
      <td className={`${CELDA} text-right max-sm:col-span-full max-sm:text-left`}>
        <Acciones cuenta={cuenta} propia={propia} />
      </td>
    </tr>
  )
}
