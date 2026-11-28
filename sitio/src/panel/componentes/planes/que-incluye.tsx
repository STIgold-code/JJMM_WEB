'use client'

import { cn } from 'cn'

import type { TipoDeInclusion } from '@/modulos/planes/dominio/inclusion-de-plan'

import type { CeldaDelFormulario } from '../../dominio/formulario-de-plan'
import type { CaracteristicaDelPanel } from '../../dominio/planes'
import { TarjetaDelPanel } from '../inicio/tarjeta-del-panel'
import { Input } from '../ui/input'
import { MensajeDeError } from './mensaje-de-error'

const OPCIONES: readonly { tipo: TipoDeInclusion; texto: string }[] = [
  { tipo: 'incluido', texto: 'Incluido' },
  { tipo: 'no-incluido', texto: 'No incluido' },
  { tipo: 'texto', texto: 'Texto' },
]

type CambioDeCelda = Partial<Pick<CeldaDelFormulario, 'tipo' | 'texto'>>

interface PropsDeFila {
  caracteristica: CaracteristicaDelPanel
  celda: CeldaDelFormulario
  error?: string
  alCambiar: (caracteristica: number, cambio: CambioDeCelda) => void
}

interface PropsDelControl {
  idDeLaEtiqueta: string
  tipo: TipoDeInclusion
  alElegir: (tipo: TipoDeInclusion) => void
}

// Control segmentado de la maqueta: botones con `aria-pressed`, uno elegido a la vez.
function ControlSegmentado({ idDeLaEtiqueta, tipo: elegido, alElegir }: PropsDelControl) {
  return (
    <div
      role="group"
      aria-labelledby={idDeLaEtiqueta}
      className="inline-flex flex-wrap gap-[0.2rem] rounded-md bg-muted p-[0.2rem] max-sm:flex max-sm:w-full"
    >
      {OPCIONES.map(({ tipo, texto }) => (
        <button
          key={tipo}
          type="button"
          aria-pressed={elegido === tipo}
          onClick={() => alElegir(tipo)}
          className={cn(
            'inline-flex min-h-7 cursor-pointer items-center justify-center rounded-sm px-[0.55rem] py-[0.15rem] text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground max-sm:flex-1',
            'aria-pressed:bg-card aria-pressed:text-foreground aria-pressed:shadow-sm',
          )}
        >
          {texto}
        </button>
      ))}
    </div>
  )
}

// Una característica: control segmentado «Incluido / No incluido / Texto» y, con «Texto», el
// campo del valor debajo (así las columnas no saltan).
function FilaDeInclusion({ caracteristica, celda, error, alCambiar }: PropsDeFila) {
  const { id, nombre } = caracteristica
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 border-b px-5 py-[0.6rem] last:border-b-0 max-sm:grid-cols-[minmax(0,1fr)]">
      <span id={`car-${id}`} className="text-sm">
        {nombre}
      </span>
      <div className="flex flex-col items-stretch gap-2">
        <ControlSegmentado
          idDeLaEtiqueta={`car-${id}`}
          tipo={celda.tipo}
          alElegir={(tipo) => alCambiar(id, { tipo })}
        />
        {celda.tipo === 'texto' && (
          <>
            <label htmlFor={`texto-${id}`} className="sr-only">
              Texto para «{nombre}»
            </label>
            <Input
              id={`texto-${id}`}
              value={celda.texto}
              onChange={(evento) => alCambiar(id, { texto: evento.target.value })}
              placeholder="Por ejemplo, Consultar"
              autoComplete="off"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `error-${id}` : undefined}
              className="h-8 bg-card text-[0.8125rem]"
            />
          </>
        )}
        {error && <MensajeDeError id={`error-${id}`} texto={error} />}
      </div>
    </li>
  )
}

interface Props {
  caracteristicas: readonly CaracteristicaDelPanel[]
  celdas: readonly CeldaDelFormulario[]
  errores: Readonly<Record<number, string>>
  alCambiar: (caracteristica: number, cambio: CambioDeCelda) => void
}

// «Qué incluye»: una fila por característica, en el orden de la tabla. Las filas mismas (crear,
// renombrar u ordenar características) se editan en otra pantalla.
export function QueIncluye({ caracteristicas, celdas, errores, alCambiar }: Props) {
  const porId = new Map(celdas.map((celda) => [celda.caracteristica, celda]))
  return (
    <TarjetaDelPanel
      idDelTitulo="titulo-incluye"
      titulo="Qué incluye"
      bajada="Una fila por característica, en el orden de la tabla. «Texto» sirve para valores como «6 trabajadores» o «Consultar»."
    >
      {caracteristicas.length === 0 ? (
        <p className="px-5 py-8 text-center text-muted-foreground">
          La tabla todavía no tiene características. Cuando se agreguen, aquí eliges qué incluye
          este plan en cada una.
        </p>
      ) : (
        <ul className="grid grid-cols-[minmax(0,1fr)]">
          {caracteristicas.map((caracteristica) => {
            const celda = porId.get(caracteristica.id)
            if (!celda) return null
            return (
              <FilaDeInclusion
                key={caracteristica.id}
                caracteristica={caracteristica}
                celda={celda}
                error={errores[caracteristica.id]}
                alCambiar={alCambiar}
              />
            )
          })}
        </ul>
      )}
    </TarjetaDelPanel>
  )
}
