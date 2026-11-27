import type { ReactNode } from 'react'

import type { DatosDelMenu } from '../../dominio/menu-del-panel'
import { CajonDelMenu } from './cajon-del-menu'
import { ContenidoDelMenu } from './contenido-del-menu'
import { RutaDeLaPagina } from './ruta-de-la-pagina'

// Estructura del panel: menú lateral fijo en escritorio (cajón en celulares), barra superior
// con la ruta y el contenido. Sin buscador global en la barra (aprobación de la maqueta, L4).
export function EstructuraDelPanel({ children, ...menu }: DatosDelMenu & { children: ReactNode }) {
  return (
    <div className="grid min-h-screen escritorio:grid-cols-[var(--ancho-menu)_minmax(0,1fr)]">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-2 focus:shadow-md"
      >
        Ir al contenido
      </a>
      <aside
        aria-label="Menú del panel"
        className="sticky top-0 hidden h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground escritorio:flex"
      >
        <ContenidoDelMenu {...menu} />
      </aside>
      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 flex h-(--alto-barra) items-center gap-2 border-b bg-background/92 px-4 backdrop-blur-sm backdrop-saturate-150 escritorio:gap-4 escritorio:px-8">
          <CajonDelMenu>
            <ContenidoDelMenu {...menu} />
          </CajonDelMenu>
          <RutaDeLaPagina />
        </header>
        <main
          id="contenido"
          tabIndex={-1}
          className="w-full max-w-[76rem] px-4 pt-5 pb-24 outline-none escritorio:px-8 escritorio:pt-7"
        >
          {children}
        </main>
      </div>
    </div>
  )
}
