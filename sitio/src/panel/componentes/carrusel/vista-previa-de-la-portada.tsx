import { cn } from 'cn'
import { CircleCheck, Eye } from 'lucide-react'
import Image from 'next/image'

import type { VistaPreviaDePortada as Vista } from '../../dominio/vista-previa-de-portada'

// Degradado azul noche del lado del texto, como el sitio, para que el texto blanco se lea.
const DEGRADADO = {
  'texto-derecha': 'bg-[linear-gradient(90deg,rgb(15_51_84/0)_25%,rgb(15_51_84/0.85))]',
  'texto-izquierda': 'bg-[linear-gradient(270deg,rgb(15_51_84/0)_25%,rgb(15_51_84/0.85))]',
  'imagen-completa': 'bg-[linear-gradient(0deg,rgb(10_30_55/0.8)_0%,rgb(10_30_55/0)_45%)]',
} as const

const POSICION_DEL_TEXTO = {
  'texto-derecha': 'ml-auto max-w-[62%] self-center',
  'texto-izquierda': 'max-w-[62%] self-center',
  'imagen-completa': 'self-end',
} as const

function Botones({ botones }: Pick<Vista, 'botones'>) {
  if (botones.length === 0) return null
  return (
    <p className="flex flex-wrap gap-[0.4rem] text-xs font-bold">
      {botones.map((boton, indice) => (
        <span
          key={indice}
          className={cn(
            'rounded-sm px-[0.7rem] py-[0.3rem]',
            boton.estilo === 'principal'
              ? 'bg-[#feee00] text-[#0f3354]'
              : 'border border-white text-white',
          )}
        >
          {boton.etiqueta}
        </span>
      ))}
    </p>
  )
}

// La parte entre corchetes, en amarillo, como el sitio.
function Titulo({ segmentos }: { segmentos: NonNullable<Vista['titulo']> }) {
  return (
    <p className="font-marca text-[1.35rem] leading-[1.15] font-medium uppercase">
      {segmentos.map(({ texto, resaltado }, indice) =>
        resaltado ? (
          <b key={indice} className="font-medium text-[#feee00]">
            {texto}
          </b>
        ) : (
          texto
        ),
      )}
    </p>
  )
}

function Lista({ puntos }: { puntos: string[] }) {
  if (puntos.length === 0) return null
  return (
    <ul className="grid gap-1 text-[0.8125rem]">
      {puntos.map((punto, indice) => (
        <li key={indice} className="flex gap-[0.35rem]">
          <CircleCheck aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-[#feee00]" />
          {punto}
        </li>
      ))}
    </ul>
  )
}

function Texto({ vista }: { vista: Vista }) {
  const posicion = POSICION_DEL_TEXTO[vista.disposicion]
  return (
    <div className={cn('relative grid gap-2 [overflow-wrap:anywhere]', posicion)}>
      {vista.sello && (
        <Image src={vista.sello} alt="" width={56} height={56} className="size-14 object-contain" />
      )}
      {vista.titulo && <Titulo segmentos={vista.titulo} />}
      {vista.subtitulo && <p className="text-[0.8125rem]">{vista.subtitulo}</p>}
      <Lista puntos={vista.lista} />
      <Botones botones={vista.botones} />
    </div>
  )
}

// Vista previa de la portada abierta, con lo que se está escribiendo. Es una versión del panel:
// el hero del sitio depende de su CSS, sus animaciones y su sprite de íconos.
export function VistaPreviaDeLaPortada({ vista, numero }: { vista: Vista; numero: number }) {
  const completa = vista.disposicion === 'imagen-completa'
  return (
    <aside
      aria-labelledby="titulo-vista"
      className="overflow-hidden rounded-lg border bg-card amplio:sticky amplio:top-[calc(var(--alto-barra)+1.25rem)]"
    >
      <div className="flex items-center justify-between gap-2 border-b bg-muted px-[0.9rem] py-[0.55rem] text-[0.8125rem] font-semibold text-muted-foreground">
        <span id="titulo-vista">Vista previa: portada {numero} en el sitio</span>
        <Eye aria-hidden="true" className="size-4 shrink-0" />
      </div>
      <div className="relative grid min-h-64 overflow-hidden bg-[#0f3354] p-5 text-white">
        {vista.imagen ? (
          <Image
            src={vista.imagen}
            alt=""
            fill
            sizes="(min-width: 1180px) 40vw, 100vw"
            className={completa ? 'object-contain' : 'object-cover'}
          />
        ) : (
          <p className="relative self-center text-center text-sm text-white/80">
            Elige la imagen de la portada para verla aquí.
          </p>
        )}
        <div aria-hidden="true" className={cn('absolute inset-0', DEGRADADO[vista.disposicion])} />
        <Texto vista={vista} />
      </div>
    </aside>
  )
}
