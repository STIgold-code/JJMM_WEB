'use client'

import { useEffect, useRef, useState } from 'react'

import type { ErroresDeSede } from '../../dominio/validacion-de-sede'

type CampoConError = Exclude<keyof ErroresDeSede, 'celular' | 'general'>

function sinErrorDeCelular(errores: ErroresDeSede, indice: number): ErroresDeSede {
  if (!errores.celular?.[indice]) return errores
  const celular = { ...errores.celular }
  delete celular[indice]
  return { ...errores, celular }
}

// Lo que borra los errores al tocar un campo.
export type LimpiadoresDeErrores = Omit<
  ReturnType<typeof useErroresDeSede>,
  'raiz' | 'errores' | 'rechazar'
>

// Errores que devolvió el servidor. Un error se borra cuando se corrige su campo; tras un intento
// rechazado (y solo entonces), el foco va al primer campo con error.
export function useErroresDeSede() {
  const [errores, setErrores] = useState<ErroresDeSede>({})
  const [rechazos, setRechazos] = useState(0)
  const raiz = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (rechazos > 0) raiz.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }, [rechazos])

  return {
    raiz,
    errores,
    rechazar: (nuevos: ErroresDeSede) => {
      setErrores(nuevos)
      setRechazos((cuenta) => cuenta + 1)
    },
    limpiar: () => setErrores({}),
    limpiarCampo: (campo: CampoConError) =>
      setErrores((actuales) => ({ ...actuales, [campo]: undefined })),
    limpiarCelular: (indice: number) =>
      setErrores((actuales) => sinErrorDeCelular(actuales, indice)),
    // Al agregar, quitar o mover filas, los errores por posición ya no corresponden.
    limpiarCelulares: () => setErrores(({ celular: _, celulares: __, ...resto }) => resto),
  }
}
