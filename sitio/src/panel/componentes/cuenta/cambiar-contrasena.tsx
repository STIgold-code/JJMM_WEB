'use client'

import { Check } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { requisitoDeLargo } from '../../dominio/contrasenas'
import type { ErroresDeClave } from '../../dominio/validacion-de-mi-cuenta'
import { CampoDeClave } from '../comunes/campo-de-clave'
import { TarjetaDelPanel } from '../inicio/tarjeta-del-panel'
import { Button } from '../ui/button'
import { type Claves, useCambioDeClave } from './use-cambio-de-clave'

// Ayuda en vivo bajo la contraseña nueva: cuánto falta para los 10 caracteres.
function Requisito({ largo }: { largo: number }) {
  const { cumple, texto } = requisitoDeLargo(largo)
  return (
    <span className={`inline-flex items-center gap-1 ${cumple ? 'text-listo' : ''}`}>
      {cumple && <Check aria-hidden="true" className="size-3.5" />}
      {texto}
    </span>
  )
}

interface PropsDeCampos {
  claves: Claves
  errores: ErroresDeClave
  cambiar: (campo: keyof Claves, valor: string) => void
}

function CamposDeClaves({ claves, errores, cambiar }: PropsDeCampos) {
  return (
    <>
      <CampoDeClave
        id="clave-actual"
        etiqueta="Contraseña actual"
        autoComplete="current-password"
        valor={claves.actual}
        alCambiar={(valor) => cambiar('actual', valor)}
        error={errores.actual}
      />
      <CampoDeClave
        id="clave-nueva"
        etiqueta="Contraseña nueva"
        autoComplete="new-password"
        valor={claves.nueva}
        alCambiar={(valor) => cambiar('nueva', valor)}
        ayuda={<Requisito largo={claves.nueva.length} />}
        error={errores.nueva}
      />
      <CampoDeClave
        id="clave-repetida"
        etiqueta="Repite la contraseña nueva"
        autoComplete="new-password"
        valor={claves.repetida}
        alCambiar={(valor) => cambiar('repetida', valor)}
        error={errores.repetida}
      />
    </>
  )
}

// «Cambiar contraseña»: la actual (la verifica el servidor con el ingreso de Payload) y la nueva
// dos veces. Al volver con errores, el foco va al primer campo con error.
export function CambiarContrasena({ correo }: { correo: string }) {
  const { claves, errores, cambiando, cambiar, enviar } = useCambioDeClave()
  const formulario = useRef<HTMLFormElement>(null)

  useEffect(() => {
    formulario.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }, [errores])

  return (
    <form
      ref={formulario}
      noValidate
      onSubmit={(evento) => {
        evento.preventDefault()
        enviar()
      }}
    >
      <TarjetaDelPanel
        idDelTitulo="titulo-contrasena"
        titulo="Cambiar contraseña"
        bajada="Usa una que no uses en otros sitios. Al cambiarla se cierran tus sesiones en otros equipos."
      >
        <div className="grid gap-4 px-5 py-5">
          {/* Para que el gestor de contraseñas sepa de qué cuenta es la contraseña nueva. */}
          <input type="email" autoComplete="username" value={correo} readOnly hidden />
          <CamposDeClaves claves={claves} errores={errores} cambiar={cambiar} />
          <div>
            <Button
              type="submit"
              disabled={cambiando}
              className="hover:bg-primary-hover max-sm:w-full"
            >
              {cambiando ? 'Cambiando…' : 'Cambiar contraseña'}
            </Button>
          </div>
        </div>
      </TarjetaDelPanel>
    </form>
  )
}
