'use client'

import { useState } from 'react'

import { type ImagenElegida, tamanoLegible } from '../../dominio/selector-de-imagen'
import {
  type ErroresDeSubida,
  LARGO_MAXIMO_DEL_ALT,
  validarTextoAlternativo,
} from '../../dominio/subida-de-imagenes'
import { avisarExito } from '../mensajes/avisos'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Progress } from '../ui/progress'
import { AreaDeTexto } from './area-de-texto'
import { MensajeDeError } from './mensaje-de-error'
import { MiniaturaDeImagen } from './miniatura-de-imagen'
import { subirImagen } from './subir-imagen'

// El archivo elegido o soltado en el selector y su vista previa local (`blob:`), que crea y libera
// quien lo elige.
export interface ArchivoElegido {
  archivo: File
  vista: string
}

interface Props {
  // `null` cierra el diálogo.
  elegido: ArchivoElegido | null
  alCerrar: () => void
  alSubir: (imagen: ImagenElegida) => void
}

function useSubidaUnica(archivo: File, alSubir: Props['alSubir']) {
  const [alt, setAlt] = useState('')
  const [errores, setErrores] = useState<ErroresDeSubida>({})
  const [progreso, setProgreso] = useState<number | null>(null)
  const subir = async () => {
    const validacion = validarTextoAlternativo(alt)
    if (!validacion.valido) return setErrores({ alt: validacion.error })
    setErrores({})
    setProgreso(0)
    const respuesta = await subirImagen(archivo, validacion.alt, setProgreso)
    setProgreso(null)
    if (respuesta.estado === 'subida') {
      avisarExito({ titulo: 'Imagen subida', detalle: 'También queda en la biblioteca.' })
      return alSubir(respuesta.imagen)
    }
    setErrores(respuesta.estado === 'error' ? { general: respuesta.error } : respuesta.errores)
  }
  return { alt, setAlt, errores, progreso, subir }
}

function Cabecera({ archivo, vista }: ArchivoElegido) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Subir imagen</DialogTitle>
        <DialogDescription>
          {archivo.name} · {tamanoLegible(archivo.size)}
        </DialogDescription>
      </DialogHeader>
      <MiniaturaDeImagen
        url={vista}
        alt=""
        sizes="32rem"
        entera
        className="max-h-56 rounded-md border"
      />
    </>
  )
}

function Formulario({
  elegido,
  alCerrar,
  alSubir,
}: Omit<Props, 'elegido'> & { elegido: ArchivoElegido }) {
  const { archivo, vista } = elegido
  const { alt, setAlt, errores, progreso, subir } = useSubidaUnica(archivo, alSubir)
  const subiendo = progreso !== null
  const error = errores.archivo ?? errores.general
  return (
    <form
      noValidate
      className="grid gap-4"
      onSubmit={(evento) => {
        evento.preventDefault()
        void subir()
      }}
    >
      <Cabecera archivo={archivo} vista={vista} />
      <AreaDeTexto
        id="subida-unica-alt"
        etiqueta="Texto alternativo"
        rows={3}
        maxLength={LARGO_MAXIMO_DEL_ALT}
        value={alt}
        disabled={subiendo}
        onChange={(evento) => setAlt(evento.target.value)}
        ayuda="Describe lo que se ve, en una frase. Si es un logotipo, escribe el nombre de la empresa."
        error={errores.alt}
      />
      <div aria-live="polite">
        {subiendo && <Progress value={progreso} aria-label="Subiendo la imagen" />}
        {error && <MensajeDeError id="subida-unica-error" texto={error} />}
      </div>
      <Pie subiendo={subiendo} alCerrar={alCerrar} />
    </form>
  )
}

function Pie({ subiendo, alCerrar }: { subiendo: boolean; alCerrar: () => void }) {
  return (
    <DialogFooter>
      <Button
        type="button"
        variant="outline"
        className="bg-card"
        disabled={subiendo}
        onClick={alCerrar}
      >
        Cancelar
      </Button>
      <Button type="submit" disabled={subiendo} className="hover:bg-primary-hover">
        {subiendo ? 'Subiendo…' : 'Subir imagen'}
      </Button>
    </DialogFooter>
  )
}

// Pide el texto alternativo de una imagen antes de subirla desde un selector (la colección lo
// exige y es lo que leen los lectores de pantalla), muestra el avance y el error si lo hay.
export function DialogoDeSubidaUnica({ elegido, alCerrar, alSubir }: Props) {
  return (
    <Dialog open={elegido !== null} onOpenChange={(abrir) => !abrir && alCerrar()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto bg-card">
        {elegido && (
          <Formulario key={elegido.vista} elegido={elegido} alCerrar={alCerrar} alSubir={alSubir} />
        )}
      </DialogContent>
    </Dialog>
  )
}
