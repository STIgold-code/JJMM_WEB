'use client'

import type { PortadaDelFormulario } from '../../dominio/carrusel-de-portadas'
import type { CambioDePortada } from '../../dominio/edicion-del-carrusel'
import type { ErroresDePortada } from '../../dominio/errores-del-carrusel'
import { CLASE_DE_AYUDA } from '../comunes/campo'
import { FilaVisible } from '../comunes/fila-visible'
import { MensajeDeError } from '../comunes/mensaje-de-error'
import { SelectorDeImagen } from '../comunes/selector-de-imagen'
import { TarjetaDelPanel } from '../inicio/tarjeta-del-panel'
import { Button } from '../ui/button'

interface Props {
  portada: PortadaDelFormulario
  numero: number
  errores: ErroresDePortada | undefined
  alCambiar: (cambio: CambioDePortada) => void
}

// Sin ajuste, el sitio muestra el centro de la imagen.
const ENCUADRE_CENTRADO = 50

interface PropsDelEncuadre {
  valor: number | null
  error?: string
  alCambiar: (valor: number | null) => void
}

// Etiqueta con el valor actual y, si se ajustó, «Volver al centro» (el valor vacío del bloque).
function EtiquetaDelEncuadre({ valor, alCambiar }: Omit<PropsDelEncuadre, 'error'>) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <label htmlFor="portada-encuadre" className="text-sm font-semibold">
        Encuadre en celular{' '}
        <span className="font-normal text-muted-foreground">
          {valor === null ? 'centrado' : `${valor} %`}
        </span>
      </label>
      {valor !== null && (
        <Button type="button" variant="ghost" size="sm" onClick={() => alCambiar(null)}>
          Volver al centro
        </Button>
      )}
    </div>
  )
}

function Encuadre({ valor, error, alCambiar }: PropsDelEncuadre) {
  const describe = ['portada-encuadre-ayuda', error && 'portada-encuadre-error'].filter(Boolean)
  return (
    <div className="grid gap-[0.4rem]">
      <EtiquetaDelEncuadre valor={valor} alCambiar={alCambiar} />
      <input
        id="portada-encuadre"
        type="range"
        min={0}
        max={100}
        value={valor ?? ENCUADRE_CENTRADO}
        aria-invalid={error ? true : undefined}
        aria-describedby={describe.join(' ')}
        onChange={(evento) => alCambiar(Number(evento.target.value))}
        className="w-full accent-primary"
      />
      <p id="portada-encuadre-ayuda" className={CLASE_DE_AYUDA}>
        En pantallas angostas la imagen se recorta. Mueve el control para elegir qué parte queda a
        la vista: 0 es el borde izquierdo y 100 el derecho.
      </p>
      {error && <MensajeDeError id="portada-encuadre-error" texto={error} />}
    </div>
  )
}

const AYUDAS = {
  imagen: 'Arrastra una imagen aquí o elige una. Mejor horizontal, de 1920 px de ancho o más.',
  decorativa:
    'Actívalo si el texto de la portada ya dice lo que muestra la imagen; así los lectores de pantalla la saltan.',
  celular:
    'Opcional. Se usa en celulares cuando el texto va en la imagen («Imagen completa»); si la dejas vacía, se usa la imagen principal.',
}

// «Portada N: imagen» (maqueta): la imagen, si es decorativa, la versión para celular y el
// encuadre en celular. Cada imagen se elige con el selector del panel.
export function ImagenDeLaPortada({ portada, numero, errores, alCambiar }: Props) {
  return (
    <TarjetaDelPanel
      id="editor-de-portada"
      idDelTitulo="titulo-imagen-de-portada"
      titulo={`Portada ${numero}: imagen`}
    >
      <div className="grid gap-5 px-5 py-5">
        <SelectorDeImagen
          id="portada-imagen"
          etiqueta="Imagen"
          valor={portada.imagen}
          error={errores?.imagen}
          ayuda={AYUDAS.imagen}
          alCambiar={(imagen) => alCambiar({ imagen })}
        />
        <FilaVisible
          id="portada-decorativa"
          etiqueta="La imagen es decorativa"
          visible={portada.imagenEsDecorativa}
          ayuda={AYUDAS.decorativa}
          alCambiar={(imagenEsDecorativa) => alCambiar({ imagenEsDecorativa })}
        />
        <EnCelular portada={portada} errores={errores} alCambiar={alCambiar} />
      </div>
    </TarjetaDelPanel>
  )
}

// Lo que cambia en pantallas angostas: otra imagen (para «Imagen completa») y el encuadre.
function EnCelular({ portada, errores, alCambiar }: Omit<Props, 'numero'>) {
  return (
    <>
      <SelectorDeImagen
        id="portada-imagen-celular"
        etiqueta="Imagen para celular"
        opcional
        valor={portada.imagenParaCelular}
        error={errores?.imagenParaCelular}
        ayuda={AYUDAS.celular}
        alCambiar={(imagenParaCelular) => alCambiar({ imagenParaCelular })}
      />
      <Encuadre
        valor={portada.encuadreEnCelular}
        error={errores?.encuadre}
        alCambiar={(encuadreEnCelular) => alCambiar({ encuadreEnCelular })}
      />
    </>
  )
}
