'use client'

import { useState } from 'react'

// Qué panel lateral está abierto en una parte de la guía: uno nuevo, el de un elemento (su id) o
// ninguno. Si el elemento ya no está en la lista (alguien lo borró), el panel no se dibuja.
type Abierto = 'nuevo' | number | null

export function usePanelAbierto<T extends { id: number }>(lista: readonly T[]) {
  const [abierto, setAbierto] = useState<Abierto>(null)
  const editado = typeof abierto === 'number' ? lista.find((e) => e.id === abierto) : undefined
  return {
    // Un panel por elemento: la clave lo vuelve a montar vacío al cambiar de elemento.
    clave: String(abierto),
    hayPanel: abierto === 'nuevo' || editado !== undefined,
    editado: editado ?? null,
    abrirNuevo: () => setAbierto('nuevo'),
    abrir: (id: number) => setAbierto(id),
    cerrar: () => setAbierto(null),
  }
}
