'use client'

import { SEGUNDOS_MAXIMOS, SEGUNDOS_MINIMOS } from '../../dominio/carrusel-de-portadas'
import { MensajeDeError } from '../comunes/mensaje-de-error'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

interface Props {
  valor: string
  error?: string
  alCambiar: (valor: string) => void
}

// «Segundos por portada», en la cabecera de la tarjeta como en la maqueta (de 3 a 30, los
// límites del bloque).
export function SegundosPorPortada({ valor, error, alCambiar }: Props) {
  return (
    <div className="grid justify-items-end gap-1">
      <div className="flex items-center gap-2">
        <Label htmlFor="carrusel-segundos" className="text-sm font-normal">
          Segundos por portada
        </Label>
        <Input
          id="carrusel-segundos"
          type="number"
          inputMode="numeric"
          min={SEGUNDOS_MINIMOS}
          max={SEGUNDOS_MAXIMOS}
          value={valor}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'carrusel-segundos-error' : undefined}
          onChange={(evento) => alCambiar(evento.target.value)}
          className="h-8 w-20 bg-card"
        />
      </div>
      {error && <MensajeDeError id="carrusel-segundos-error" texto={error} />}
    </div>
  )
}
