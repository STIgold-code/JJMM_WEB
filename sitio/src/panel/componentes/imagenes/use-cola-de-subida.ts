'use client'

import { useEffect, useRef, useState } from 'react'

import { prevalidarArchivo } from '../../dominio/selector-de-imagen'
import { type ErroresDeSubida, validarTextoAlternativo } from '../../dominio/subida-de-imagenes'
import { subirImagen } from '../comunes/subir-imagen'

export type EstadoDelArchivo = 'pendiente' | 'subiendo' | 'subida' | 'error'

export interface ArchivoEnCola {
  clave: string
  archivo: File
  // Vista previa local (`blob:`), se libera al quitarlo o al cerrar.
  vista: string
  alt: string
  estado: EstadoDelArchivo
  progreso: number
  errores: ErroresDeSubida
}

let contador = 0

function enCola(archivo: File): ArchivoEnCola {
  contador += 1
  const error = prevalidarArchivo({ tamano: archivo.size, tipo: archivo.type })
  return {
    clave: `archivo-${contador}`,
    archivo,
    vista: URL.createObjectURL(archivo),
    alt: '',
    estado: error ? 'error' : 'pendiente',
    progreso: 0,
    errores: error ? { archivo: error } : {},
  }
}

// Se puede subir lo pendiente y lo que falló por el texto o el servidor; no lo que se rechazó por
// el archivo (tipo o tamaño), que hay que quitar.
const porSubir = (item: ArchivoEnCola): boolean =>
  item.estado === 'pendiente' || (item.estado === 'error' && !item.errores.archivo)

type Cambiar = (clave: string, cambios: Partial<ArchivoEnCola>) => void

// `true` si la imagen quedó subida.
async function subirDeLaCola(item: ArchivoEnCola, cambiar: Cambiar): Promise<boolean> {
  const alt = validarTextoAlternativo(item.alt)
  if (!alt.valido) {
    cambiar(item.clave, { estado: 'error', errores: { alt: alt.error } })
    return false
  }
  cambiar(item.clave, { estado: 'subiendo', progreso: 0, errores: {} })
  const avance = (progreso: number) => cambiar(item.clave, { progreso })
  const respuesta = await subirImagen(item.archivo, alt.alt, avance)
  if (respuesta.estado === 'subida') {
    cambiar(item.clave, { estado: 'subida', progreso: 100 })
    return true
  }
  const errores = respuesta.estado === 'error' ? { general: respuesta.error } : respuesta.errores
  cambiar(item.clave, { estado: 'error', errores })
  return false
}

const sinErrorDeAlt = ({ alt: _alt, ...resto }: ErroresDeSubida): ErroresDeSubida => resto

// Cola de la subida múltiple: cada archivo con su texto alternativo, su avance y su resultado.
// Se suben de a uno, así el avance de cada fila es real y el servidor no recibe una ráfaga.
export function useColaDeSubida(alSubirUna: () => void) {
  const [cola, setCola] = useState<ArchivoEnCola[]>([])
  const vistas = useRef(new Set<string>())
  useEffect(() => {
    const abiertas = vistas.current
    return () => abiertas.forEach((vista) => URL.revokeObjectURL(vista))
  }, [])

  const cambiar: Cambiar = (clave, cambios) =>
    setCola((actual) =>
      actual.map((item) => (item.clave === clave ? { ...item, ...cambios } : item)),
    )

  return {
    cola,
    pendientes: cola.filter(porSubir).length,
    subiendo: cola.some((item) => item.estado === 'subiendo'),
    agregar: (archivos: File[]) => {
      const nuevos = archivos.map(enCola)
      nuevos.forEach((item) => vistas.current.add(item.vista))
      setCola((actual) => [...actual, ...nuevos])
    },
    cambiarAlt: (clave: string, alt: string) =>
      setCola((actual) =>
        actual.map((item) =>
          item.clave === clave ? { ...item, alt, errores: sinErrorDeAlt(item.errores) } : item,
        ),
      ),
    quitar: (clave: string) => setCola((actual) => actual.filter((item) => item.clave !== clave)),
    // Devuelve cuántas quedaron subidas; tras cada una, `alSubirUna` (refresca la galería).
    subirTodas: async (): Promise<number> => {
      let subidas = 0
      for (const item of cola.filter(porSubir)) {
        if (!(await subirDeLaCola(item, cambiar))) continue
        subidas += 1
        alSubirUna()
      }
      return subidas
    },
  }
}
