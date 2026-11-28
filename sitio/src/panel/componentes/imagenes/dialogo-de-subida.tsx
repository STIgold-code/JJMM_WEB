'use client'

import { Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { CLASE_DE_AYUDA } from '../comunes/campo'
import { ElegirArchivos, ZonaParaSoltar } from '../comunes/zona-para-soltar'
import { avisarExito } from '../mensajes/avisos'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { FilaDeSubida } from './fila-de-subida'
import { useColaDeSubida } from './use-cola-de-subida'

const textoDeSubir = (pendientes: number): string =>
  pendientes === 1 ? 'Subir 1 imagen' : `Subir ${pendientes} imágenes`

const avisoDeSubida = (subidas: number) => ({
  titulo: subidas === 1 ? 'Imagen subida' : `${subidas} imágenes subidas`,
  detalle: 'Ya están en la biblioteca.',
})

// Contenido del diálogo. Vive dentro de `DialogContent`: al cerrarlo se desmonta y la próxima
// vez empieza con la cola vacía (y libera las vistas previas).
function Subida({ alTerminar }: { alTerminar: () => void }) {
  const router = useRouter()
  const subida = useColaDeSubida(() => router.refresh())
  const { cola, pendientes, subiendo } = subida
  const subirTodas = async () => {
    const subidas = await subida.subirTodas()
    if (subidas > 0) avisarExito(avisoDeSubida(subidas))
  }
  return (
    <div className="grid gap-4">
      <DialogHeader>
        <DialogTitle>Subir imágenes</DialogTitle>
        <DialogDescription>
          Cada imagen necesita su texto alternativo: lo que leen los lectores de pantalla y Google.
        </DialogDescription>
      </DialogHeader>
      <Zona alAgregar={subida.agregar} />
      {cola.length > 0 && (
        <ul aria-label="Imágenes por subir" className="grid">
          {cola.map((item) => (
            <FilaDeSubida
              key={item.clave}
              item={item}
              alCambiarAlt={(alt) => subida.cambiarAlt(item.clave, alt)}
              alQuitar={() => subida.quitar(item.clave)}
            />
          ))}
        </ul>
      )}
      <Pie pendientes={pendientes} subiendo={subiendo} alCerrar={alTerminar} alSubir={subirTodas} />
    </div>
  )
}

function Zona({ alAgregar }: { alAgregar: (archivos: File[]) => void }) {
  return (
    <ZonaParaSoltar
      alSoltar={alAgregar}
      className="grid justify-items-center gap-2 py-6 text-center"
    >
      <Upload aria-hidden="true" className="size-6 text-muted-foreground" />
      <p className={CLASE_DE_AYUDA}>
        Arrastra las imágenes aquí o elígelas. JPG, PNG, WebP o AVIF, hasta 10 MB.
      </p>
      <ElegirArchivos texto="Elegir imágenes" multiple alElegir={alAgregar} />
    </ZonaParaSoltar>
  )
}

interface PropsDelPie {
  pendientes: number
  subiendo: boolean
  alCerrar: () => void
  alSubir: () => void
}

function Pie({ pendientes, subiendo, alCerrar, alSubir }: PropsDelPie) {
  return (
    <DialogFooter>
      <Button
        type="button"
        variant="outline"
        className="bg-card"
        disabled={subiendo}
        onClick={alCerrar}
      >
        Cerrar
      </Button>
      <Button
        type="button"
        disabled={pendientes === 0 || subiendo}
        className="hover:bg-primary-hover"
        onClick={alSubir}
      >
        {subiendo ? 'Subiendo…' : textoDeSubir(pendientes)}
      </Button>
    </DialogFooter>
  )
}

// «Subir imágenes» de la cabecera: un diálogo con la zona para soltar y una fila por imagen.
export function DialogoDeSubida() {
  const [abierto, setAbierto] = useState(false)
  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger asChild>
        <Button type="button" className="hover:bg-primary-hover max-sm:w-full">
          <Upload aria-hidden="true" />
          Subir imágenes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto bg-card sm:max-w-xl">
        <Subida alTerminar={() => setAbierto(false)} />
      </DialogContent>
    </Dialog>
  )
}
