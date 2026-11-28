import { LogOut } from 'lucide-react'
import Link from 'next/link'

import { salirDelPanel } from '../../acciones/salida'
import type { UsuarioVisible } from '../../dominio/menu-del-panel'
import { RUTA_DE_MI_CUENTA } from '../../dominio/usuarios'
import { Button } from '../ui/button'

// La cuenta abajo del menú: su nombre lleva a «Mi cuenta».
export function UsuarioDelMenu({ usuario }: { usuario: UsuarioVisible }) {
  return (
    <div className="mx-3 mb-3 flex items-center gap-[0.65rem] rounded-lg border border-sidebar-border bg-card p-[0.6rem]">
      <span
        aria-hidden="true"
        className="grid size-8 flex-none place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
      >
        {usuario.iniciales}
      </span>
      <span className="grid min-w-0 leading-[1.3]">
        <Link
          href={RUTA_DE_MI_CUENTA}
          className="truncate text-[0.8125rem] font-[650] text-foreground no-underline hover:underline"
        >
          {usuario.nombre}
        </Link>
        <span className="text-xs text-muted-foreground">{usuario.rol}</span>
      </span>
      <form action={salirDelPanel} className="ml-auto">
        <Button
          type="submit"
          variant="ghost"
          size="icon-sm"
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
        >
          <LogOut aria-hidden="true" strokeWidth={1.75} />
        </Button>
      </form>
    </div>
  )
}
