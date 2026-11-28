'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

import { crearLaSede, guardarLaSede } from '../../acciones/sedes'
import type { EstadoDelGuardadoDeSede } from '../../aplicacion/guardar-sede'
import { type FormularioDeSede, hayCambiosEnLaSede } from '../../dominio/formulario-de-sede'
import { rutaDeLaSede } from '../../dominio/sedes'
import type { ErroresDeSede } from '../../dominio/validacion-de-sede'
import { avisarError, avisarExito } from '../mensajes/avisos'
import { useErroresDeSede } from './use-errores-de-sede'

// Aviso breve y estado según lo que respondió el servidor al guardar o crear.
function responder(
  resultado: EstadoDelGuardadoDeSede,
  alGuardar: (idCreado: number | null) => void,
  rechazar: (errores: ErroresDeSede) => void,
): void {
  if (resultado.estado === 'guardado' || resultado.estado === 'creado') {
    alGuardar(resultado.estado === 'creado' ? resultado.id : null)
    avisarExito(resultado.aviso)
    return
  }
  if (resultado.estado === 'error') {
    avisarError(resultado.error)
    return
  }
  rechazar(resultado.errores)
  if (resultado.errores.general) avisarError(resultado.errores.general)
}

// Estado de la edición (o la creación, con `id` nulo) de una sede: lo guardado (`original`) y lo
// que se está escribiendo. «Guardar cambios» se activa solo si hay cambios; al guardar bien, lo
// escrito pasa a ser lo guardado. Al crear, se pasa a la edición de la sede nueva.
export function useEdicionDeSede(id: number | null, guardado: FormularioDeSede) {
  const router = useRouter()
  const [original, setOriginal] = useState(guardado)
  const [formulario, setFormulario] = useState(guardado)
  const [guardando, iniciar] = useTransition()
  const [guardadoRecien, setGuardadoRecien] = useState(false)
  // `raiz` (una ref) va aparte: el resto se puede leer al dibujar.
  const { raiz, errores, rechazar, ...limpiadores } = useErroresDeSede()
  const sucio = hayCambiosEnLaSede(original, formulario)

  const alGuardar = (idCreado: number | null) => {
    setOriginal(formulario)
    limpiadores.limpiar()
    setGuardadoRecien(true)
    if (idCreado !== null) router.replace(rutaDeLaSede(idCreado))
  }

  const guardar = () => {
    if (!sucio || guardando) return
    iniciar(async () => {
      const resultado =
        id === null ? await crearLaSede(formulario) : await guardarLaSede(id, formulario)
      responder(resultado, alGuardar, rechazar)
    })
  }

  return {
    raiz,
    erroresDelServidor: errores,
    limpiadores,
    formulario,
    setFormulario,
    sucio,
    guardando,
    guardadoRecien,
    guardar,
    descartar: () => {
      setFormulario(original)
      limpiadores.limpiar()
    },
  }
}
