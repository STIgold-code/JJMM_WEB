'use client'

import { cn } from 'cn'
import { Upload } from 'lucide-react'
import { type DragEvent, type ReactNode, useId, useRef, useState } from 'react'

import { TIPOS_ACEPTADOS } from '../../dominio/selector-de-imagen'
import { Button } from '../ui/button'

interface PropsDelBoton {
  texto: string
  multiple?: boolean
  alElegir: (archivos: File[]) => void
}

// Botón que abre el selector de archivos del sistema. El campo de archivo está oculto y el botón
// es el control accesible (teclado y lector de pantalla).
export function ElegirArchivos({ texto, multiple = false, alElegir }: PropsDelBoton) {
  const entrada = useRef<HTMLInputElement>(null)
  const id = useId()
  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="bg-card"
        onClick={() => entrada.current?.click()}
      >
        <Upload aria-hidden="true" />
        {texto}
      </Button>
      <input
        ref={entrada}
        id={id}
        type="file"
        accept={TIPOS_ACEPTADOS}
        multiple={multiple}
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
        onChange={(evento) => {
          alElegir([...(evento.target.files ?? [])])
          evento.target.value = ''
        }}
      />
    </>
  )
}

interface PropsDeLaZona {
  alSoltar: (archivos: File[]) => void
  className?: string
  children: ReactNode
}

// Zona para soltar imágenes arrastradas desde el escritorio (borde punteado de la maqueta). Con
// teclado se usa el botón «Elegir…» que va dentro; soltar es solo un atajo del mouse.
export function ZonaParaSoltar({ alSoltar, className, children }: PropsDeLaZona) {
  const [arrastrando, setArrastrando] = useState(false)
  const encima = (evento: DragEvent<HTMLDivElement>) => {
    evento.preventDefault()
    setArrastrando(true)
  }
  return (
    <div
      data-arrastrando={arrastrando}
      onDragEnter={encima}
      onDragOver={encima}
      onDragLeave={() => setArrastrando(false)}
      onDrop={(evento) => {
        evento.preventDefault()
        setArrastrando(false)
        alSoltar([...evento.dataTransfer.files])
      }}
      className={cn(
        'rounded-lg border-[1.5px] border-dashed border-input bg-background p-3 transition-colors data-[arrastrando=true]:border-primary data-[arrastrando=true]:bg-accent',
        className,
      )}
    >
      {children}
    </div>
  )
}
