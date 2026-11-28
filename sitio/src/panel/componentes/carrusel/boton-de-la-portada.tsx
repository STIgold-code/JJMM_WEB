'use client'

import { X } from 'lucide-react'

import { TIPOS_DE_DESTINO } from '@/compartido/dominio/destino-de-enlace'

import {
  type BotonDelFormulario,
  ESTILOS_DE_BOTON,
  TIPOS_DE_BOTON,
} from '../../dominio/carrusel-de-portadas'
import type { ErroresDeBoton } from '../../dominio/errores-del-carrusel'
import { TEXTOS_DE_ESTILO, TEXTOS_DE_TIPO_DE_BOTON } from '../../dominio/vista-previa-de-portada'
import { Campo } from '../comunes/campo'
import { FiltrosSegmentados } from '../comunes/filtros-segmentados'
import { Selector } from '../comunes/selector'
import { Button } from '../ui/button'
import type { CambioDeBoton } from './cambios-del-carrusel'

interface Props {
  boton: BotonDelFormulario
  numero: number
  errores: ErroresDeBoton | undefined
  alCambiar: (cambio: CambioDeBoton) => void
  alQuitar: () => void
}

const OPCIONES_DE_TIPO = TIPOS_DE_BOTON.map((valor) => ({
  valor,
  texto: TEXTOS_DE_TIPO_DE_BOTON[valor],
}))
const OPCIONES_DE_ESTILO = ESTILOS_DE_BOTON.map((valor) => ({
  valor,
  texto: TEXTOS_DE_ESTILO[valor],
}))

const llevaDestino = (tipo: BotonDelFormulario['tipo']) => TIPOS_DE_DESTINO.some((t) => t === tipo)

// Según lo que hace el botón: el mensaje de WhatsApp o el destino del enlace.
function CampoSegunTipo({ boton, errores, alCambiar }: Omit<Props, 'numero' | 'alQuitar'>) {
  const id = `boton-${boton.clave}`
  if (boton.tipo === 'whatsapp')
    return (
      <Campo
        id={`${id}-mensaje`}
        etiqueta="Mensaje de WhatsApp"
        value={boton.mensaje}
        error={errores?.mensaje}
        ayuda="Opcional. Si lo dejas vacío, se usa el mensaje por defecto del sitio."
        onChange={(evento) => alCambiar({ mensaje: evento.target.value })}
      />
    )
  if (!llevaDestino(boton.tipo)) return null
  return (
    <Campo
      id={`${id}-destino`}
      etiqueta="A dónde lleva"
      value={boton.destino}
      error={errores?.destino}
      ayuda="Por ejemplo #planes, /guia o https://sigefact.pse.pe/."
      onChange={(evento) => alCambiar({ destino: evento.target.value })}
    />
  )
}

// Un botón de la portada: texto, qué hace (WhatsApp y llamada usan los celulares del sitio), su
// mensaje o destino, y su estilo.
export function BotonDeLaPortada({ boton, numero, errores, alCambiar, alQuitar }: Props) {
  const id = `boton-${boton.clave}`
  return (
    <li className="grid gap-4 rounded-md border bg-card p-4" aria-labelledby={`${id}-titulo`}>
      <div className="flex items-center justify-between gap-2">
        <span id={`${id}-titulo`} className="text-sm font-[650]">
          Botón {numero}
        </span>
        <Button type="button" variant="ghost" size="sm" onClick={alQuitar}>
          <X aria-hidden="true" />
          Quitar botón
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo
          id={`${id}-etiqueta`}
          etiqueta="Texto del botón"
          value={boton.etiqueta}
          error={errores?.etiqueta}
          onChange={(evento) => alCambiar({ etiqueta: evento.target.value })}
        />
        <Selector
          id={`${id}-tipo`}
          etiqueta="Qué hace"
          valor={boton.tipo}
          opciones={OPCIONES_DE_TIPO}
          alCambiar={(tipo) => alCambiar({ tipo })}
        />
      </div>
      <CampoSegunTipo boton={boton} errores={errores} alCambiar={alCambiar} />
      <Estilo boton={boton} alCambiar={alCambiar} />
    </li>
  )
}

// Principal (relleno amarillo) o secundario (contorno), como en el sitio.
function Estilo({ boton, alCambiar }: Pick<Props, 'boton' | 'alCambiar'>) {
  const id = `boton-${boton.clave}-estilo`
  return (
    <div className="grid gap-[0.4rem]">
      <span id={id} className="text-sm font-semibold">
        Estilo
      </span>
      <FiltrosSegmentados
        aria-labelledby={id}
        opciones={OPCIONES_DE_ESTILO}
        actual={boton.estilo}
        alElegir={(estilo) => alCambiar({ estilo })}
        className="w-fit"
      />
    </div>
  )
}
