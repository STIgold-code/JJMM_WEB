'use client'

import { cn } from 'cn'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useId } from 'react'

import type { EntradaDelMenu, GrupoDelMenu } from '../../dominio/menu-del-panel'
import { IconoDelPanel } from '../iconos/icono-del-panel'

const ENTRADA =
  'flex min-h-9 items-center gap-[0.65rem] rounded-md px-[0.6rem] py-[0.35rem] text-sm font-medium'

function Contador({ cantidad }: { cantidad: number }) {
  if (cantidad === 0) return null
  return (
    <span className="ml-auto min-w-[1.4rem] rounded-full bg-pendiente-solido px-[0.4rem] text-center text-xs leading-[1.4rem] font-bold text-white">
      {cantidad}
      <span className="sr-only"> sin atender</span>
    </span>
  )
}

// Sección que aún no existe en el panel: visible, pero sin enlace (nada de enlaces rotos).
function EntradaProxima({ entrada }: { entrada: EntradaDelMenu }) {
  return (
    <span aria-disabled="true" className={cn(ENTRADA, 'cursor-not-allowed text-sidebar-muted')}>
      <IconoDelPanel nombre={entrada.icono} />
      <span className="truncate">{entrada.texto}</span>
      <Contador cantidad={entrada.contador} />
      <span className="ml-auto shrink-0 text-[0.6875rem] font-medium">Próximamente</span>
    </span>
  )
}

function Entrada({ entrada, actual }: { entrada: EntradaDelMenu; actual: boolean }) {
  if (entrada.ruta === null) return <EntradaProxima entrada={entrada} />
  return (
    <Link
      href={entrada.ruta}
      aria-current={actual ? 'page' : undefined}
      className={cn(
        ENTRADA,
        'text-sidebar-foreground transition-colors duration-150 hover:bg-primary/7',
        'aria-[current=page]:bg-sidebar-accent aria-[current=page]:font-[650] aria-[current=page]:text-sidebar-accent-foreground',
      )}
    >
      <IconoDelPanel nombre={entrada.icono} className={actual ? undefined : 'text-sidebar-muted'} />
      <span className="truncate">{entrada.texto}</span>
      <Contador cantidad={entrada.contador} />
    </Link>
  )
}

// El menú se dibuja dos veces (fijo en escritorio y en el cajón del celular): `useId` evita
// identificadores repetidos.
export function NavegacionDelMenu({ grupos }: { grupos: GrupoDelMenu[] }) {
  const ruta = usePathname()
  const prefijo = useId()
  return (
    <nav aria-label="Secciones del panel" className="flex-1 overflow-y-auto px-3 pt-1 pb-4">
      {grupos.map((grupo, indice) => (
        <div key={grupo.titulo} className={indice > 0 ? 'mt-[1.1rem]' : undefined}>
          <p
            id={`${prefijo}-${indice}`}
            className="px-[0.6rem] pb-[0.3rem] text-xs font-semibold text-sidebar-muted"
          >
            {grupo.titulo}
          </p>
          <ul
            aria-labelledby={`${prefijo}-${indice}`}
            className="grid grid-cols-[minmax(0,1fr)] gap-px"
          >
            {grupo.entradas.map((entrada) => (
              <li key={entrada.clave}>
                <Entrada entrada={entrada} actual={entrada.ruta === ruta} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
