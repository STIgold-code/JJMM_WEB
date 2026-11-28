import type { Dispatch, SetStateAction } from 'react'

import {
  agregarCelular,
  cambiarCelular,
  type CelularDelFormulario,
  type FormularioDeSede,
  moverCelular,
  quitarCelular,
} from '../../dominio/formulario-de-sede'
import type { LimpiadoresDeErrores } from './use-errores-de-sede'

export type CampoDeTexto = 'nombre' | 'direccion' | 'distrito' | 'ciudad' | 'correo' | 'mapa'
export type CambioDeCelular = Partial<Omit<CelularDelFormulario, 'clave'>>

export interface CambiosDelFormulario {
  cambiarTexto: (campo: CampoDeTexto, valor: string) => void
  cambiarVisible: (visible: boolean) => void
  cambiarCelular: (clave: number, indice: number, cambio: CambioDeCelular) => void
  agregarCelular: () => void
  quitarCelular: (clave: number) => void
  moverCelular: (desde: number, hacia: number) => void
}

// Cada cambio del formulario borra el error del servidor de lo que se tocó.
export function cambiosDelFormulario(
  setFormulario: Dispatch<SetStateAction<FormularioDeSede>>,
  errores: LimpiadoresDeErrores,
): CambiosDelFormulario {
  const enLaLista = (cambio: (actual: FormularioDeSede) => FormularioDeSede) => {
    setFormulario(cambio)
    errores.limpiarCelulares()
  }
  return {
    cambiarTexto: (campo, valor) => {
      setFormulario((actual) => ({ ...actual, [campo]: valor }))
      errores.limpiarCampo(campo)
    },
    cambiarVisible: (visible) => setFormulario((actual) => ({ ...actual, visible })),
    cambiarCelular: (clave, indice, cambio) => {
      setFormulario((actual) => cambiarCelular(actual, clave, cambio))
      errores.limpiarCelular(indice)
    },
    agregarCelular: () => enLaLista(agregarCelular),
    quitarCelular: (clave) => enLaLista((actual) => quitarCelular(actual, clave)),
    moverCelular: (desde, hacia) => enLaLista((actual) => moverCelular(actual, desde, hacia)),
  }
}
