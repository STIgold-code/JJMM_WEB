'use client'

import { CircleAlert, LoaderCircle } from 'lucide-react'
import { type RefObject, useActionState, useEffect, useRef } from 'react'

import { ingresarAlPanel } from '../../acciones/ingreso'
import { ESTADO_INICIAL_DEL_INGRESO } from '../../dominio/ingreso'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { CampoDeContrasena } from './campo-de-contrasena'

const ID_DE_ALERTA = 'alerta-ingreso'

function Alerta({ mensaje, ref }: { mensaje: string; ref: RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={ref}
      id={ID_DE_ALERTA}
      role="alert"
      tabIndex={-1}
      className="flex items-start gap-[0.6rem] rounded-md border border-error-borde bg-error-fondo px-[0.9rem] py-3 text-sm font-semibold text-error"
    >
      <CircleAlert
        aria-hidden="true"
        strokeWidth={1.75}
        className="mt-0.5 size-[1.125rem] shrink-0"
      />
      <p>{mensaje}</p>
    </div>
  )
}

export function FormularioDeIngreso() {
  const [estado, ingresar, enviando] = useActionState(ingresarAlPanel, ESTADO_INICIAL_DEL_INGRESO)
  const invalido = estado.error !== null
  const describidoPor = invalido ? ID_DE_ALERTA : undefined
  const alerta = useRef<HTMLDivElement>(null)
  // Tras cada intento fallido (aunque el mensaje se repita) el foco va al aviso, así el lector
  // de pantalla lo lee.
  useEffect(() => alerta.current?.focus(), [estado])
  return (
    <>
      {estado.error && <Alerta mensaje={estado.error} ref={alerta} />}
      <form action={ingresar} noValidate className="grid gap-3">
        <div className="grid gap-[0.4rem]">
          <Label htmlFor="correo" className="font-semibold">
            Correo
          </Label>
          <Input
            id="correo"
            name="correo"
            type="email"
            autoComplete="username"
            placeholder="tu@correo.com"
            required
            defaultValue={estado.correo}
            aria-invalid={invalido || undefined}
            aria-describedby={describidoPor}
            className="h-10 bg-card text-[0.9375rem]"
          />
        </div>
        <CampoDeContrasena invalido={invalido} describidoPor={describidoPor} />
        <Button type="submit" disabled={enviando} className="h-10 w-full font-semibold">
          {enviando && <LoaderCircle aria-hidden="true" className="animate-spin" />}
          {enviando ? 'Ingresando…' : 'Ingresar'}
        </Button>
        <p className="text-[0.8125rem] leading-normal text-muted-foreground">
          ¿Olvidaste tu contraseña? Pídele al administrador del panel que te asigne una nueva.
        </p>
      </form>
    </>
  )
}
