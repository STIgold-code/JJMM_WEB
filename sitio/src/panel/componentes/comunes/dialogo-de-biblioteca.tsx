'use client'

import { type ReactNode, useEffect, useState } from 'react'

import { listarImagenesParaElegir } from '../../acciones/imagenes'
import type { PaginaParaElegir } from '../../aplicacion/elegir-imagenes'
import type { ImagenElegida } from '../../dominio/selector-de-imagen'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Buscador } from './buscador'
import { CuadriculaDeLaBiblioteca, PaginasDeLaBiblioteca } from './cuadricula-de-la-biblioteca'

const ESPERA_MS = 300

interface Props {
  actual: ImagenElegida | null
  alUsar: (imagen: ImagenElegida) => void
  disparador: ReactNode
}

// Lee una página de la biblioteca en el servidor (con los permisos de la sesión) cada vez que
// cambian la búsqueda o la página, con una pausa corta mientras se escribe.
function usePaginaDeLaBiblioteca(busqueda: string, pagina: number) {
  const [datos, setDatos] = useState<PaginaParaElegir | null>(null)
  useEffect(() => {
    let vigente = true
    const espera = setTimeout(() => {
      void listarImagenesParaElegir(busqueda, pagina).then((leidos) => {
        if (vigente) setDatos(leidos)
      })
    }, ESPERA_MS)
    return () => {
      vigente = false
      clearTimeout(espera)
    }
  }, [busqueda, pagina])
  return datos
}

function Pie({
  elegida,
  actual,
  alUsar,
}: { elegida: ImagenElegida | null } & Omit<Props, 'disparador'>) {
  return (
    <DialogFooter>
      <DialogClose asChild>
        <Button type="button" variant="outline" className="bg-card">
          Cancelar
        </Button>
      </DialogClose>
      <Button
        type="button"
        disabled={!elegida || elegida.id === actual?.id}
        className="hover:bg-primary-hover"
        onClick={() => elegida && alUsar(elegida)}
      >
        Usar esta imagen
      </Button>
    </DialogFooter>
  )
}

function Contenido({ actual, alUsar }: Omit<Props, 'disparador'>) {
  const [busqueda, setBusqueda] = useState('')
  const [pagina, setPagina] = useState(1)
  const [elegida, setElegida] = useState<ImagenElegida | null>(actual)
  const datos = usePaginaDeLaBiblioteca(busqueda.trim(), pagina)
  return (
    <>
      <DialogHeader>
        <DialogTitle>Elegir de Imágenes</DialogTitle>
        <DialogDescription>Imágenes que ya están en el sitio.</DialogDescription>
      </DialogHeader>
      <Buscador
        id="buscar-en-la-biblioteca"
        etiqueta="Buscar en la biblioteca"
        placeholder="Buscar por nombre o descripción"
        valor={busqueda}
        alCambiar={(texto) => {
          setBusqueda(texto)
          setPagina(1)
        }}
      />
      <div aria-busy={datos === null} className="min-h-40">
        {datos ? (
          <CuadriculaDeLaBiblioteca
            imagenes={datos.imagenes}
            elegida={elegida?.id ?? null}
            alElegir={setElegida}
          />
        ) : (
          <p className="py-8 text-center text-muted-foreground">Cargando imágenes…</p>
        )}
      </div>
      <PaginasDeLaBiblioteca paginacion={datos?.paginacion} alIr={setPagina} />
      <Pie elegida={elegida} actual={actual} alUsar={alUsar} />
    </>
  )
}

// «Elegir de Imágenes»: la biblioteca con buscador y páginas en un diálogo. Al cerrarlo se
// desmonta y la próxima vez empieza de nuevo; el foco vuelve al botón que lo abrió.
export function DialogoDeBiblioteca({ actual, alUsar, disparador }: Props) {
  const [abierto, setAbierto] = useState(false)
  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger asChild>{disparador}</DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto bg-card sm:max-w-2xl">
        <Contenido
          actual={actual}
          alUsar={(imagen) => {
            alUsar(imagen)
            setAbierto(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
