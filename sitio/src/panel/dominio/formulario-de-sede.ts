import { esCelularPeruano, normalizarCelular } from '@/compartido/dominio/celular'
import { esMapaIncrustadoDeGoogle } from '@/modulos/sedes/dominio/mapa-de-sede'

import { moverEnLista } from './orden'
import { ERROR_DE_CELULAR } from './respuesta-al-mensaje'
import type { SedeDelPanel } from './sedes'
import { ERROR_DE_MAPA, type ErroresDeSede } from './validacion-de-sede'

// Formulario de edición de una sede, tal como se escribe (el servidor recorta y da formato). Cada
// celular lleva una `clave` estable para la lista de React; no se guarda.
export interface CelularDelFormulario {
  clave: number
  numero: string
  tieneWhatsApp: boolean
}

export interface FormularioDeSede {
  nombre: string
  direccion: string
  distrito: string
  ciudad: string
  celulares: CelularDelFormulario[]
  correo: string
  mapa: string
  visible: boolean
}

const celularVacio = (clave: number): CelularDelFormulario => ({
  clave,
  numero: '',
  tieneWhatsApp: false,
})

// Una sede nueva: «Lima» es el valor inicial de la colección; empieza oculta, como un plan nuevo,
// hasta que se encienda «Visible en el sitio».
export const FORMULARIO_DE_SEDE_NUEVA: FormularioDeSede = {
  nombre: '',
  direccion: '',
  distrito: '',
  ciudad: 'Lima',
  celulares: [celularVacio(1)],
  correo: '',
  mapa: '',
  visible: false,
}

export function formularioDeSedeGuardada(sede: SedeDelPanel): FormularioDeSede {
  return {
    nombre: sede.nombre,
    direccion: sede.direccion,
    distrito: sede.distrito,
    ciudad: sede.ciudad,
    celulares: sede.celulares.map((celular, indice) => ({ clave: indice + 1, ...celular })),
    correo: sede.correo ?? '',
    mapa: sede.mapa ?? '',
    visible: sede.visible,
  }
}

const conCelulares = (formulario: FormularioDeSede, celulares: CelularDelFormulario[]) => ({
  ...formulario,
  celulares,
})

export function agregarCelular(formulario: FormularioDeSede): FormularioDeSede {
  const clave = Math.max(0, ...formulario.celulares.map((c) => c.clave)) + 1
  return conCelulares(formulario, [...formulario.celulares, celularVacio(clave)])
}

// La colección exige al menos un celular: la última fila no se quita.
export function quitarCelular(formulario: FormularioDeSede, clave: number): FormularioDeSede {
  if (formulario.celulares.length <= 1) return formulario
  return conCelulares(
    formulario,
    formulario.celulares.filter((c) => c.clave !== clave),
  )
}

export function moverCelular(
  formulario: FormularioDeSede,
  desde: number,
  hacia: number,
): FormularioDeSede {
  return conCelulares(formulario, moverEnLista(formulario.celulares, desde, hacia))
}

export function cambiarCelular(
  formulario: FormularioDeSede,
  clave: number,
  cambio: Partial<Omit<CelularDelFormulario, 'clave'>>,
): FormularioDeSede {
  return conCelulares(
    formulario,
    formulario.celulares.map((c) => (c.clave === clave ? { ...c, ...cambio } : c)),
  )
}

// Valor que se guardaría: textos recortados y celulares sin espacios, en su orden.
const claveDelFormulario = (f: FormularioDeSede): string =>
  JSON.stringify([
    [f.nombre, f.direccion, f.distrito, f.ciudad, f.correo, f.mapa].map((t) => t.trim()),
    f.visible,
    f.celulares.map((c) => [normalizarCelular(c.numero), c.tieneWhatsApp]),
  ])

// «Guardar cambios» se activa solo si lo que se guardaría difiere de lo guardado.
export function hayCambiosEnLaSede(original: FormularioDeSede, actual: FormularioDeSede): boolean {
  return claveDelFormulario(original) !== claveDelFormulario(actual)
}

// Errores visibles mientras se escribe (como la maqueta): celulares que no son celulares y un
// mapa que no es un mapa insertado. Una fila vacía todavía no es un error. El servidor vuelve a
// validar todo.
export function erroresEnVivoDeSede({ celulares, mapa }: FormularioDeSede): ErroresDeSede {
  const celular: Record<number, string> = {}
  celulares.forEach(({ numero }, indice) => {
    if (numero.trim() !== '' && !esCelularPeruano(numero)) celular[indice] = ERROR_DE_CELULAR
  })
  const mapaInvalido = mapa.trim() !== '' && !esMapaIncrustadoDeGoogle(mapa)
  return {
    ...(Object.keys(celular).length > 0 ? { celular } : {}),
    ...(mapaInvalido ? { mapa: ERROR_DE_MAPA } : {}),
  }
}

// Lo que dijo el servidor de un campo gana a lo detectado en vivo.
export function unirErroresDeSede(enVivo: ErroresDeSede, servidor: ErroresDeSede): ErroresDeSede {
  const celular = { ...enVivo.celular, ...servidor.celular }
  return {
    ...enVivo,
    ...servidor,
    ...(Object.keys(celular).length > 0 ? { celular } : {}),
  }
}
