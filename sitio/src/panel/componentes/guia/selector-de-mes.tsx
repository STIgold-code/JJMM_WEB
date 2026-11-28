'use client'

import { Label } from '../ui/label'
import { MensajeDeError } from '../comunes/mensaje-de-error'

interface Props {
  // «1» a «12», o vacío si no se eligió.
  valor: string
  meses: readonly string[]
  error?: string
  alCambiar: (mes: string) => void
}

// Mes del periodo con el `select` nativo del navegador, con el dibujo de los campos del panel.
export function SelectorDeMes({ valor, meses, error, alCambiar }: Props) {
  return (
    <div className="grid gap-[0.4rem]">
      <Label htmlFor="cronograma-mes" className="font-semibold">
        Mes del periodo
      </Label>
      <select
        id="cronograma-mes"
        required
        value={valor}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? 'cronograma-mes-error' : undefined}
        onChange={(evento) => alCambiar(evento.target.value)}
        className="h-9 w-full min-w-0 rounded-md border border-input bg-card px-3 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive md:text-sm"
      >
        <option value="" disabled>
          Elige el mes
        </option>
        {meses.map((nombre, indice) => (
          <option key={nombre} value={String(indice + 1)}>
            {nombre}
          </option>
        ))}
      </select>
      {error && <MensajeDeError id="cronograma-mes-error" texto={error} />}
    </div>
  )
}
