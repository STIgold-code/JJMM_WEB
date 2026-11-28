'use client'

import type { PortadaDelFormulario } from '../../dominio/carrusel-de-portadas'
import type { ErroresDePortada } from '../../dominio/errores-del-carrusel'
import { TarjetaDelPanel } from '../inicio/tarjeta-del-panel'
import { BotonesDeLaPortada } from './botones-de-la-portada'
import type { CambiosDelCarrusel } from './cambios-del-carrusel'
import { ImagenDeLaPortada } from './imagen-de-la-portada'
import { TextosDeLaPortada } from './textos-de-la-portada'

interface Props {
  portada: PortadaDelFormulario
  indice: number
  errores: ErroresDePortada | undefined
  cambios: CambiosDelCarrusel
}

// Editor de la portada abierta: «imagen» y «textos y botones», con los campos reales del bloque.
// Todas las portadas se editan con el mismo editor.
export function EditorDePortada({ portada, indice, errores, cambios }: Props) {
  const numero = indice + 1
  const alCambiar = (cambio: Parameters<CambiosDelCarrusel['cambiarPortada']>[2]) =>
    cambios.cambiarPortada(portada.clave, indice, cambio)
  return (
    <>
      <ImagenDeLaPortada
        portada={portada}
        numero={numero}
        errores={errores}
        alCambiar={alCambiar}
      />
      <TarjetaDelPanel
        idDelTitulo="titulo-textos-de-portada"
        titulo={`Portada ${numero}: textos y botones`}
      >
        <div className="grid gap-5 px-5 py-5">
          <TextosDeLaPortada portada={portada} errores={errores} alCambiar={alCambiar} />
          <BotonesDeLaPortada
            portada={portada}
            indice={indice}
            errores={errores}
            cambios={cambios}
          />
        </div>
      </TarjetaDelPanel>
    </>
  )
}
