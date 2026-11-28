'use client'

import type { ComponentProps } from 'react'

import type { FormularioDePlan } from '../../dominio/formulario-de-plan'
import { TarjetaDelPanel } from '../inicio/tarjeta-del-panel'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Interruptor } from './interruptor'
import { MensajeDeError } from './mensaje-de-error'

const AYUDA = 'text-[0.8125rem] text-muted-foreground'

type PropsDeCampo = ComponentProps<typeof Input> & {
  id: string
  etiqueta: string
  ayuda: string
  error?: string
}

function Campo({ id, etiqueta, ayuda, error, ...entrada }: PropsDeCampo) {
  const describe = [`${id}-ayuda`, error && `${id}-error`].filter(Boolean).join(' ')
  return (
    <div className="grid gap-[0.4rem]">
      <Label htmlFor={id} className="font-semibold">
        {etiqueta}
      </Label>
      <Input
        id={id}
        autoComplete="off"
        aria-invalid={error ? true : undefined}
        aria-describedby={describe}
        className="bg-card"
        {...entrada}
      />
      <p id={`${id}-ayuda`} className={AYUDA}>
        {ayuda}
      </p>
      {error && <MensajeDeError id={`${id}-error`} texto={error} />}
    </div>
  )
}

function FilaVisible({
  visible,
  alCambiar,
}: {
  visible: boolean
  alCambiar: (v: boolean) => void
}) {
  return (
    <div className="flex items-start gap-3">
      <Interruptor
        activo={visible}
        alCambiar={alCambiar}
        aria-labelledby="plan-visible-etiqueta"
        aria-describedby="plan-visible-ayuda"
        className="mt-[0.15rem]"
      />
      <div>
        <p id="plan-visible-etiqueta" className="text-sm font-semibold">
          Visible en el sitio
        </p>
        <p id="plan-visible-ayuda" className={AYUDA}>
          Si lo apagas, la columna deja de mostrarse sin borrar el plan.
        </p>
      </div>
    </div>
  )
}

interface Props {
  formulario: FormularioDePlan
  errorDelNombre?: string
  alCambiar: (cambio: Partial<Omit<FormularioDePlan, 'celdas'>>) => void
}

// «Datos del plan»: solo los campos que usa el sitio. «Descripción» y «Destacado» existen en la
// colección pero el sitio no los muestra, así que no se piden aquí.
export function DatosDelPlan({ formulario, errorDelNombre, alCambiar }: Props) {
  return (
    <TarjetaDelPanel idDelTitulo="titulo-datos" titulo="Datos del plan">
      <div className="grid gap-4 px-5 py-5">
        <Campo
          id="plan-nombre"
          etiqueta="Nombre"
          ayuda="Encabeza la columna en la tabla del sitio."
          error={errorDelNombre}
          required
          value={formulario.nombre}
          onChange={(evento) => alCambiar({ nombre: evento.target.value })}
        />
        <Campo
          id="plan-mensaje"
          etiqueta="Mensaje de WhatsApp al pulsar «Solicitar»"
          ayuda="Es el texto que aparece listo para enviar por WhatsApp al estudio."
          placeholder="Hola, quiero información del plan…"
          value={formulario.mensajeDeConsulta}
          onChange={(evento) => alCambiar({ mensajeDeConsulta: evento.target.value })}
        />
        <FilaVisible visible={formulario.visible} alCambiar={(visible) => alCambiar({ visible })} />
      </div>
    </TarjetaDelPanel>
  )
}
