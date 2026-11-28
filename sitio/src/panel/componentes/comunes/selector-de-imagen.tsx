'use client'

import { ImageIcon, X } from 'lucide-react'
import { useState } from 'react'

import {
  type ImagenElegida,
  prevalidarArchivo,
  puedeQuitarImagen,
  resumenDeImagen,
} from '../../dominio/selector-de-imagen'
import { Button } from '../ui/button'
import { CLASE_DE_AYUDA } from './campo'
import { DialogoDeBiblioteca } from './dialogo-de-biblioteca'
import { type ArchivoElegido, DialogoDeSubidaUnica } from './dialogo-de-subida-unica'
import { MensajeDeError } from './mensaje-de-error'
import { MiniaturaDeImagen } from './miniatura-de-imagen'
import { ElegirArchivos, ZonaParaSoltar } from './zona-para-soltar'

interface Props {
  id: string
  etiqueta: string
  // Controlado: el id que se guarda en el formulario y los datos de su miniatura.
  valor: ImagenElegida | null
  alCambiar: (valor: ImagenElegida | null) => void
  // Un campo opcional ofrece «Quitar».
  opcional?: boolean
  ayuda?: string
  error?: string
}

// Elegir un archivo: lo que el navegador ya sabe que se rechazará se avisa sin subirlo; si no,
// se abre el diálogo que pide el texto alternativo.
function useArchivoElegido() {
  const [elegido, setElegido] = useState<ArchivoElegido | null>(null)
  const [rechazo, setRechazo] = useState<string | null>(null)
  const elegir = ([archivo]: File[]) => {
    if (!archivo) return
    const error = prevalidarArchivo({ tamano: archivo.size, tipo: archivo.type })
    setRechazo(error)
    if (!error) setElegido({ archivo, vista: URL.createObjectURL(archivo) })
  }
  const soltar = () => {
    if (elegido) URL.revokeObjectURL(elegido.vista)
    setElegido(null)
  }
  return { elegido, rechazo, elegir, soltar }
}

function Zona(props: Props & { alElegirArchivo: (archivos: File[]) => void }) {
  const { id, valor, ayuda } = props
  return (
    <ZonaParaSoltar
      alSoltar={props.alElegirArchivo}
      className="grid grid-cols-[9rem_minmax(0,1fr)] items-center gap-4 max-sm:grid-cols-[minmax(0,1fr)]"
    >
      <MiniaturaDeImagen
        url={valor?.url ?? null}
        alt={valor ? `Imagen actual: ${valor.alt}` : 'Sin imagen'}
        sizes="(max-width: 640px) 100vw, 9rem"
        className="h-24 rounded-md max-sm:h-36"
      />
      <div className="grid min-w-0 gap-[0.4rem] text-sm">
        <strong className="truncate">{valor ? valor.nombre : 'Sin imagen'}</strong>
        <p id={`${id}-ayuda`} className={CLASE_DE_AYUDA}>
          {valor && `${resumenDeImagen(valor)}. `}
          {ayuda ?? 'Arrastra una imagen aquí o elige una.'}
        </p>
        <Acciones {...props} />
      </div>
    </ZonaParaSoltar>
  )
}

// Campo de imagen del panel (maqueta «Portadas»): miniatura actual, «Subir imagen» (o soltar un
// archivo), «Elegir de Imágenes» y, si el campo es opcional, «Quitar». No sabe de Payload: sube
// por el manejador del panel y lee la biblioteca con una acción de servidor.
export function SelectorDeImagen(props: Props) {
  const { id, etiqueta, alCambiar, error } = props
  const archivo = useArchivoElegido()
  const aviso = error ?? archivo.rechazo
  const describe = [`${id}-ayuda`, aviso && `${id}-error`].filter(Boolean).join(' ')
  return (
    <div
      role="group"
      aria-labelledby={`${id}-etiqueta`}
      aria-describedby={describe}
      className="grid gap-[0.4rem]"
    >
      <span id={`${id}-etiqueta`} className="text-sm font-semibold">
        {etiqueta}
      </span>
      <Zona {...props} alElegirArchivo={archivo.elegir} />
      {aviso && <MensajeDeError id={`${id}-error`} texto={aviso} />}
      <DialogoDeSubidaUnica
        elegido={archivo.elegido}
        alCerrar={archivo.soltar}
        alSubir={(imagen) => {
          archivo.soltar()
          alCambiar(imagen)
        }}
      />
    </div>
  )
}

function Acciones(props: Props & { alElegirArchivo: (archivos: File[]) => void }) {
  const { valor, alCambiar, opcional = false } = props
  return (
    <div className="flex flex-wrap gap-2">
      <ElegirArchivos texto="Subir imagen" alElegir={props.alElegirArchivo} />
      <DialogoDeBiblioteca
        actual={valor}
        alUsar={alCambiar}
        disparador={
          <Button type="button" variant="outline" size="sm" className="bg-card">
            <ImageIcon aria-hidden="true" />
            Elegir de Imágenes
          </Button>
        }
      />
      {puedeQuitarImagen({ opcional, valor }) && (
        <Button type="button" variant="ghost" size="sm" onClick={() => alCambiar(null)}>
          <X aria-hidden="true" />
          Quitar
        </Button>
      )}
    </div>
  )
}
