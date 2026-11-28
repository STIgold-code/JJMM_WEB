'use client'

import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react'

import type { EstadoDelGuardado } from '../../aplicacion/resultados-de-escritura'
import { avisarError, avisarExito } from '../mensajes/avisos'

type ConGeneral = { general?: string }

interface Opciones<F, E> {
  guardado: F
  hayCambios: (original: F, actual: F) => boolean
  // La acción de servidor: valida todo de nuevo y devuelve el estado del guardado.
  guardarEnServidor: (formulario: F) => Promise<EstadoDelGuardado<E>>
}

// Errores que devolvió el servidor. Tras un intento rechazado (y solo entonces) el foco va al
// primer campo con error.
function useErroresDelServidor<E>() {
  const [errores, setErrores] = useState<Partial<E>>({})
  const [rechazos, setRechazos] = useState(0)
  const raiz = useRef<HTMLFormElement>(null)
  useEffect(() => {
    if (rechazos > 0) raiz.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }, [rechazos])
  const rechazar = (nuevos: Partial<E>) => {
    setErrores(nuevos)
    setRechazos((cuenta) => cuenta + 1)
  }
  return { raiz, errores, setErrores, rechazar }
}

export interface EdicionEnPagina<F, E> {
  formulario: F
  setFormulario: Dispatch<SetStateAction<F>>
  errores: Partial<E>
  setErrores: Dispatch<SetStateAction<Partial<E>>>
  sucio: boolean
  guardando: boolean
  guardadoRecien: boolean
  guardar: () => void
  descartar: () => void
}

// Estado de una edición en una página con barra de guardado (áreas, filas de la tabla): lo
// guardado (`original`) y lo que se está escribiendo. «Guardar cambios» se activa solo con
// cambios; al guardar bien, lo escrito pasa a ser lo guardado. `raiz` (una ref) va aparte.
export function useEdicionEnPagina<F, E extends ConGeneral>(opciones: Opciones<F, E>) {
  const [original, setOriginal] = useState(opciones.guardado)
  const [formulario, setFormulario] = useState(opciones.guardado)
  const [guardando, iniciar] = useTransition()
  const [guardadoRecien, setGuardadoRecien] = useState(false)
  const { raiz, errores, setErrores, rechazar } = useErroresDelServidor<E>()
  const sucio = opciones.hayCambios(original, formulario)

  const guardar = () => {
    if (!sucio || guardando) return
    iniciar(async () => {
      const estado = await opciones.guardarEnServidor(formulario)
      if (estado.estado === 'guardado') {
        setOriginal(formulario)
        setErrores({})
        setGuardadoRecien(true)
        return avisarExito(estado.aviso)
      }
      if (estado.estado === 'error') return avisarError(estado.error)
      rechazar(estado.errores)
      if (estado.errores.general) avisarError(estado.errores.general)
    })
  }

  const edicion: EdicionEnPagina<F, E> = {
    formulario,
    setFormulario,
    errores,
    setErrores,
    sucio,
    guardando,
    guardadoRecien,
    guardar,
    descartar: () => {
      setFormulario(original)
      setErrores({})
    },
  }
  return { raiz, edicion }
}
