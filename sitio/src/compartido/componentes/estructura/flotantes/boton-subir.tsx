'use client'

import { Icono } from '@/compartido/componentes/iconos/icono'

import { useDesplazado } from '../use-desplazado'
import estilos from './flotantes.module.css'

// Píxeles de desplazamiento a partir de los cuales aparece el botón (v4).
const UMBRAL_VISIBLE = 700

function subir() {
  const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reducir ? 'auto' : 'smooth' })
}

// Oculto queda `inert`, así no se alcanza con el teclado mientras no se ve.
export function BotonSubir() {
  const visible = useDesplazado(UMBRAL_VISIBLE)
  return (
    <button
      className={`${estilos.subir} ${visible ? estilos.visible : ''}`}
      type="button"
      onClick={subir}
      inert={!visible}
    >
      <Icono nombre="arriba" />
      <span className="oculto">Volver arriba</span>
    </button>
  )
}
