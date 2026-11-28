'use client'

import { useEffect, useRef, useState } from 'react'

import {
  type FormularioDelCarrusel,
  hayCambiosEnElCarrusel,
} from '../../dominio/carrusel-de-portadas'
import {
  type ErroresDelCarrusel,
  primeraPortadaConErrores,
} from '../../dominio/errores-del-carrusel'
import { cambiosDelCarrusel } from './cambios-del-carrusel'
import { useGuardadoDelCarrusel } from './use-guardado-del-carrusel'

// Errores del servidor. Tras un intento rechazado se abre la primera portada con errores y el foco
// va al primer campo marcado.
function useErrores(abrirPortada: (indice: number) => void) {
  const [errores, setErrores] = useState<ErroresDelCarrusel>({})
  const [rechazos, setRechazos] = useState(0)
  const raiz = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (rechazos > 0) raiz.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }, [rechazos])

  const rechazar = (nuevos: ErroresDelCarrusel) => {
    const indice = primeraPortadaConErrores(nuevos)
    if (indice !== null) abrirPortada(indice)
    setErrores(nuevos)
    setRechazos((cuenta) => cuenta + 1)
  }
  return { raiz, errores, setErrores, rechazar }
}

// Estado del editor del carrusel: lo guardado (`original`), lo que se escribe, la portada abierta
// y los errores. «Guardar cambios» se activa solo con cambios; al guardar bien, lo escrito pasa a
// ser lo guardado, con la versión nueva de la página para el próximo guardado.
export function useEdicionDelCarrusel(guardado: FormularioDelCarrusel) {
  const [original, setOriginal] = useState(guardado)
  const [formulario, setFormulario] = useState(guardado)
  const [seleccionada, seleccionar] = useState(guardado.portadas[0]?.clave ?? null)
  const { raiz, errores, setErrores, rechazar } = useErrores((indice) =>
    seleccionar(formulario.portadas[indice]?.clave ?? null),
  )
  const guardadoDelCarrusel = useGuardadoDelCarrusel()
  const sucio = hayCambiosEnElCarrusel(original, formulario)

  // Lo enviado pasa a ser lo guardado; lo escrito mientras tanto se conserva.
  const alGuardar = (enviado: FormularioDelCarrusel) => (actualizadoEn: string) => {
    setOriginal({ ...enviado, actualizadoEn })
    setFormulario((actual) => ({ ...actual, actualizadoEn }))
    setErrores({})
  }

  return {
    raiz,
    formulario,
    errores,
    sucio,
    seleccionada,
    seleccionar,
    ...guardadoDelCarrusel,
    cambios: cambiosDelCarrusel({ formulario, setFormulario, setErrores, seleccionar }),
    guardar: () => {
      if (!sucio || guardadoDelCarrusel.guardando) return
      guardadoDelCarrusel.guardar(formulario, alGuardar(formulario), rechazar)
    },
    descartar: () => {
      setFormulario(original)
      setErrores({})
    },
  }
}
