'use client'

import { TriangleAlert } from 'lucide-react'

import { SIN_SEDES_VISIBLES } from '../../dominio/sedes'
import { FilaVisible } from '../comunes/fila-visible'
import { TarjetaDelPanel } from '../inicio/tarjeta-del-panel'

interface Props {
  visible: boolean
  // Otras sedes visibles; sin ninguna, guardar esta oculta deja el sitio sin sedes.
  otrasVisibles: number
  alCambiar: (visible: boolean) => void
}

// «Publicación»: el interruptor «Visible en el sitio». Si al apagarlo no queda ninguna sede
// visible, se avisa qué pasa en el sitio (se permite: el sitio funciona sin sedes).
export function PublicacionDeSede({ visible, otrasVisibles, alCambiar }: Props) {
  const sinSedes = !visible && otrasVisibles === 0
  return (
    <TarjetaDelPanel idDelTitulo="titulo-publicacion" titulo="Publicación">
      <div className="grid gap-4 px-5 py-5">
        <FilaVisible
          id="sede-visible"
          visible={visible}
          ayuda="Apágala para ocultar la sede sin borrarla, por ejemplo durante una mudanza."
          alCambiar={alCambiar}
        />
        {sinSedes && (
          <p className="flex gap-2 rounded-md border border-pendiente-borde bg-pendiente-fondo px-3 py-2 text-[0.8125rem] text-pendiente">
            <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            Ninguna otra sede está visible: si la guardas oculta, {SIN_SEDES_VISIBLES}
          </p>
        )}
      </div>
    </TarjetaDelPanel>
  )
}
