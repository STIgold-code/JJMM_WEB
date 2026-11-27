'use client'

import { CircleAlert } from 'lucide-react'
import { type ComponentProps, useActionState, useEffect, useRef, useState } from 'react'

import { guardarContactoDelMensaje } from '../../acciones/mensajes'
import {
  ESTADO_INICIAL_DE_CONTACTO,
  type EstadoDeDatosDeContacto,
} from '../../aplicacion/guardar-datos-de-contacto'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { avisarError, avisarExito } from './avisos'

type PropsDeCampo = ComponentProps<typeof Input> & { id: string; etiqueta: string; error?: string }

function Campo({ id, etiqueta, error, ...entrada }: PropsDeCampo) {
  const idDelError = `${id}-error`
  return (
    <div className="grid content-start gap-[0.4rem]">
      <Label htmlFor={id} className="font-semibold">
        {etiqueta}
      </Label>
      <Input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? idDelError : undefined}
        className="bg-card"
        {...entrada}
      />
      {error && (
        <p id={idDelError} className="flex gap-[0.35rem] text-[0.8125rem] font-semibold text-error">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}

interface Props {
  id: number
  celular: string | null
  correo: string | null
}

// Campos controlados: un error no borra lo escrito, y al guardar se muestran normalizados. El
// aviso breve se da en la misma acción, así no depende de que el formulario siga montado.
function useDatosDeContacto({ celular, correo }: Omit<Props, 'id'>) {
  const [valores, setValores] = useState({ celular: celular ?? '', correo: correo ?? '' })
  const formulario = useRef<HTMLFormElement>(null)
  const [estado, guardar, guardando] = useActionState(
    async (previo: EstadoDeDatosDeContacto, datos: FormData) => {
      const resultado = await guardarContactoDelMensaje(previo, datos)
      if (resultado.estado === 'guardado') {
        avisarExito(resultado.aviso)
        setValores({ celular: resultado.datos.celular ?? '', correo: resultado.datos.correo ?? '' })
      }
      if (resultado.estado === 'error') avisarError(resultado.error)
      return resultado
    },
    ESTADO_INICIAL_DE_CONTACTO,
  )

  // Tras un intento inválido, el foco va al primer campo con error.
  useEffect(() => {
    if (estado.estado !== 'invalido') return
    formulario.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }, [estado])

  const errores = estado.estado === 'invalido' ? estado.errores : {}
  return { valores, setValores, formulario, guardar, guardando, errores }
}

type DatosDelHook = ReturnType<typeof useDatosDeContacto>

function CamposDeContacto({
  valores,
  setValores,
  errores,
}: Pick<DatosDelHook, 'valores' | 'setValores' | 'errores'>) {
  return (
    <div className="mb-3 grid gap-3 sm:grid-cols-2">
      <Campo
        id="contacto-celular"
        name="celular"
        etiqueta="Celular"
        inputMode="numeric"
        autoComplete="off"
        placeholder="9XX XXX XXX"
        value={valores.celular}
        onChange={(evento) => setValores({ ...valores, celular: evento.target.value })}
        error={errores.celular}
      />
      <Campo
        id="contacto-correo"
        name="correo"
        etiqueta="Correo"
        type="email"
        autoComplete="off"
        placeholder="nombre@correo.com"
        value={valores.correo}
        onChange={(evento) => setValores({ ...valores, correo: evento.target.value })}
        error={errores.correo}
      />
    </div>
  )
}

// Celular y correo que el equipo anota al responder.
export function FormularioDeContacto({ id, celular, correo }: Props) {
  const { formulario, guardar, guardando, ...campos } = useDatosDeContacto({ celular, correo })
  return (
    <form ref={formulario} action={guardar} noValidate aria-labelledby="titulo-datos-de-contacto">
      <h3 id="titulo-datos-de-contacto" className="text-sm font-[650]">
        Datos de contacto
      </h3>
      <p className="mb-2 text-[0.8125rem] text-muted-foreground">
        Solo los ve el equipo. Anótalos al responder.
      </p>
      <input type="hidden" name="id" value={id} />
      <CamposDeContacto {...campos} />
      <Button type="submit" variant="outline" size="sm" disabled={guardando} className="bg-card">
        {guardando ? 'Guardando…' : 'Guardar datos de contacto'}
      </Button>
    </form>
  )
}
