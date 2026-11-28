'use client'

import { useState, useTransition } from 'react'

import type { EstadoDelGuardado } from '../../aplicacion/resultados-de-escritura'
import { avisarError, avisarExito } from '../mensajes/avisos'

interface Opciones<F, E> {
  inicial: F
  hayCambios: (original: F, actual: F) => boolean
  // La acción de servidor: valida todo de nuevo y devuelve el estado del guardado.
  guardarEnServidor: (formulario: F) => Promise<EstadoDelGuardado<E>>
  alGuardar: () => void
}

type ConGeneral = { general?: string }

// Sin el error de `campo` (los errores se nombran como los campos del formulario).
function sinError<E extends object>(errores: Partial<E>, campo: PropertyKey): Partial<E> {
  if (!(campo in errores)) return errores
  const copia = { ...errores }
  Reflect.deleteProperty(copia, campo)
  return copia
}

// Estado del formulario de un panel lateral (guía de clientes): lo escrito, los errores que
// devolvió el servidor por campo y si hay cambios. Al cambiar un campo se borra su error.
export function useFormularioEnHoja<F extends object, E extends ConGeneral>({
  inicial,
  hayCambios,
  guardarEnServidor,
  alGuardar,
}: Opciones<F, E>) {
  const [formulario, setFormulario] = useState(inicial)
  const [errores, setErrores] = useState<Partial<E>>({})
  const [guardando, iniciar] = useTransition()
  const sucio = hayCambios(inicial, formulario)

  const cambiar = <C extends keyof F>(campo: C, valor: F[C]) => {
    setFormulario((actual) => ({ ...actual, [campo]: valor }))
    setErrores((actuales) => sinError(actuales, campo))
  }

  const guardar = () => {
    if (!sucio || guardando) return
    iniciar(async () => {
      const estado = await guardarEnServidor(formulario)
      if (estado.estado === 'guardado') {
        avisarExito(estado.aviso)
        alGuardar()
        return
      }
      if (estado.estado === 'error') return avisarError(estado.error)
      setErrores(estado.errores)
      if (estado.errores.general) avisarError(estado.errores.general)
    })
  }

  return { formulario, errores, guardando, sucio, cambiar, guardar }
}
