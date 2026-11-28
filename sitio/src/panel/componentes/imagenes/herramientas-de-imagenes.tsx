'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import {
  type FiltroDeImagenes,
  type FiltroDeImagenesConConteo,
  rutaDeImagenes,
} from '../../dominio/imagenes'
import { Buscador } from '../comunes/buscador'
import { FiltrosSegmentados } from '../comunes/filtros-segmentados'

interface Props {
  filtros: FiltroDeImagenesConConteo[]
  filtro: FiltroDeImagenes
  busqueda: string
}

const ESPERA_MS = 350

// Filtros con conteo y buscador de la biblioteca. Los dos viven en la URL (la lista se pagina en
// el servidor): elegir un filtro o escribir vuelve a la primera página y cierra la imagen abierta.
export function HerramientasDeImagenes({ filtros, filtro, busqueda }: Props) {
  const router = useRouter()
  const [texto, setTexto] = useState(busqueda)
  const ir = (cambios: { filtro?: FiltroDeImagenes; busqueda?: string }) =>
    router.replace(rutaDeImagenes({ filtro, busqueda, ...cambios }), { scroll: false })

  useEffect(() => {
    const limpio = texto.trim()
    if (limpio === busqueda) return
    const espera = setTimeout(
      () => router.replace(rutaDeImagenes({ filtro, busqueda: limpio }), { scroll: false }),
      ESPERA_MS,
    )
    return () => clearTimeout(espera)
  }, [texto, busqueda, filtro, router])

  return (
    <div className="flex flex-wrap items-center gap-3 border-b px-4 py-[0.85rem]">
      <FiltrosSegmentados
        aria-label="Filtrar por uso"
        opciones={filtros}
        actual={filtro}
        alElegir={(valor) => ir({ filtro: valor })}
      />
      <Buscador
        id="buscar-imagenes"
        etiqueta="Buscar imágenes"
        placeholder="Buscar por nombre o uso"
        valor={texto}
        alCambiar={setTexto}
      />
    </div>
  )
}
