'use client'

import { cn } from 'cn'

import type { Paginacion } from '../../dominio/lista-de-mensajes'
import type { ImagenElegida } from '../../dominio/selector-de-imagen'
import { Button } from '../ui/button'
import { MiniaturaDeImagen } from './miniatura-de-imagen'

interface PropsDeLaCuadricula {
  imagenes: ImagenElegida[]
  elegida: number | null
  alElegir: (imagen: ImagenElegida) => void
}

// Miniaturas de «Elegir de Imágenes»: cada una es un botón con `aria-pressed` (la elegida).
export function CuadriculaDeLaBiblioteca({ imagenes, elegida, alElegir }: PropsDeLaCuadricula) {
  if (imagenes.length === 0)
    return <p className="py-8 text-center text-muted-foreground">No hay imágenes que coincidan.</p>
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(8.5rem,1fr))] gap-3 max-sm:grid-cols-2">
      {imagenes.map((imagen) => (
        <li key={imagen.id} className="min-w-0">
          <button
            type="button"
            aria-pressed={imagen.id === elegida}
            onClick={() => alElegir(imagen)}
            className={cn(
              'grid w-full gap-[0.35rem] rounded-md border-2 border-transparent bg-card p-[0.35rem] text-left outline-none hover:border-border focus-visible:ring-[3px] focus-visible:ring-ring/50',
              'aria-pressed:border-primary aria-pressed:bg-accent',
            )}
          >
            <MiniaturaDeImagen
              url={imagen.url}
              alt={imagen.alt}
              sizes="9rem"
              className="rounded-sm"
            />
            <span className="truncate text-xs font-semibold">{imagen.nombre}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

interface PropsDePaginas {
  paginacion: Paginacion | undefined
  alIr: (pagina: number) => void
}

// «Anteriores» y «Siguientes» de la biblioteca; sin más de una página no se dibuja.
export function PaginasDeLaBiblioteca({ paginacion, alIr }: PropsDePaginas) {
  if (!paginacion || (!paginacion.anterior && !paginacion.siguiente)) return null
  const { anterior, siguiente } = paginacion
  return (
    <nav aria-label="Páginas de la biblioteca" className="flex justify-between gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!anterior}
        onClick={() => anterior && alIr(anterior)}
      >
        Anteriores
      </Button>
      <span className="self-center text-[0.8125rem] text-muted-foreground">
        Página {paginacion.pagina} de {paginacion.paginas}
      </span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!siguiente}
        onClick={() => siguiente && alIr(siguiente)}
      >
        Siguientes
      </Button>
    </nav>
  )
}
