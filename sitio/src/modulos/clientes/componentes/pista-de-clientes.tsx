'use client'

import type { ReactNode } from 'react'

import { Icono } from '@/compartido/componentes/iconos/icono'

import estilos from './clientes.module.css'
import { usePista } from './use-pista'

interface PropsPistaDeClientes {
  etiqueta: string
  // Elementos <li> con los logotipos, dibujados en el servidor.
  children: ReactNode
}

// Isla de cliente del carrusel de clientes: la pista se desplaza con scroll nativo (táctil y
// teclado, porque es enfocable); las flechas y el arrastre con mouse lo complementan.
export function PistaDeClientes({ etiqueta, children }: PropsPistaDeClientes) {
  const { pista, extremos, arrastrando, mover, gestos } = usePista()
  return (
    <>
      <ul
        ref={pista}
        className={`${estilos.pista} ${arrastrando ? estilos.arrastrando : ''}`}
        aria-label={etiqueta}
        tabIndex={0}
        {...gestos}
      >
        {children}
      </ul>
      <div className={estilos.flechas}>
        <button type="button" disabled={extremos.alInicio} onClick={() => mover(-1)}>
          <Icono nombre="anterior" />
          <span className="oculto">Clientes anteriores</span>
        </button>
        <button type="button" disabled={extremos.alFinal} onClick={() => mover(1)}>
          <Icono nombre="siguiente" />
          <span className="oculto">Más clientes</span>
        </button>
      </div>
    </>
  )
}
