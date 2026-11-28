'use client'

import { estaEnLaRueda } from '../../dominio/areas-de-servicio'
import { AreaDeTexto } from '../comunes/area-de-texto'
import { Insignia } from '../comunes/insignia'
import { TarjetaDelPanel } from '../inicio/tarjeta-del-panel'
import type { PropsDeSeccionDelArea } from './datos-del-area'

// «Gajo en la rueda»: el contorno que hace pulsable el área sobre la imagen. Casi nunca se toca,
// por eso va plegado (y se abre solo si tiene un error).
export function GajoDelArea({ formulario, errores, cambios }: PropsDeSeccionDelArea) {
  return (
    <TarjetaDelPanel
      idDelTitulo="titulo-gajo"
      titulo="Gajo en la rueda"
      bajada="Hace que se pueda pulsar esta área sobre la imagen de la rueda."
      accion={
        estaEnLaRueda(formulario.poligono) ? (
          <Insignia tono="listo" texto="Marcada en la rueda" />
        ) : (
          <Insignia tono="pendiente" texto="Solo en las pestañas" />
        )
      }
    >
      <div className="px-5 py-5">
        <details
          open={errores.poligono ? true : undefined}
          className="rounded-md border bg-muted/40 px-4 py-3 text-sm"
        >
          <summary className="cursor-pointer font-semibold text-foreground">
            Cambiar el contorno del gajo
          </summary>
          <div className="mt-3">
            <AreaDeTexto
              id="area-poligono"
              etiqueta="Puntos del contorno"
              rows={3}
              maxLength={2000}
              className="tabular-nums"
              ayuda="Solo cámbialo si cambia la imagen de la rueda. Son puntos «x,y» separados por espacios, medidos sobre la imagen de 500 × 550 píxeles. Si lo dejas vacío, el área sigue en las pestañas pero no se puede pulsar en la rueda."
              error={errores.poligono}
              value={formulario.poligono}
              onChange={(evento) => cambios.cambiarTexto('poligono', evento.target.value)}
            />
          </div>
        </details>
      </div>
    </TarjetaDelPanel>
  )
}
