'use client'

import { Search } from 'lucide-react'

import { Input } from '../ui/input'

interface Props {
  id: string
  // Nombre accesible del campo («Buscar cuentas»).
  etiqueta: string
  placeholder: string
  valor: string
  alCambiar: (valor: string) => void
}

// Buscador de un listado que se filtra en el navegador (pocas filas): lupa, campo `search` y
// etiqueta solo para lectores de pantalla.
export function Buscador({ id, etiqueta, placeholder, valor, alCambiar }: Props) {
  return (
    <div role="search" className="relative flex-[1_1_14rem] sm:ml-auto sm:max-w-80">
      <label htmlFor={id} className="sr-only">
        {etiqueta}
      </label>
      <Search
        aria-hidden="true"
        strokeWidth={1.75}
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        id={id}
        type="search"
        value={valor}
        onChange={(evento) => alCambiar(evento.target.value)}
        maxLength={100}
        placeholder={placeholder}
        className="h-9 bg-card pl-9 text-sm"
      />
    </div>
  )
}
