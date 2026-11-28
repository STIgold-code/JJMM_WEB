'use client'

import { useState, useTransition } from 'react'

import { guardarElCarrusel } from '../../acciones/pagina-de-inicio'
import type { FormularioDelCarrusel } from '../../dominio/carrusel-de-portadas'
import type { ErroresDelCarrusel } from '../../dominio/errores-del-carrusel'
import { avisarError, avisarExito } from '../mensajes/avisos'

const REVISA_LOS_CAMPOS = 'Revisa los campos marcados antes de guardar.'

// Guardar el carrusel y avisar el resultado. `desactualizada`: el servidor no guardó porque la
// página cambió desde que se abrió el formulario.
export function useGuardadoDelCarrusel() {
  const [guardando, iniciar] = useTransition()
  const [guardadoRecien, setGuardadoRecien] = useState(false)
  const [desactualizada, setDesactualizada] = useState(false)

  const guardar = (
    formulario: FormularioDelCarrusel,
    alGuardar: (actualizadoEn: string) => void,
    rechazar: (errores: ErroresDelCarrusel) => void,
  ) => {
    iniciar(async () => {
      const resultado = await guardarElCarrusel(formulario)
      if (resultado.estado === 'guardado') {
        setGuardadoRecien(true)
        alGuardar(resultado.actualizadoEn)
        avisarExito(resultado.aviso)
      } else if (resultado.estado === 'error') {
        setDesactualizada(resultado.desactualizada)
        avisarError(resultado.error)
      } else {
        rechazar(resultado.errores)
        avisarError(resultado.errores.general ?? resultado.errores.portadas ?? REVISA_LOS_CAMPOS)
      }
    })
  }

  return { guardando, guardadoRecien, desactualizada, guardar }
}
