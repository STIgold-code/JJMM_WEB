'use client'

import { guardarElArea } from '../../acciones/areas'
import {
  agregarPunto,
  cambiarPunto,
  type FormularioDeArea,
  formularioParaGuardar,
  hayCambiosEnElArea,
  moverPunto,
  quitarPunto,
} from '../../dominio/formulario-de-area'
import type { ErroresDeArea } from '../../dominio/validacion-de-area'
import { type EdicionEnPagina, useEdicionEnPagina } from '../comunes/use-edicion-en-pagina'
import { useFocoTrasMover } from '../comunes/use-foco-tras-mover'

export type CampoDeTextoDelArea = 'nombre' | 'nombreCorto' | 'descripcion' | 'mensaje' | 'poligono'

export interface CambiosDelArea {
  cambiarTexto: (campo: CampoDeTextoDelArea, valor: string) => void
  cambiarPunto: (clave: number, indice: number, texto: string) => void
  agregarPunto: () => void
  quitarPunto: (clave: number) => void
  moverPunto: (desde: number, hacia: number, paso?: -1 | 1) => void
}

function sinErrorDePunto(errores: Partial<ErroresDeArea>, indice: number) {
  if (!errores.punto?.[indice]) return errores
  const punto = { ...errores.punto }
  delete punto[indice]
  return { ...errores, punto }
}

// Cada cambio borra el error del servidor de lo que se tocó. Al agregar, quitar o mover puntos,
// los errores por posición ya no corresponden y se borran.
function cambiosDelArea(edicion: EdicionEnPagina<FormularioDeArea, ErroresDeArea>): CambiosDelArea {
  const { setFormulario, setErrores } = edicion
  const enLaLista = (cambio: (actual: FormularioDeArea) => FormularioDeArea) => {
    setFormulario(cambio)
    setErrores(({ punto: _, puntos: __, ...resto }) => resto)
  }
  return {
    cambiarTexto: (campo, valor) => {
      setFormulario((actual) => ({ ...actual, [campo]: valor }))
      setErrores(({ [campo]: _, ...resto }) => resto)
    },
    cambiarPunto: (clave, indice, texto) => {
      setFormulario((actual) => cambiarPunto(actual, clave, texto))
      setErrores((actuales) => sinErrorDePunto(actuales, indice))
    },
    agregarPunto: () => enLaLista(agregarPunto),
    quitarPunto: (clave) => enLaLista((actual) => quitarPunto(actual, clave)),
    moverPunto: (desde, hacia) => enLaLista((actual) => moverPunto(actual, desde, hacia)),
  }
}

// Edición de un área en su página, con la barra de guardado. Tras mover un punto con sus
// flechas, el foco vuelve a la flecha de ese punto en su lugar nuevo.
export function useEdicionDeArea(id: number, guardado: FormularioDeArea) {
  const { raiz, edicion } = useEdicionEnPagina<FormularioDeArea, ErroresDeArea>({
    guardado,
    hayCambios: hayCambiosEnElArea,
    guardarEnServidor: (formulario) => guardarElArea(id, formularioParaGuardar(formulario)),
  })
  const pedirFoco = useFocoTrasMover(edicion.formulario.puntos)
  const cambios = cambiosDelArea(edicion)
  const moverPunto: CambiosDelArea['moverPunto'] = (desde, hacia, paso) => {
    const punto = edicion.formulario.puntos[desde]
    if (punto && paso) pedirFoco({ id: punto.clave, paso })
    cambios.moverPunto(desde, hacia)
  }
  return { raiz, edicion, cambios: { ...cambios, moverPunto } }
}
