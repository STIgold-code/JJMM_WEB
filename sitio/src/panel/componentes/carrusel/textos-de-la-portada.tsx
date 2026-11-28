'use client'

import {
  DISPOSICIONES,
  type PortadaDelFormulario,
  TRANSICIONES,
} from '../../dominio/carrusel-de-portadas'
import type { CambioDePortada } from '../../dominio/edicion-del-carrusel'
import type { ErroresDePortada } from '../../dominio/errores-del-carrusel'
import { TEXTOS_DE_DISPOSICION, TEXTOS_DE_TRANSICION } from '../../dominio/vista-previa-de-portada'
import { AreaDeTexto } from '../comunes/area-de-texto'
import { Campo, CLASE_DE_AYUDA } from '../comunes/campo'
import { FiltrosSegmentados } from '../comunes/filtros-segmentados'
import { Selector } from '../comunes/selector'
import { SelectorDeImagen } from '../comunes/selector-de-imagen'

interface Props {
  portada: PortadaDelFormulario
  errores: ErroresDePortada | undefined
  alCambiar: (cambio: CambioDePortada) => void
}

const OPCIONES_DE_DISPOSICION = DISPOSICIONES.map((valor) => ({
  valor,
  texto: TEXTOS_DE_DISPOSICION[valor],
}))
const OPCIONES_DE_TRANSICION = TRANSICIONES.map((valor) => ({
  valor,
  texto: TEXTOS_DE_TRANSICION[valor],
}))

function Disposicion({ portada, alCambiar }: Omit<Props, 'errores'>) {
  return (
    <div className="grid gap-[0.4rem]">
      <span id="portada-disposicion" className="text-sm font-semibold">
        Dónde va el texto
      </span>
      <p className={CLASE_DE_AYUDA}>
        Con «Imagen completa» la imagen se ve entera porque ya trae su texto; el título y los
        botones van abajo.
      </p>
      <FiltrosSegmentados
        aria-labelledby="portada-disposicion"
        opciones={OPCIONES_DE_DISPOSICION}
        actual={portada.disposicion}
        alElegir={(disposicion) => alCambiar({ disposicion })}
        className="w-fit"
      />
    </div>
  )
}

// Textos de la portada (maqueta «Portada N: textos y botones»): dónde va el texto, título con la
// parte resaltada entre corchetes, subtítulo, cómo entra, sello y la lista de puntos.
export function TextosDeLaPortada({ portada, errores, alCambiar }: Props) {
  return (
    <>
      <Disposicion portada={portada} alCambiar={alCambiar} />
      <Campo
        id="portada-titulo"
        etiqueta="Título"
        value={portada.titulo}
        error={errores?.titulo}
        ayuda="Lo que escribas entre corchetes se pinta en amarillo. Ejemplo: Somos más que un [estudio contable]. Déjalo vacío si el texto ya está en la imagen."
        onChange={(evento) => alCambiar({ titulo: evento.target.value })}
      />
      <AreaDeTexto
        id="portada-subtitulo"
        etiqueta="Subtítulo"
        rows={2}
        value={portada.subtitulo}
        error={errores?.subtitulo}
        onChange={(evento) => alCambiar({ subtitulo: evento.target.value })}
      />
      <Selector
        id="portada-transicion"
        etiqueta="Cómo entra"
        valor={portada.transicion}
        opciones={OPCIONES_DE_TRANSICION}
        alCambiar={(transicion) => alCambiar({ transicion })}
      />
      <ListaYSello portada={portada} errores={errores} alCambiar={alCambiar} />
    </>
  )
}

function ListaYSello({ portada, errores, alCambiar }: Props) {
  return (
    <>
      <AreaDeTexto
        id="portada-lista"
        etiqueta="Lista de puntos"
        rows={3}
        value={portada.lista}
        error={errores?.lista}
        ayuda="Opcional. Escribe un punto por línea; se muestran con una marca de verificación."
        onChange={(evento) => alCambiar({ lista: evento.target.value })}
      />
      <SelectorDeImagen
        id="portada-sello"
        etiqueta="Sello"
        opcional
        valor={portada.sello}
        error={errores?.sello}
        ayuda="Opcional. Una imagen pequeña que va sobre el título, por ejemplo un distintivo."
        alCambiar={(sello) => alCambiar({ sello })}
      />
    </>
  )
}
