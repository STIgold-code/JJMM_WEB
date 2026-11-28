'use client'

import { useState, useTransition } from 'react'

import { ordenarLasSecciones } from '../../acciones/pagina-de-inicio'
import { moverEnLista } from '../../dominio/orden'
import type { SeccionDelPanel } from '../../dominio/pagina-de-inicio'
import { useFocoTrasMover } from '../comunes/use-foco-tras-mover'
import type { FocoPendiente } from '../comunes/use-lista-ordenable'
import { avisarError, avisarExito } from '../mensajes/avisos'

const claves = (secciones: readonly SeccionDelPanel[]) => secciones.map((s) => s.clave).join('|')

// Guardar el orden: una sola escritura con la versión de la página que se cargó. Si el servidor
// dice que la página cambió, queda marcado para pedir que se recargue.
function useGuardadoDelOrden(version: string | null) {
  const [actualizadoEn, setActualizadoEn] = useState(version)
  const [guardando, iniciar] = useTransition()
  const [guardadoRecien, setGuardadoRecien] = useState(false)
  const [desactualizada, setDesactualizada] = useState(false)

  const guardar = (secciones: readonly SeccionDelPanel[], alGuardar: () => void) => {
    iniciar(async () => {
      const ids = secciones.map((s) => s.id)
      const resultado = await ordenarLasSecciones(ids, actualizadoEn)
      if (resultado.estado === 'guardado') {
        setActualizadoEn(resultado.actualizadoEn)
        setGuardadoRecien(true)
        alGuardar()
        avisarExito(resultado.aviso)
      } else if (resultado.estado === 'error') {
        setDesactualizada(resultado.desactualizada)
        avisarError(resultado.error)
      }
    })
  }

  return { guardando, guardadoRecien, desactualizada, guardar }
}

// Orden de las secciones del inicio (maqueta «Página de inicio»): se cambia con el asa o las
// flechas y se guarda con «Guardar cambios».
export function useOrdenDeSecciones(delServidor: SeccionDelPanel[], version: string | null) {
  const [original, setOriginal] = useState(delServidor)
  const [secciones, setSecciones] = useState(delServidor)
  const [anuncio, setAnuncio] = useState('')
  const pedirFoco = useFocoTrasMover(secciones)
  const guardado = useGuardadoDelOrden(version)

  const mover = (desde: number, hacia: number, paso?: FocoPendiente['paso']) => {
    const seccion = secciones[desde]
    if (!seccion || hacia < 0 || hacia >= secciones.length || desde === hacia) return
    setAnuncio(`${seccion.nombre}, posición ${hacia + 1} de ${secciones.length}`)
    if (paso) pedirFoco({ id: seccion.clave, paso })
    setSecciones(moverEnLista(secciones, desde, hacia))
  }

  return {
    ...guardado,
    secciones,
    anuncio,
    sucio: claves(original) !== claves(secciones),
    mover,
    guardar: () => guardado.guardar(secciones, () => setOriginal(secciones)),
    descartar: () => setSecciones(original),
  }
}
