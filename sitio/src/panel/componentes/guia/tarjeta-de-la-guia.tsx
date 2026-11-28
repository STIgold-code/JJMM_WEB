import type { ReactNode } from 'react'

import type { ParteDeLaGuia } from '../../dominio/guia-de-clientes'

interface Props {
  // También es el ancla de la parte (`/panel/guia#avisos`).
  parte: ParteDeLaGuia
  titulo: string
  descripcion?: string
  accion?: ReactNode
  children: ReactNode
}

// Una parte de «Guía de clientes»: tarjeta con su título, qué muestra y su acción principal
// («Nuevo aviso»…). `scroll-mt` deja el título a la vista bajo la barra superior al entrar por
// el ancla.
export function TarjetaDeLaGuia({ parte, titulo, descripcion, accion, children }: Props) {
  const idDelTitulo = `titulo-${parte}`
  return (
    <section
      id={parte}
      aria-labelledby={idDelTitulo}
      className="scroll-mt-20 rounded-lg border bg-card text-card-foreground shadow-sm"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b px-4 py-[0.85rem]">
        <div className="grid gap-[0.15rem]">
          <h2 id={idDelTitulo} className="text-[0.9375rem] font-[650]">
            {titulo}
          </h2>
          {descripcion && <p className="text-[0.8125rem] text-muted-foreground">{descripcion}</p>}
        </div>
        {accion}
      </div>
      {children}
    </section>
  )
}
