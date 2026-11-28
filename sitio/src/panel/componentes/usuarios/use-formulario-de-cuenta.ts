'use client'

import { useState, useTransition } from 'react'

import { crearElUsuario, guardarElUsuario } from '../../acciones/usuarios'
import {
  type FormularioDeCuenta,
  formularioDeCuenta,
  hayCambiosEnLaCuenta,
  type UsuarioDelPanel,
} from '../../dominio/usuarios'
import type { ErroresDeUsuario } from '../../dominio/validacion-de-usuario'
import { avisarError, avisarExito } from '../mensajes/avisos'

// Estado del diálogo de una cuenta (nueva, con `cuenta` nula, o la de otra persona). El servidor
// valida todo de nuevo; aquí solo se guarda lo escrito y los errores que devolvió. Tras cualquier
// rechazo la contraseña escrita se borra del campo: nunca se conserva ni vuelve del servidor.
export function useFormularioDeCuenta(cuenta: UsuarioDelPanel | null, alGuardar: () => void) {
  const [original] = useState(() => formularioDeCuenta(cuenta))
  const [formulario, setFormulario] = useState(original)
  const [errores, setErrores] = useState<ErroresDeUsuario>({})
  const [guardando, iniciar] = useTransition()
  const sucio = cuenta === null || hayCambiosEnLaCuenta(original, formulario)

  const cambiar = <C extends keyof FormularioDeCuenta>(campo: C, valor: FormularioDeCuenta[C]) => {
    setFormulario((actual) => ({ ...actual, [campo]: valor }))
    setErrores((actuales) => {
      const resto = { ...actuales }
      delete resto[campo]
      return resto
    })
  }

  const guardar = () => {
    if (!sucio || guardando) return
    iniciar(async () => {
      const estado = cuenta
        ? await guardarElUsuario(cuenta.id, formulario)
        : await crearElUsuario(formulario)
      if (estado.estado === 'guardado') {
        avisarExito(estado.aviso)
        alGuardar()
        return
      }
      setFormulario((actual) => ({ ...actual, clave: '' }))
      if (estado.estado === 'error') avisarError(estado.error)
      else setErrores(estado.errores)
      if (estado.estado === 'invalido' && estado.errores.general)
        avisarError(estado.errores.general)
    })
  }

  return { formulario, errores, guardando, sucio, cambiar, guardar }
}
