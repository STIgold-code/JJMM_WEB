'use client'

import { useState, useTransition } from 'react'

import { cambiarLaContrasenaPropia } from '../../acciones/cuenta'
import type { ErroresDeClave } from '../../dominio/validacion-de-mi-cuenta'
import { avisarError, avisarExito } from '../mensajes/avisos'

export interface Claves {
  actual: string
  nueva: string
  repetida: string
}

const VACIAS: Claves = { actual: '', nueva: '', repetida: '' }

// Estado del cambio de contraseña. El servidor valida y verifica todo; la respuesta nunca trae
// contraseñas. Tras cualquier respuesta los tres campos se vacían: una contraseña no se queda
// escrita en la pantalla. La sesión de este navegador sigue abierta (Payload la conserva).
export function useCambioDeClave() {
  const [claves, setClaves] = useState<Claves>(VACIAS)
  const [errores, setErrores] = useState<ErroresDeClave>({})
  const [cambiando, iniciar] = useTransition()

  const cambiar = (campo: keyof Claves, valor: string) => {
    setClaves((actuales) => ({ ...actuales, [campo]: valor }))
    setErrores((actuales) => {
      const resto = { ...actuales }
      delete resto[campo]
      return resto
    })
  }

  const enviar = () => {
    if (cambiando) return
    iniciar(async () => {
      const estado = await cambiarLaContrasenaPropia(claves)
      setClaves(VACIAS)
      if (estado.estado === 'cambiada') {
        setErrores({})
        avisarExito(estado.aviso)
      } else if (estado.estado === 'error') avisarError(estado.error)
      else setErrores(estado.errores)
      if (estado.estado === 'invalido' && estado.errores.general)
        avisarError(estado.errores.general)
    })
  }

  return { claves, errores, cambiando, cambiar, enviar }
}
