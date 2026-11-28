import { cn } from 'cn'
import { CircleAlert, Eye, MapPin, MessageCircle, Phone } from 'lucide-react'

import type { TextosDeContacto } from '../../aplicacion/consultar-sedes'
import type { VistaPreviaDeSede as Vista } from '../../dominio/vista-previa-de-sede'

const BOTON =
  'inline-flex items-center gap-[0.35rem] rounded-full px-[0.65rem] py-[0.35rem] font-bold [&_svg]:size-3.5'

// Colores del sitio público (tokens v4), solo para que la vista previa se parezca a él.
function Pestanas({ pestanas }: Pick<Vista, 'pestanas'>) {
  return (
    <ul
      aria-label="Pestañas de las sedes en el sitio"
      className="flex flex-wrap gap-1 border-b-2 border-[#dbe3ec]"
    >
      {pestanas.map((pestana, indice) => (
        <li
          key={indice}
          aria-current={pestana.activa || undefined}
          className={cn(
            'px-3 py-[0.4rem] font-semibold text-[#4b5b6d]',
            pestana.activa && '-mb-[2px] border-b-2 border-[#1d629c] text-[#0f3354]',
          )}
        >
          {pestana.texto}
        </li>
      ))}
    </ul>
  )
}

function Botones({ vista, textos }: { vista: Vista; textos: TextosDeContacto }) {
  return (
    <div className="flex flex-wrap gap-[0.4rem]">
      {vista.whatsapp && (
        <span className={cn(BOTON, 'bg-[#25d366] text-[#0b2e17]')}>
          <MessageCircle aria-hidden="true" />
          <span className="sr-only">WhatsApp </span>
          {vista.whatsapp}
        </span>
      )}
      {vista.llamada && (
        <span className={cn(BOTON, 'bg-[#0f3354] text-white')}>
          <Phone aria-hidden="true" />
          <span className="sr-only">Llamar al </span>
          {vista.llamada}
        </span>
      )}
      {textos.comoLlegar && (
        <span className={cn(BOTON, 'border border-[#1d629c] text-[#1d629c]')}>
          <MapPin aria-hidden="true" />
          {textos.comoLlegar}
        </span>
      )}
    </div>
  )
}

function Avisos({ vista }: { vista: Vista }) {
  return (
    <>
      {vista.oculta && (
        <p className="rounded-md border border-pendiente-borde bg-pendiente-fondo px-3 py-2 text-[0.8125rem] text-pendiente">
          Esta sede está oculta: su pestaña no aparece en el sitio.
        </p>
      )}
      {!vista.whatsapp && (
        <p className="flex gap-[0.35rem] text-[0.8125rem] font-semibold text-error">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          Ningún celular de esta sede atiende por WhatsApp.
        </p>
      )}
    </>
  )
}

// Vista previa de la pestaña de la sede en «Contáctanos», con lo que se está escribiendo. Es una
// versión del panel: la del sitio depende de su CSS, su sprite de íconos y la foto del mapa.
export function VistaPreviaDeSede({ vista, textos }: { vista: Vista; textos: TextosDeContacto }) {
  return (
    <aside
      aria-labelledby="titulo-vista"
      className="overflow-hidden rounded-lg border bg-card amplio:sticky amplio:top-[calc(var(--alto-barra)+1.25rem)]"
    >
      <div className="flex items-center justify-between gap-2 border-b bg-muted px-[0.9rem] py-[0.55rem] text-[0.8125rem] font-semibold text-muted-foreground">
        <span id="titulo-vista">Vista previa: «{textos.titulo}» en el sitio</span>
        <Eye aria-hidden="true" className="size-4 shrink-0" />
      </div>
      <div className="grid gap-3 bg-white px-4 py-5 text-[0.8125rem] text-[#1f2d3d]">
        <p className="font-marca text-[1.35rem] font-medium text-[#0f3354] uppercase">
          {textos.titulo}
        </p>
        <Avisos vista={vista} />
        {vista.pestanas.length > 0 ? (
          <Pestanas pestanas={vista.pestanas} />
        ) : (
          <p className="text-[#4b5b6d]">Ninguna sede está visible: el sitio no muestra pestañas.</p>
        )}
        <PanelDeLaSede vista={vista} textos={textos} />
      </div>
    </aside>
  )
}

// Contenido de la pestaña: nombre, dirección, botones y el lugar del mapa.
function PanelDeLaSede({ vista, textos }: { vista: Vista; textos: TextosDeContacto }) {
  return (
    <div className="grid gap-[0.6rem] [overflow-wrap:anywhere]">
      <p>
        <strong className="block font-marca text-[1.1rem] font-medium text-[#0f3354]">
          {vista.nombre}
        </strong>
        {vista.direccion}
      </p>
      <Botones vista={vista} textos={textos} />
      <div className="grid h-32 place-items-center content-center gap-1 rounded-md bg-[#0f3354] font-bold text-white">
        <MapPin aria-hidden="true" className="size-5" />
        {textos.verMapa && (
          <span className="rounded-sm bg-[#feee00] px-3 py-1 text-[#0f3354]">{textos.verMapa}</span>
        )}
      </div>
    </div>
  )
}
