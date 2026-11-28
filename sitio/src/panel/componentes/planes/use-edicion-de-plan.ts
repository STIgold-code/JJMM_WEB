'use client'

import { useEffect, useRef, useState, useTransition } from 'react'

import { guardarElPlan } from '../../acciones/planes'
import type { EstadoDelGuardado } from '../../aplicacion/guardar-plan'
import {
  type CeldaDelFormulario,
  cambiarCelda,
  type FormularioDePlan,
  hayCambios,
} from '../../dominio/formulario-de-plan'
import type { ErroresDelPlan } from '../../dominio/validacion-de-plan'
import { avisarError, avisarExito } from '../mensajes/avisos'

type CambioDeCelda = Partial<Pick<CeldaDelFormulario, 'tipo' | 'texto'>>

function sinErrorDeCelda(errores: ErroresDelPlan, caracteristica: number): ErroresDelPlan {
  if (!errores.celdas?.[caracteristica]) return errores
  const celdas = { ...errores.celdas }
  delete celdas[caracteristica]
  return { ...errores, celdas }
}

// Errores que devolvió el servidor. Un error se borra cuando se corrige su campo; tras un
// intento rechazado (y solo entonces), el foco va al primer campo con error.
function useErroresDelServidor() {
  const [errores, setErrores] = useState<ErroresDelPlan>({})
  const [rechazos, setRechazos] = useState(0)
  const raiz = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (rechazos > 0) raiz.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }, [rechazos])

  return {
    raiz,
    errores,
    rechazar: (nuevos: ErroresDelPlan) => {
      setErrores(nuevos)
      setRechazos((cuenta) => cuenta + 1)
    },
    limpiar: () => setErrores({}),
    limpiarNombre: () => setErrores(({ nombre: _, ...resto }) => resto),
    limpiarCelda: (caracteristica: number) =>
      setErrores((actuales) => sinErrorDeCelda(actuales, caracteristica)),
  }
}

// Aviso breve y estado según lo que respondió el servidor al guardar.
function responder(
  resultado: EstadoDelGuardado,
  alGuardar: () => void,
  rechazar: (errores: ErroresDelPlan) => void,
): void {
  if (resultado.estado === 'guardado') {
    alGuardar()
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

// Estado de la edición de un plan: lo guardado (`original`) y lo que se está escribiendo.
// «Guardar cambios» se activa solo si hay cambios; al guardar bien, lo escrito pasa a ser lo
// guardado.
export function useEdicionDePlan(id: number, guardado: FormularioDePlan) {
  const [original, setOriginal] = useState(guardado)
  const [formulario, setFormulario] = useState(guardado)
  const [guardando, iniciar] = useTransition()
  const [guardadoRecien, setGuardadoRecien] = useState(false)
  const { raiz, errores, rechazar, limpiar, limpiarNombre, limpiarCelda } = useErroresDelServidor()
  const sucio = hayCambios(original, formulario)

  const alGuardar = () => {
    setOriginal(formulario)
    limpiar()
    setGuardadoRecien(true)
  }

  const guardar = () => {
    if (!sucio || guardando) return
    iniciar(async () => responder(await guardarElPlan(id, formulario), alGuardar, rechazar))
  }

  return {
    raiz,
    formulario,
    errores,
    sucio,
    guardando,
    guardadoRecien,
    guardar,
    cambiar: (cambio: Partial<Omit<FormularioDePlan, 'celdas'>>) => {
      setFormulario((actual) => ({ ...actual, ...cambio }))
      if ('nombre' in cambio) limpiarNombre()
    },
    cambiarCeldaDe: (caracteristica: number, cambio: CambioDeCelda) => {
      setFormulario((actual) => cambiarCelda(actual, caracteristica, cambio))
      limpiarCelda(caracteristica)
    },
    descartar: () => {
      setFormulario(original)
      limpiar()
    },
  }
}
