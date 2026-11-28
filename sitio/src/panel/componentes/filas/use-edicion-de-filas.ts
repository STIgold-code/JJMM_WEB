'use client'

import { useState } from 'react'

import { guardarLasFilas } from '../../acciones/filas-de-la-tabla'
import {
  agregarFilaNueva,
  erroresEnVivoDeFilas,
  type FilaDelFormulario,
  filasParaGuardar,
  hayCambiosEnLasFilas,
} from '../../dominio/filas-de-la-tabla'
import { cambiarFila, moverFila, quitarFila } from '../../dominio/filas-editables'
import type { ErroresDeFilas } from '../../dominio/validacion-de-filas'
import { useEdicionEnPagina } from '../comunes/use-edicion-en-pagina'
import { useFocoTrasMover } from '../comunes/use-foco-tras-mover'

// Los errores del servidor van por posición; se muestran por la clave de cada fila. Lo que dijo el
// servidor gana a lo detectado en vivo.
function erroresPorClave(filas: readonly FilaDelFormulario[], servidor: ErroresDeFilas) {
  const enVivo = erroresEnVivoDeFilas(filas)
  filas.forEach((fila, posicion) => {
    const error = servidor.fila?.[posicion]
    if (error) enVivo[fila.clave] = error
  })
  return enVivo
}

// «Filas de la tabla»: la lista se edita entera (renombrar, ordenar, agregar, quitar) y se guarda
// con la barra, junto con los ids que se cargaron (`conocidas`): el servidor no borra una fila que
// esta pantalla no conocía. Cualquier cambio en la lista borra los errores del servidor (eran por
// posición), salvo el aviso de que la tabla cambió, que sigue hasta recargar.
export function useEdicionDeFilas(guardadas: FilaDelFormulario[], conocidas: number[]) {
  const { raiz, edicion } = useEdicionEnPagina<FilaDelFormulario[], ErroresDeFilas>({
    guardado: guardadas,
    hayCambios: hayCambiosEnLasFilas,
    guardarEnServidor: (filas) => guardarLasFilas(filasParaGuardar(conocidas, filas)),
  })
  const [anuncio, setAnuncio] = useState('')
  const { formulario: filas, setFormulario, setErrores } = edicion
  const pedirFoco = useFocoTrasMover(filas)
  const cambiar = (cambio: (actuales: FilaDelFormulario[]) => FilaDelFormulario[]) => {
    setFormulario(cambio)
    setErrores(({ tablaCambiada }) => (tablaCambiada ? { tablaCambiada } : {}))
  }
  const mover = (desde: number, hacia: number, paso?: -1 | 1) => {
    const fila = filas[desde]
    if (!fila || hacia < 0 || hacia >= filas.length || desde === hacia) return
    setAnuncio(
      `${fila.nombre.trim() || 'Fila sin nombre'}, posición ${hacia + 1} de ${filas.length}`,
    )
    if (paso) pedirFoco({ id: fila.clave, paso })
    cambiar((actuales) => moverFila(actuales, desde, hacia))
  }
  const cambios = {
    renombrar: (clave: number, nombre: string) => cambiar((a) => cambiarFila(a, clave, { nombre })),
    agregar: () => cambiar(agregarFilaNueva),
    quitar: (clave: number) => cambiar((actuales) => quitarFila(actuales, clave)),
    mover,
  }
  return {
    raiz,
    edicion,
    cambios,
    anuncio,
    errores: erroresPorClave(filas, edicion.errores),
    tablaCambiada: edicion.errores.tablaCambiada === true,
  }
}
