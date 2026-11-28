'use client'

import { useState } from 'react'

import { esLaUltimaVisible, type SedeDelPanel } from '../../dominio/sedes'

// Apagar la última sede visible deja el sitio sin sedes: antes de hacerlo se pide confirmación.
// Cualquier otro cambio del interruptor se guarda al instante.
export function useOcultarConAviso(
  sedes: readonly SedeDelPanel[],
  cambiarVisibilidad: (id: number, visible: boolean) => void,
) {
  const [porOcultar, setPorOcultar] = useState<SedeDelPanel | null>(null)

  return {
    porOcultar,
    alCambiar: (id: number, visible: boolean) => {
      const sede = sedes.find((s) => s.id === id)
      if (!visible && sede && esLaUltimaVisible(sedes, id)) setPorOcultar(sede)
      else cambiarVisibilidad(id, visible)
    },
    confirmar: () => {
      if (porOcultar) cambiarVisibilidad(porOcultar.id, false)
      setPorOcultar(null)
    },
    cancelar: () => setPorOcultar(null),
  }
}
