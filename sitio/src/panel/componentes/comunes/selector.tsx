'use client'

import { ChevronDown } from 'lucide-react'

import { Label } from '../ui/label'
import { CLASE_DE_AYUDA } from './campo'
import { MensajeDeError } from './mensaje-de-error'

interface Props<V extends string> {
  id: string
  etiqueta: string
  valor: V
  opciones: readonly { valor: V; texto: string }[]
  alCambiar: (valor: V) => void
  ayuda?: string
  error?: string
}

const CLASE_DE_LA_LISTA =
  'h-9 w-full min-w-0 appearance-none rounded-md border border-input bg-card px-3 pr-9 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive md:text-sm'

function Lista<V extends string>(props: Props<V> & { describe: string }) {
  const { id, valor, opciones, alCambiar, error, describe } = props
  return (
    <div className="relative">
      <select
        id={id}
        value={valor}
        aria-invalid={error ? true : undefined}
        aria-describedby={describe || undefined}
        onChange={(evento) => {
          const elegido = opciones.find((o) => o.valor === evento.target.value)
          if (elegido) alCambiar(elegido.valor)
        }}
        className={CLASE_DE_LA_LISTA}
      >
        {opciones.map((opcion) => (
          <option key={opcion.valor} value={opcion.valor}>
            {opcion.texto}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  )
}

// Lista desplegable nativa de un formulario del panel, con el dibujo de `Input`: etiqueta, ayuda
// y error enlazados con `aria-describedby`. Solo acepta un valor de `opciones`.
export function Selector<V extends string>(props: Props<V>) {
  const { id, etiqueta, ayuda, error } = props
  const describe = [ayuda && `${id}-ayuda`, error && `${id}-error`].filter(Boolean).join(' ')
  return (
    <div className="grid gap-[0.4rem]">
      <Label htmlFor={id} className="font-semibold">
        {etiqueta}
      </Label>
      <Lista {...props} describe={describe} />
      {ayuda && (
        <p id={`${id}-ayuda`} className={CLASE_DE_AYUDA}>
          {ayuda}
        </p>
      )}
      {error && <MensajeDeError id={`${id}-error`} texto={error} />}
    </div>
  )
}
