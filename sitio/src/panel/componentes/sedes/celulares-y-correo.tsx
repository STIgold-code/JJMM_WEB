'use client'

import { Plus } from 'lucide-react'
import { useEffect, useRef } from 'react'

import type { FormularioDeSede } from '../../dominio/formulario-de-sede'
import { type ErroresDeSede, MAXIMO_DE_CELULARES } from '../../dominio/validacion-de-sede'
import { Campo } from '../comunes/campo'
import { MensajeDeError } from '../comunes/mensaje-de-error'
import { TarjetaDelPanel } from '../inicio/tarjeta-del-panel'
import { Button } from '../ui/button'
import type { CambiosDelFormulario } from './cambios-del-formulario'
import { FilaDeCelular, idDelCelular } from './fila-de-celular'

interface Props {
  formulario: FormularioDeSede
  errores: ErroresDeSede
  cambios: CambiosDelFormulario
}

const ID_DE_AGREGAR = 'sede-agregar-celular'

// Tras agregar una fila, el foco va a su campo; tras quitar una, a «Agregar celular» (la fila con
// el foco ya no existe).
function useFocoDeLaLista(claves: readonly number[]) {
  const anteriores = useRef(claves)
  useEffect(() => {
    const previas = anteriores.current
    anteriores.current = claves
    const nueva = claves.find((clave) => !previas.includes(clave))
    if (claves.length > previas.length && nueva !== undefined)
      document.getElementById(idDelCelular(nueva))?.focus()
    else if (claves.length < previas.length) document.getElementById(ID_DE_AGREGAR)?.focus()
  }, [claves])
}

function ListaDeCelulares({ formulario, errores, cambios }: Props) {
  const { celulares } = formulario
  return (
    <ul aria-label="Celulares de la sede" className="rounded-md border">
      {celulares.map((celular, indice) => (
        <FilaDeCelular
          key={celular.clave}
          celular={celular}
          indice={indice}
          total={celulares.length}
          error={errores.celular?.[indice]}
          alCambiar={(cambio) => cambios.cambiarCelular(celular.clave, indice, cambio)}
          alMover={(hacia) => cambios.moverCelular(indice, hacia)}
          alQuitar={() => cambios.quitarCelular(celular.clave)}
        />
      ))}
    </ul>
  )
}

function AgregarCelular({ lleno, alPulsar }: { lleno: boolean; alPulsar: () => void }) {
  return (
    <div>
      <Button
        id={ID_DE_AGREGAR}
        type="button"
        variant="outline"
        size="sm"
        disabled={lleno}
        onClick={alPulsar}
        className="bg-card"
      >
        <Plus aria-hidden="true" />
        Agregar celular
      </Button>
    </div>
  )
}

// «Celulares y correo»: solo celulares (S9), cada uno con su «Atiende por WhatsApp». El sitio usa
// el primero que atiende por WhatsApp para ese botón y el primero de los otros para «Llamar».
export function CelularesYCorreo(props: Props) {
  const { formulario, errores, cambios } = props
  const claves = formulario.celulares.map((c) => c.clave)
  useFocoDeLaLista(claves)
  return (
    <TarjetaDelPanel
      idDelTitulo="titulo-contacto"
      titulo="Celulares y correo"
      bajada="Solo celulares de 9 dígitos; el sitio no publica teléfonos fijos."
    >
      <div className="grid gap-4 px-5 py-5">
        <ListaDeCelulares {...props} />
        {errores.celulares && (
          <MensajeDeError id="sede-celulares-error" texto={errores.celulares} />
        )}
        <AgregarCelular
          lleno={formulario.celulares.length >= MAXIMO_DE_CELULARES}
          alPulsar={cambios.agregarCelular}
        />
        <Campo
          id="sede-correo"
          etiqueta="Correo"
          ayuda="Opcional. Se muestra en el pie del sitio, debajo de los celulares."
          error={errores.correo}
          type="email"
          inputMode="email"
          value={formulario.correo}
          onChange={(evento) => cambios.cambiarTexto('correo', evento.target.value)}
        />
      </div>
    </TarjetaDelPanel>
  )
}
