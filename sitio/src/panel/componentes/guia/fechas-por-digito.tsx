'use client'

import { DIGITOS_DEL_RUC } from '../../dominio/cronogramas-del-panel'
import { Campo } from '../comunes/campo'

interface Props {
  fechas: string[]
  errores?: Record<number, string>
  alCambiar: (fechas: string[]) => void
}

// Las diez fechas del cronograma, una por último dígito del RUC, con el selector de fecha del
// navegador (AAAA-MM-DD, sin hora ni zona). La rejilla pone tantas columnas como quepan con un
// mínimo legible: dos en un celular de 390 px y en el panel lateral del escritorio.
export function FechasPorDigito({ fechas, errores, alCambiar }: Props) {
  const cambiar = (digito: number, fecha: string) =>
    alCambiar(fechas.map((actual, indice) => (indice === digito ? fecha : actual)))
  return (
    <fieldset className="grid gap-3">
      <legend className="mb-1 text-sm font-semibold">
        Vence el, según el último dígito del RUC
      </legend>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,9.5rem),1fr))] gap-3">
        {DIGITOS_DEL_RUC.map((digito) => (
          <Campo
            key={digito}
            id={`cronograma-digito-${digito}`}
            etiqueta={`Dígito ${digito}`}
            type="date"
            required
            min="2020-01-01"
            max="2101-12-31"
            value={fechas[digito] ?? ''}
            error={errores?.[digito]}
            onChange={(evento) => cambiar(digito, evento.target.value)}
          />
        ))}
      </div>
    </fieldset>
  )
}
