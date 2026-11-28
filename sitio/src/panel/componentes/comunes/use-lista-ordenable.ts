'use client'

import { useEffect, useOptimistic, useRef, useState, useTransition } from 'react'

import type { ResultadoDeAccionRapida } from '../../aplicacion/resultados-de-escritura'
import { avisoDeOrden, moverEnLista } from '../../dominio/orden'
import { avisarError, avisarExito, avisarResultado } from '../mensajes/avisos'

export interface ElementoOrdenable {
  id: number
  nombre: string
  visible: boolean
}

// Las acciones de servidor del listado; reciben `unknown` y validan en el servidor.
export interface AccionesDeLaLista {
  cambiarVisibilidad: (id: number, visible: boolean) => Promise<ResultadoDeAccionRapida>
  ordenar: (ids: number[]) => Promise<ResultadoDeAccionRapida>
}

type Cambio =
  | { tipo: 'visibilidad'; id: number; visible: boolean }
  | { tipo: 'orden'; desde: number; hacia: number }

function aplicarCambio<T extends ElementoOrdenable>(lista: T[], cambio: Cambio): T[] {
  if (cambio.tipo === 'orden') return moverEnLista(lista, cambio.desde, cambio.hacia)
  return lista.map((e) => (e.id === cambio.id ? { ...e, visible: cambio.visible } : e))
}

// Botón que recupera el foco tras mover una fila (React la mueve en el DOM y el foco se pierde).
export interface FocoPendiente {
  id: number | string
  paso: -1 | 1
}

// Cada fila lleva `data-fila` con el id de su elemento.
export function enfocar({ id, paso }: FocoPendiente): void {
  const fila = document.querySelector(`[data-fila="${id}"]`)
  const mismo = fila?.querySelector<HTMLButtonElement>(`[data-mover="${paso}"]:not(:disabled)`)
  ;(mismo ?? fila?.querySelector<HTMLButtonElement>('[data-mover]:not(:disabled)'))?.focus()
}

// Estado de un listado ordenable con cambios optimistas: el interruptor y el orden se ven al
// instante y se guardan en el servidor. Si la escritura falla, `useOptimistic` vuelve solo a lo
// que manda el servidor (el cambio se deshace) y un aviso explica el error. Si sale bien, la
// acción revalida el panel y la lista del servidor ya trae el cambio.
export function useListaOrdenable<T extends ElementoOrdenable>(
  delServidor: T[],
  acciones: AccionesDeLaLista,
) {
  const [elementos, aplicar] = useOptimistic(delServidor, aplicarCambio<T>)
  const [, iniciar] = useTransition()
  const [anuncio, setAnuncio] = useState('')
  const foco = useRef<FocoPendiente | null>(null)

  // Tras dibujar la fila en su lugar nuevo, una sola vez.
  useEffect(() => {
    if (!foco.current) return
    enfocar(foco.current)
    foco.current = null
  }, [elementos])

  function cambiarVisibilidad(id: number, visible: boolean): void {
    iniciar(async () => {
      aplicar({ tipo: 'visibilidad', id, visible })
      avisarResultado(await acciones.cambiarVisibilidad(id, visible))
    })
  }

  function mover(desde: number, hacia: number, paso?: FocoPendiente['paso']): void {
    const elemento = elementos[desde]
    if (!elemento || hacia < 0 || hacia >= elementos.length || desde === hacia) return
    const ids = moverEnLista(elementos, desde, hacia).map((e) => e.id)
    setAnuncio(`${elemento.nombre}, posición ${hacia + 1} de ${elementos.length}`)
    if (paso) foco.current = { id: elemento.id, paso }
    iniciar(async () => {
      aplicar({ tipo: 'orden', desde, hacia })
      const resultado = await acciones.ordenar(ids)
      if (resultado.ok) avisarExito(avisoDeOrden(elemento.nombre, hacia + 1))
      else avisarError(resultado.error)
    })
  }

  return { elementos, anuncio, cambiarVisibilidad, mover }
}
