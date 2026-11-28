'use client'

import { CircleCheck, X } from 'lucide-react'

import { tamanoLegible } from '../../dominio/selector-de-imagen'
import { LARGO_MAXIMO_DEL_ALT } from '../../dominio/subida-de-imagenes'
import { AreaDeTexto } from '../comunes/area-de-texto'
import { MensajeDeError } from '../comunes/mensaje-de-error'
import { MiniaturaDeImagen } from '../comunes/miniatura-de-imagen'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import type { ArchivoEnCola } from './use-cola-de-subida'

interface Props {
  item: ArchivoEnCola
  alCambiarAlt: (alt: string) => void
  alQuitar: () => void
}

function Estado({ item }: { item: ArchivoEnCola }) {
  const { estado, progreso, errores, clave } = item
  if (estado === 'subiendo')
    return <Progress value={progreso} aria-label={`Subiendo ${item.archivo.name}`} />
  if (estado === 'subida')
    return (
      <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-listo">
        <CircleCheck aria-hidden="true" className="size-4" />
        Subida
      </p>
    )
  const error = errores.archivo ?? errores.general
  return error ? <MensajeDeError id={`${clave}-error`} texto={error} /> : null
}

// Nombre y peso del archivo; «Quitar» solo mientras no se está subiendo ni se subió.
function Cabecera({ archivo, alQuitar }: { archivo: File; alQuitar: (() => void) | null }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <p className="min-w-0 text-sm">
        <strong className="block truncate">{archivo.name}</strong>
        <span className="text-muted-foreground">{tamanoLegible(archivo.size)}</span>
      </p>
      {alQuitar && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Quitar ${archivo.name}`}
          onClick={alQuitar}
        >
          <X aria-hidden="true" />
        </Button>
      )}
    </div>
  )
}

// Una imagen de la subida múltiple: vista previa, nombre y peso, su texto alternativo (obligatorio)
// y su estado. Mientras sube o después de subida, el texto ya no se edita.
export function FilaDeSubida({ item, alCambiarAlt, alQuitar }: Props) {
  const fija = item.estado === 'subiendo' || item.estado === 'subida'
  const rechazada = Boolean(item.errores.archivo)
  return (
    <li className="grid grid-cols-[6rem_minmax(0,1fr)] gap-3 border-b py-3 last:border-b-0 max-sm:grid-cols-[minmax(0,1fr)]">
      <MiniaturaDeImagen
        url={item.vista}
        alt=""
        sizes="6rem"
        entera
        className="rounded-md border"
      />
      <div className="grid min-w-0 gap-2">
        <Cabecera archivo={item.archivo} alQuitar={fija ? null : alQuitar} />
        {!rechazada && (
          <AreaDeTexto
            id={`${item.clave}-alt`}
            etiqueta="Texto alternativo"
            rows={2}
            maxLength={LARGO_MAXIMO_DEL_ALT}
            value={item.alt}
            disabled={fija}
            onChange={(evento) => alCambiarAlt(evento.target.value)}
            error={item.errores.alt}
          />
        )}
        <div aria-live="polite">
          <Estado item={item} />
        </div>
      </div>
    </li>
  )
}
