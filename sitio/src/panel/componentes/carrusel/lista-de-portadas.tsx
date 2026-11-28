'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'

import {
  type FormularioDelCarrusel,
  MAXIMO_DE_PORTADAS,
  type PortadaDelFormulario,
} from '../../dominio/carrusel-de-portadas'
import type { ErroresDelCarrusel } from '../../dominio/errores-del-carrusel'
import { nombreDePortada } from '../../dominio/vista-previa-de-portada'
import { Confirmacion } from '../comunes/confirmacion'
import { MensajeDeError } from '../comunes/mensaje-de-error'
import { useArrastre } from '../comunes/use-arrastre'
import { useFocoTrasMover } from '../comunes/use-foco-tras-mover'
import { TarjetaDelPanel } from '../inicio/tarjeta-del-panel'
import { Button } from '../ui/button'
import type { CambiosDelCarrusel } from './cambios-del-carrusel'
import { FilaDePortada } from './fila-de-portada'
import { SegundosPorPortada } from './segundos-por-portada'

interface Props {
  formulario: FormularioDelCarrusel
  errores: ErroresDelCarrusel
  abierta: number | null
  cambios: CambiosDelCarrusel
  alEditar: (clave: number) => void
}

function useMover(portadas: PortadaDelFormulario[], mover: (desde: number, hacia: number) => void) {
  const [anuncio, setAnuncio] = useState('')
  const pedirFoco = useFocoTrasMover(portadas)
  const alMover = (desde: number, hacia: number, paso?: -1 | 1) => {
    const portada = portadas[desde]
    if (!portada || hacia < 0 || hacia >= portadas.length || desde === hacia) return
    const nombre = nombreDePortada(portada, desde)
    setAnuncio(`${nombre}, posición ${hacia + 1} de ${portadas.length}`)
    if (paso) pedirFoco({ id: portada.clave, paso })
    mover(desde, hacia)
  }
  return { anuncio, alMover }
}

function Filas({ formulario, errores, abierta, cambios, alEditar }: Props) {
  const { portadas } = formulario
  const [porQuitar, setPorQuitar] = useState<PortadaDelFormulario | null>(null)
  const { anuncio, alMover } = useMover(portadas, cambios.moverPortada)
  const { propsDeFila, propsDeAsa } = useArrastre((desde, hacia) => alMover(desde, hacia))
  return (
    <>
      <ol aria-labelledby="titulo-portadas">
        {portadas.map((portada, indice) => (
          <FilaDePortada
            key={portada.clave}
            {...{ portada, indice, alMover }}
            total={portadas.length}
            abierta={portada.clave === abierta}
            conErrores={errores.portada?.[indice] !== undefined}
            alEditar={() => alEditar(portada.clave)}
            alQuitar={() => setPorQuitar(portada)}
            propsDeFila={propsDeFila(indice)}
            propsDeAsa={propsDeAsa(indice)}
          />
        ))}
      </ol>
      <p aria-live="assertive" className="sr-only">
        {anuncio}
      </p>
      <ConfirmarQuitar
        nombre={porQuitar ? nombreDePortada(porQuitar, portadas.indexOf(porQuitar)) : null}
        alConfirmar={() => {
          if (porQuitar) cambios.quitarPortada(porQuitar.clave)
          setPorQuitar(null)
        }}
        alCerrar={() => setPorQuitar(null)}
      />
    </>
  )
}

// Quitar una portada pide confirmación en un diálogo propio; se quita al guardar.
function ConfirmarQuitar(props: {
  nombre: string | null
  alConfirmar: () => void
  alCerrar: () => void
}) {
  return (
    <Confirmacion
      abierta={props.nombre !== null}
      titulo={`¿Quitar la portada «${props.nombre ?? ''}»?`}
      texto="Deja de verse en el carrusel cuando guardes los cambios. Su imagen sigue en «Imágenes»."
      accion="Quitar portada"
      alConfirmar={props.alConfirmar}
      alCerrar={props.alCerrar}
    />
  )
}

// «Portadas» (maqueta): los segundos por portada, la lista en el orden del carrusel y «Agregar
// portada». Los cambios se guardan con la barra de guardado, junto con la portada abierta.
export function ListaDePortadas(props: Props) {
  const { formulario, errores, cambios } = props
  return (
    <TarjetaDelPanel
      idDelTitulo="titulo-portadas"
      titulo="Portadas"
      accion={
        <SegundosPorPortada
          valor={formulario.segundosPorPortada}
          error={errores.segundos}
          alCambiar={cambios.cambiarSegundos}
        />
      }
    >
      <Filas {...props} />
      <div className="grid gap-3 border-t px-4 py-3">
        {errores.portadas && <MensajeDeError id="portadas-error" texto={errores.portadas} />}
        <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="bg-card"
            disabled={formulario.portadas.length >= MAXIMO_DE_PORTADAS}
            onClick={cambios.agregarPortada}
          >
            <Plus aria-hidden="true" />
            Agregar portada
          </Button>
        </div>
      </div>
    </TarjetaDelPanel>
  )
}
