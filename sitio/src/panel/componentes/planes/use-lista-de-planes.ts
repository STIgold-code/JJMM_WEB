'use client'

import { useEffect, useOptimistic, useRef, useState, useTransition } from 'react'

import { cambiarVisibilidadDelPlan, ordenarLosPlanes } from '../../acciones/planes'
import type { PlanDelListado } from '../../aplicacion/consultar-planes'
import { avisoDeOrden } from '../../dominio/avisos-de-planes'
import { moverEnLista } from '../../dominio/orden-de-planes'
import { avisarError, avisarExito, avisarResultado } from '../mensajes/avisos'

type Cambio =
  | { tipo: 'visibilidad'; id: number; visible: boolean }
  | { tipo: 'orden'; desde: number; hacia: number }

function aplicarCambio(planes: PlanDelListado[], cambio: Cambio): PlanDelListado[] {
  if (cambio.tipo === 'orden') return moverEnLista(planes, cambio.desde, cambio.hacia)
  return planes.map((p) => (p.id === cambio.id ? { ...p, visible: cambio.visible } : p))
}

// Botón que recupera el foco tras mover una fila (React la mueve en el DOM y el foco se pierde).
export interface FocoPendiente {
  id: number
  paso: -1 | 1
}

function enfocar({ id, paso }: FocoPendiente): void {
  const fila = document.querySelector(`[data-plan="${id}"]`)
  const mismo = fila?.querySelector<HTMLButtonElement>(`[data-mover="${paso}"]:not(:disabled)`)
  ;(mismo ?? fila?.querySelector<HTMLButtonElement>('[data-mover]:not(:disabled)'))?.focus()
}

// Estado del listado con cambios optimistas: el interruptor y el orden se ven al instante y se
// guardan en el servidor. Si la escritura falla, `useOptimistic` vuelve solo a lo que manda el
// servidor (el cambio se deshace) y un aviso explica el error. Si sale bien, la acción revalida
// el panel y la lista del servidor ya trae el cambio.
export function useListaDePlanes(delServidor: PlanDelListado[]) {
  const [planes, aplicar] = useOptimistic(delServidor, aplicarCambio)
  const [, iniciar] = useTransition()
  const [anuncio, setAnuncio] = useState('')
  const foco = useRef<FocoPendiente | null>(null)

  // Tras dibujar la fila en su lugar nuevo, una sola vez.
  useEffect(() => {
    if (!foco.current) return
    enfocar(foco.current)
    foco.current = null
  }, [planes])

  function cambiarVisibilidad(id: number, visible: boolean): void {
    iniciar(async () => {
      aplicar({ tipo: 'visibilidad', id, visible })
      avisarResultado(await cambiarVisibilidadDelPlan(id, visible))
    })
  }

  function mover(desde: number, hacia: number, paso?: FocoPendiente['paso']): void {
    const plan = planes[desde]
    if (!plan || hacia < 0 || hacia >= planes.length || desde === hacia) return
    const ids = moverEnLista(planes, desde, hacia).map((p) => p.id)
    setAnuncio(`${plan.nombre}, posición ${hacia + 1} de ${planes.length}`)
    if (paso) foco.current = { id: plan.id, paso }
    iniciar(async () => {
      aplicar({ tipo: 'orden', desde, hacia })
      const resultado = await ordenarLosPlanes(ids)
      if (resultado.ok) avisarExito(avisoDeOrden(plan.nombre, hacia + 1))
      else avisarError(resultado.error)
    })
  }

  return { planes, anuncio, cambiarVisibilidad, mover }
}
