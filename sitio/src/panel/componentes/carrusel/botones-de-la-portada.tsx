'use client'

import { Plus } from 'lucide-react'

import { MAXIMO_DE_BOTONES, type PortadaDelFormulario } from '../../dominio/carrusel-de-portadas'
import type { ErroresDePortada } from '../../dominio/errores-del-carrusel'
import { CLASE_DE_AYUDA } from '../comunes/campo'
import { MensajeDeError } from '../comunes/mensaje-de-error'
import { Button } from '../ui/button'
import { BotonDeLaPortada } from './boton-de-la-portada'
import type { CambiosDelCarrusel } from './cambios-del-carrusel'

interface Props {
  portada: PortadaDelFormulario
  // Posición de la portada en la lista: los errores van por posición.
  indice: number
  errores: ErroresDePortada | undefined
  cambios: Pick<CambiosDelCarrusel, 'agregarBoton' | 'quitarBoton' | 'cambiarBoton'>
}

// Botones de la portada: hasta dos, como el bloque.
export function BotonesDeLaPortada({ portada, indice, errores, cambios }: Props) {
  const { clave, botones } = portada
  return (
    <div role="group" aria-labelledby="portada-botones" className="grid gap-3">
      <div>
        <span id="portada-botones" className="text-sm font-semibold">
          Botones
        </span>
        <p className={CLASE_DE_AYUDA}>
          Hasta {MAXIMO_DE_BOTONES}. Los de WhatsApp y llamada usan los celulares del sitio.
        </p>
      </div>
      {botones.length > 0 && (
        <ul className="grid gap-3">
          {botones.map((boton, posicion) => (
            <BotonDeLaPortada
              key={boton.clave}
              boton={boton}
              numero={posicion + 1}
              errores={errores?.boton?.[posicion]}
              alCambiar={(cambio) => cambios.cambiarBoton(clave, indice, boton.clave, cambio)}
              alQuitar={() => cambios.quitarBoton(clave, indice, boton.clave)}
            />
          ))}
        </ul>
      )}
      {errores?.botones && <MensajeDeError id="portada-botones-error" texto={errores.botones} />}
      <AgregarBoton
        lleno={botones.length >= MAXIMO_DE_BOTONES}
        alPulsar={() => cambios.agregarBoton(clave, indice)}
      />
    </div>
  )
}

function AgregarBoton({ lleno, alPulsar }: { lleno: boolean; alPulsar: () => void }) {
  return (
    <div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="bg-card"
        disabled={lleno}
        onClick={alPulsar}
      >
        <Plus aria-hidden="true" />
        Agregar botón
      </Button>
    </div>
  )
}
