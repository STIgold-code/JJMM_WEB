'use client'

import { Menu } from 'lucide-react'
import { type MouseEvent, type ReactNode, useEffect, useState } from 'react'

import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '../ui/sheet'

// Mismo corte que `--breakpoint-escritorio` en panel.css.
const ESCRITORIO = '(min-width: 56.3125rem)'

// Menú como cajón por debajo de 900 px. El Sheet (Radix Dialog) atrapa el foco, cierra con
// Escape o tocando fuera y devuelve el foco al botón que lo abrió.
export function CajonDelMenu({ children }: { children: ReactNode }) {
  const [abierto, setAbierto] = useState(false)

  // Si la ventana crece hasta el escritorio, el menú fijo ya está a la vista.
  useEffect(() => {
    const consulta = window.matchMedia(ESCRITORIO)
    const alCambiar = () => {
      if (consulta.matches) setAbierto(false)
    }
    consulta.addEventListener('change', alCambiar)
    return () => consulta.removeEventListener('change', alCambiar)
  }, [])

  // Al elegir una sección, el cajón se cierra.
  const alHacerClic = (evento: MouseEvent) => {
    if (evento.target instanceof Element && evento.target.closest('a[href]')) setAbierto(false)
  }

  return (
    <Sheet open={abierto} onOpenChange={setAbierto}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Abrir el menú"
          className="escritorio:hidden"
        >
          <Menu aria-hidden="true" strokeWidth={1.75} />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        aria-describedby={undefined}
        onClick={alHacerClic}
        className="w-[min(18rem,86vw)] gap-0 border-sidebar-border bg-sidebar text-sidebar-foreground sm:max-w-none"
      >
        <SheetTitle className="sr-only">Menú del panel</SheetTitle>
        {children}
      </SheetContent>
    </Sheet>
  )
}
