import type { Dispatch, SetStateAction } from 'react'

import type { BotonDelFormulario, FormularioDelCarrusel } from '../../dominio/carrusel-de-portadas'
import {
  agregarBoton,
  agregarPortada,
  cambiarBoton,
  type CambioDePortada,
  cambiarPortada,
  moverPortada,
  quitarBoton,
  quitarPortada,
} from '../../dominio/edicion-del-carrusel'
import type { ErroresDelCarrusel } from '../../dominio/errores-del-carrusel'
import {
  sinErroresDeBotones,
  sinErroresDeCampos,
  sinErroresDePortadas,
} from '../../dominio/errores-en-edicion'

interface Estado {
  formulario: FormularioDelCarrusel
  setFormulario: Dispatch<SetStateAction<FormularioDelCarrusel>>
  setErrores: Dispatch<SetStateAction<ErroresDelCarrusel>>
  seleccionar: (clave: number | null) => void
}

export type CambioDeBoton = Partial<Omit<BotonDelFormulario, 'clave'>>

// Agregar, quitar o mover portadas: los errores por posición ya no corresponden.
function cambiosDeLaLista({ formulario, setFormulario, setErrores, seleccionar }: Estado) {
  const reemplazar = (nuevo: FormularioDelCarrusel) => {
    setFormulario(nuevo)
    setErrores(sinErroresDePortadas)
  }
  return {
    agregarPortada: () => {
      const nuevo = agregarPortada(formulario)
      reemplazar(nuevo)
      seleccionar(nuevo.portadas.at(-1)?.clave ?? null)
    },
    quitarPortada: (clave: number) => {
      const nuevo = quitarPortada(formulario, clave)
      reemplazar(nuevo)
      seleccionar(nuevo.portadas[0]?.clave ?? null)
    },
    moverPortada: (desde: number, hacia: number) =>
      reemplazar(moverPortada(formulario, desde, hacia)),
  }
}

// Los botones de una portada se identifican por la clave de la portada y la del botón.
function cambiosDeBotones({ setFormulario, setErrores }: Estado) {
  const aplicar = (indice: number, cambio: (f: FormularioDelCarrusel) => FormularioDelCarrusel) => {
    setFormulario(cambio)
    setErrores((e) => sinErroresDeBotones(e, indice))
  }
  return {
    agregarBoton: (clave: number, indice: number) => aplicar(indice, (f) => agregarBoton(f, clave)),
    quitarBoton: (clave: number, indice: number, boton: number) =>
      aplicar(indice, (f) => quitarBoton(f, clave, boton)),
    cambiarBoton: (clave: number, indice: number, boton: number, cambio: CambioDeBoton) =>
      aplicar(indice, (f) => cambiarBoton(f, clave, boton, cambio)),
  }
}

export type CambiosDelCarrusel = ReturnType<typeof cambiosDelCarrusel>

// Lo que se puede cambiar en el formulario del carrusel. Cada cambio borra los errores que ya no
// corresponden: el del campo corregido o, si cambia la lista de portadas, los de posición.
export function cambiosDelCarrusel(estado: Estado) {
  const { setFormulario, setErrores } = estado
  return {
    cambiarSegundos: (segundosPorPortada: string) => {
      setFormulario((f) => ({ ...f, segundosPorPortada }))
      setErrores(({ segundos: _, ...resto }) => resto)
    },
    cambiarPortada: (clave: number, indice: number, cambio: CambioDePortada) => {
      setFormulario((f) => cambiarPortada(f, clave, cambio))
      setErrores((e) => sinErroresDeCampos(e, indice, Object.keys(cambio)))
    },
    ...cambiosDeLaLista(estado),
    ...cambiosDeBotones(estado),
  }
}
