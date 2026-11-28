'use client'

import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react'

import type { CelularDelFormulario } from '../../dominio/formulario-de-sede'
import { Campo } from '../comunes/campo'
import { Interruptor } from '../comunes/interruptor'
import { Button } from '../ui/button'
import type { CambioDeCelular } from './cambios-del-formulario'

interface Props {
  celular: CelularDelFormulario
  indice: number
  total: number
  error?: string
  alCambiar: (cambio: CambioDeCelular) => void
  alMover: (hacia: number) => void
  alQuitar: () => void
}

export const idDelCelular = (clave: number) => `sede-celular-${clave}`

function Acciones({ indice, total, alMover, alQuitar }: Omit<Props, 'celular' | 'alCambiar'>) {
  const n = indice + 1
  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={indice === 0}
        aria-label={`Subir el celular ${n}`}
        onClick={() => alMover(indice - 1)}
      >
        <ArrowUp aria-hidden="true" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={indice === total - 1}
        aria-label={`Bajar el celular ${n}`}
        onClick={() => alMover(indice + 1)}
      >
        <ArrowDown aria-hidden="true" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={total === 1}
        title={total === 1 ? 'Cada sede necesita al menos un celular' : undefined}
        aria-label={`Quitar el celular ${n}`}
        onClick={alQuitar}
      >
        <Trash2 aria-hidden="true" />
      </Button>
    </div>
  )
}

// Una fila de «Celulares»: el número, si atiende por WhatsApp, su orden y quitarla.
export function FilaDeCelular(props: Props) {
  const { celular, indice, error, alCambiar } = props
  const n = indice + 1
  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b px-4 py-3 last:border-b-0">
      <Campo
        id={idDelCelular(celular.clave)}
        etiqueta={`Celular ${n}`}
        className="grid min-w-[12rem] flex-1 gap-[0.4rem]"
        error={error}
        required
        inputMode="tel"
        placeholder="9XX XXX XXX"
        value={celular.numero}
        onChange={(evento) => alCambiar({ numero: evento.target.value })}
      />
      <div className="flex min-h-9 items-center gap-2">
        <Interruptor
          activo={celular.tieneWhatsApp}
          alCambiar={(tieneWhatsApp) => alCambiar({ tieneWhatsApp })}
          aria-label={`Celular ${n} atiende por WhatsApp`}
        />
        <span aria-hidden="true" className="text-sm">
          Atiende por WhatsApp
        </span>
      </div>
      <Acciones {...props} />
    </li>
  )
}
