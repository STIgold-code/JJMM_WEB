'use client'

import { Plus, Trash2 } from 'lucide-react'

import type { PuntoDelFormulario } from '../../dominio/formulario-de-area'
import { MAXIMO_DE_PUNTOS } from '../../dominio/validacion-de-area'
import { Campo } from '../comunes/campo'
import { BotonesDeOrden } from '../comunes/controles-de-orden'
import { MensajeDeError } from '../comunes/mensaje-de-error'
import { useFocoDeListaEditable } from '../comunes/use-foco-de-lista-editable'
import { TarjetaDelPanel } from '../inicio/tarjeta-del-panel'
import { Button } from '../ui/button'
import type { PropsDeSeccionDelArea } from './datos-del-area'

const ID_DE_AGREGAR = 'area-agregar-punto'
const idDelPunto = (clave: number) => `area-punto-${clave}`

interface PropsDeFila extends Pick<PropsDeSeccionDelArea, 'cambios'> {
  punto: PuntoDelFormulario
  indice: number
  total: number
  error?: string
}

function Acciones({ punto, indice, total, cambios }: PropsDeFila) {
  return (
    <div className="flex items-center gap-1 max-sm:w-full max-sm:justify-end">
      <BotonesDeOrden
        nombre={`el punto ${indice + 1}`}
        indice={indice}
        total={total}
        alMover={cambios.moverPunto}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`Quitar el punto ${indice + 1}`}
        onClick={() => cambios.quitarPunto(punto.clave)}
      >
        <Trash2 aria-hidden="true" />
      </Button>
    </div>
  )
}

function FilaDePunto(props: PropsDeFila) {
  const { punto, indice, error, cambios } = props
  return (
    <li
      data-fila={punto.clave}
      className="flex flex-wrap items-start gap-x-3 gap-y-2 border-b px-4 py-3 last:border-b-0"
    >
      <span className="mt-2 grid size-6 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
        {indice + 1}
      </span>
      <Campo
        id={idDelPunto(punto.clave)}
        etiqueta={`Punto ${indice + 1}`}
        className="grid min-w-0 flex-1 basis-48 gap-[0.4rem] [&>label]:sr-only"
        required
        maxLength={200}
        error={error}
        value={punto.texto}
        onChange={(evento) => cambios.cambiarPunto(punto.clave, indice, evento.target.value)}
      />
      <Acciones {...props} />
    </li>
  )
}

function AgregarPunto({ lleno, alPulsar }: { lleno: boolean; alPulsar: () => void }) {
  return (
    <Button
      id={ID_DE_AGREGAR}
      type="button"
      variant="outline"
      size="sm"
      className="bg-card"
      disabled={lleno}
      onClick={alPulsar}
    >
      <Plus aria-hidden="true" />
      Agregar punto
    </Button>
  )
}

function Lista({ formulario, errores, cambios }: PropsDeSeccionDelArea) {
  const { puntos } = formulario
  if (puntos.length === 0)
    return (
      <p className="px-5 py-5 text-sm text-muted-foreground">
        Sin puntos: la pestaña muestra solo la descripción.
      </p>
    )
  return (
    <ol aria-labelledby="titulo-puntos">
      {puntos.map((punto, indice) => (
        <FilaDePunto
          key={punto.clave}
          punto={punto}
          indice={indice}
          total={puntos.length}
          error={errores.punto?.[indice]}
          cambios={cambios}
        />
      ))}
    </ol>
  )
}

// «Qué incluye»: la lista con vistos de la pestaña, en este orden (agregar, subir, bajar, quitar).
export function PuntosDelArea(props: PropsDeSeccionDelArea) {
  const { formulario, errores, cambios } = props
  useFocoDeListaEditable(
    formulario.puntos.map((p) => p.clave),
    idDelPunto,
    ID_DE_AGREGAR,
  )
  return (
    <TarjetaDelPanel
      idDelTitulo="titulo-puntos"
      titulo="Qué incluye"
      bajada="La lista con vistos de la pestaña, en este orden."
      accion={
        <AgregarPunto
          lleno={formulario.puntos.length >= MAXIMO_DE_PUNTOS}
          alPulsar={cambios.agregarPunto}
        />
      }
    >
      <Lista {...props} />
      {errores.puntos && (
        <div className="px-5 pb-4">
          <MensajeDeError id="area-puntos-error" texto={errores.puntos} />
        </div>
      )}
    </TarjetaDelPanel>
  )
}
