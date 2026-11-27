'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { BotonVerContrasena } from './boton-ver-contrasena'

interface CampoConOjo {
  clave: string
  campo: HTMLInputElement
  contenedor: HTMLElement
}

let siguienteClave = 0

const MARCA = 'data-jjmm-ver-contrasena'
// Clases globales de `app/(payload)/estilos/_formularios.scss`.
const CLASE_DEL_CAMPO = 'jjmm-campo-con-ojo'
const CLASE_DEL_CONTENEDOR = 'jjmm-ver-contrasena'

// Payload no ofrece un espacio para agregar algo a sus campos de contraseña (ingreso, primer
// usuario, contraseña nueva, cuenta), así que este componente los busca en la página y monta en
// cada uno un botón «ojo» con un portal. Se marca cada campo para no repetirlo, y un
// MutationObserver encuentra los que Payload dibuja después (cambio de pantalla, «Cambiar
// contraseña» en la cuenta). Los campos que desaparecen se sueltan.
function prepararCampo(campo: HTMLInputElement): CampoConOjo | null {
  const padre = campo.parentElement
  if (!padre) return null
  campo.setAttribute(MARCA, '')
  padre.classList.add(CLASE_DEL_CAMPO)
  const contenedor = document.createElement('span')
  contenedor.className = CLASE_DEL_CONTENEDOR
  padre.appendChild(contenedor)
  siguienteClave += 1
  return { clave: `contrasena-${siguienteClave}`, campo, contenedor }
}

function camposNuevos(): CampoConOjo[] {
  const sinOjo = document.querySelectorAll<HTMLInputElement>(
    `input[type='password']:not([${MARCA}])`,
  )
  return Array.from(sinOjo)
    .map(prepararCampo)
    .filter((campo): campo is CampoConOjo => campo !== null)
}

function useCamposDeContrasena(): CampoConOjo[] {
  const [campos, setCampos] = useState<CampoConOjo[]>([])

  useEffect(() => {
    let pendiente = 0
    const revisar = () => {
      pendiente = 0
      const nuevos = camposNuevos()
      setCampos((actuales) => {
        const vigentes = actuales.filter(({ campo }) => campo.isConnected)
        const sinCambios = nuevos.length === 0 && vigentes.length === actuales.length
        return sinCambios ? actuales : [...vigentes, ...nuevos]
      })
    }
    const programar = () => {
      if (!pendiente) pendiente = requestAnimationFrame(revisar)
    }
    programar()
    const observador = new MutationObserver(programar)
    observador.observe(document.body, { childList: true, subtree: true })
    return () => {
      observador.disconnect()
      cancelAnimationFrame(pendiente)
    }
  }, [])

  return campos
}

export function VerContrasenas() {
  const campos = useCamposDeContrasena()
  return campos.map(({ clave, campo, contenedor }) =>
    createPortal(<BotonVerContrasena campo={campo} />, contenedor, clave),
  )
}
