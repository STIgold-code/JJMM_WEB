import { cn } from 'cn'
import { Check } from 'lucide-react'
import Image from 'next/image'

import type { RuedaDelSitio } from '../../aplicacion/consultar-areas'
import type { VistaPreviaDeArea } from '../../dominio/vista-previa-de-area'
import { MarcoDeVistaPrevia } from '../comunes/marco-de-vista-previa'

// La rueda con sus gajos encima (coordenadas de la imagen de 500 × 550), como la dibuja el sitio.
function Rueda({ vista, rueda }: { vista: VistaPreviaDeArea; rueda: RuedaDelSitio }) {
  return (
    <div className="relative mx-auto aspect-[500/550] w-[min(100%,17rem)]">
      {rueda.imagen && (
        <Image src={rueda.imagen.url} alt="" fill sizes="17rem" className="object-contain" />
      )}
      <svg viewBox="0 0 500 550" className="absolute inset-0 size-full">
        {vista.gajos.map((gajo) => (
          <polygon
            key={gajo.codigo}
            points={gajo.puntos}
            className={cn(
              'stroke-2',
              gajo.actual ? 'fill-[rgb(254_238_0/0.55)] stroke-[#0f3354]' : 'fill-transparent',
            )}
          />
        ))}
      </svg>
    </div>
  )
}

function Pestanas({ vista }: { vista: VistaPreviaDeArea }) {
  return (
    <div className="my-3 grid grid-cols-3 gap-[0.35rem]">
      {vista.pestanas.map((pestana) => (
        <span
          key={pestana.codigo}
          className={cn(
            'grid min-w-0 justify-items-center rounded-[0.45rem] border px-1 py-[0.4rem] text-[0.6875rem] [overflow-wrap:anywhere]',
            pestana.actual
              ? 'border-[#1d629c] bg-[#1d629c] text-white'
              : 'border-[#dbe3ec] text-[#154771]',
          )}
        >
          <b
            className={cn(
              'font-marca text-[0.95rem] font-semibold',
              pestana.actual ? 'text-[#feee00]' : 'text-[#1d629c]',
            )}
          >
            {pestana.codigo}
          </b>
          {pestana.corto}
        </span>
      ))}
    </div>
  )
}

function PestanaAbierta({ vista, rueda }: { vista: VistaPreviaDeArea; rueda: RuedaDelSitio }) {
  return (
    <div className="grid gap-2">
      <h3 className="font-marca text-[1.15rem] font-medium text-[#154771]">{vista.nombre}</h3>
      <p className="whitespace-pre-line">{vista.descripcion}</p>
      <ul className="grid gap-[0.3rem]">
        {vista.puntos.map((punto, indice) => (
          <li key={indice} className="flex gap-[0.4rem]">
            <Check
              aria-hidden="true"
              strokeWidth={2.5}
              className="mt-[0.1rem] size-[0.9rem] shrink-0 text-[#1d629c]"
            />
            <span>{punto}</span>
          </li>
        ))}
      </ul>
      <span className="w-fit rounded-sm bg-[#1d629c] px-[0.8rem] py-[0.35rem] font-bold text-white">
        {rueda.textoDelBoton}
      </span>
      <p className="text-[0.6875rem] text-[#4b5b6d]">
        {vista.mensaje
          ? `Abre WhatsApp con «${vista.mensaje}»`
          : 'Abre WhatsApp con el mensaje por defecto de Datos del estudio.'}
      </p>
    </div>
  )
}

// Vista previa de «Nuestros servicios» con lo que se está escribiendo. Es una versión del panel:
// la sección del sitio depende de su CSS, que el panel no carga. Es decorativa (la información
// está en los campos), por eso los lectores de pantalla la saltan.
export function VistaPreviaDelArea(props: { vista: VistaPreviaDeArea; rueda: RuedaDelSitio }) {
  const { vista, rueda } = props
  return (
    <MarcoDeVistaPrevia titulo={`Vista previa: «${rueda.titulo}» en el sitio`}>
      <div aria-hidden="true">
        <p className="mb-3 text-center font-marca text-[1.2rem] font-medium text-[#0f3354] uppercase">
          {rueda.titulo}
        </p>
        <Rueda vista={vista} rueda={rueda} />
        {vista.sinGajo && (
          <p className="mt-3 rounded-[0.35rem] border border-dashed border-[#c9b900] bg-[#fffbd1] px-[0.6rem] py-[0.45rem]">
            Sin gajo: esta área no se puede pulsar en la rueda; solo aparece en las pestañas.
          </p>
        )}
        <Pestanas vista={vista} />
        <PestanaAbierta vista={vista} rueda={rueda} />
      </div>
    </MarcoDeVistaPrevia>
  )
}
