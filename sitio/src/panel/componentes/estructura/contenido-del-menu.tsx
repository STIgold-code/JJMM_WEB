import Image from 'next/image'
import Link from 'next/link'

import type { DatosDelMenu } from '../../dominio/menu-del-panel'
import { RUTA_DEL_INICIO } from '../../dominio/rutas-del-panel'
import { NavegacionDelMenu } from './navegacion-del-menu'
import { UsuarioDelMenu } from './usuario-del-menu'

// Marca arriba, secciones por tarea y la cuenta abajo. Lo usan el menú fijo y el cajón.
export function ContenidoDelMenu({ grupos, usuario }: DatosDelMenu) {
  return (
    <>
      <Link
        href={RUTA_DEL_INICIO}
        className="flex items-center gap-[0.7rem] px-4 pt-4 pb-[0.9rem] text-inherit no-underline"
      >
        {/* La marca no se achica: a menos de este ancho el óvalo deja de leerse. */}
        <Image
          src="/panel/marca-jjmm.png"
          alt=""
          width={216}
          height={73}
          className="h-auto w-15 flex-none"
        />
        <span className="grid min-w-0 leading-[1.15]">
          <span className="font-marca text-[1.0625rem] font-medium tracking-[0.01em] whitespace-nowrap text-primary-hover">
            Estudio Contable JJMM
          </span>
          <small className="text-xs text-sidebar-muted">Panel del sitio web</small>
        </span>
      </Link>
      <NavegacionDelMenu grupos={grupos} />
      <UsuarioDelMenu usuario={usuario} />
    </>
  )
}
