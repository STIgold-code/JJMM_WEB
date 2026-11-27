import { Info, MessageCircle, Phone, X } from 'lucide-react'

import type { MensajeDeContacto } from '../../aplicacion/consultar-mensajes'
import { enlacesDeRespuesta } from '../../dominio/respuesta-al-mensaje'
import { Button } from '../ui/button'
import { SheetClose, SheetDescription, SheetHeader, SheetTitle } from '../ui/sheet'
import { FormularioDeContacto } from './formulario-de-contacto'
import { InsigniaDeEstado } from './insignia-de-estado'

const SUBTITULO = 'text-sm font-[650]'

export function CabeceraDelMensaje({
  mensaje,
  recibido,
}: {
  mensaje: MensajeDeContacto
  recibido: string
}) {
  return (
    <SheetHeader className="flex-row items-start justify-between gap-4 border-b px-5 pt-5 pb-4">
      <div className="grid gap-[0.3rem]">
        <SheetTitle className="text-lg leading-snug font-[650]">{mensaje.nombre}</SheetTitle>
        <SheetDescription>Recibido: {recibido}</SheetDescription>
        <div>
          <InsigniaDeEstado estado={mensaje.estado} />
        </div>
      </div>
      <SheetClose asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Cerrar el mensaje">
          <X aria-hidden="true" />
        </Button>
      </SheetClose>
    </SheetHeader>
  )
}

// Con celular anotado: WhatsApp y llamada. Sin él, la explicación de dónde sigue la conversación.
function Responder({ celular }: { celular: string | null }) {
  const enlaces = enlacesDeRespuesta(celular)
  return (
    <section aria-labelledby="titulo-responder" className="grid gap-2">
      <h3 id="titulo-responder" className={SUBTITULO}>
        Responder
      </h3>
      {enlaces ? (
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <a href={enlaces.whatsapp} target="_blank" rel="noopener noreferrer">
              <MessageCircle aria-hidden="true" />
              WhatsApp {enlaces.celular}
              <span className="sr-only"> (se abre en otra pestaña)</span>
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={enlaces.llamada}>
              <Phone aria-hidden="true" />
              Llamar
            </a>
          </Button>
        </div>
      ) : (
        <div className="flex gap-[0.6rem] rounded-md border bg-background px-[0.9rem] py-3 text-[0.8125rem] text-muted-foreground">
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
          <p>
            El formulario no pide celular: la persona envía su mensaje al WhatsApp del estudio y la
            conversación sigue ahí. Cuando le respondas, anota aquí su celular para tenerlo a mano.
          </p>
        </div>
      )}
    </section>
  )
}

export function CuerpoDelMensaje({ mensaje }: { mensaje: MensajeDeContacto }) {
  return (
    <div className="grid flex-1 content-start gap-5 overflow-y-auto p-5">
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-[0.4rem] text-sm">
        <dt className="text-muted-foreground">Servicio de interés</dt>
        <dd className="font-semibold">{mensaje.servicio ?? 'Sin indicar'}</dd>
      </dl>
      <section aria-labelledby="titulo-mensaje" className="grid gap-2">
        <h3 id="titulo-mensaje" className={SUBTITULO}>
          Mensaje
        </h3>
        <p className="rounded-md bg-muted p-4 break-words whitespace-pre-line">{mensaje.mensaje}</p>
      </section>
      <Responder celular={mensaje.celular} />
      <FormularioDeContacto
        key={mensaje.id}
        id={mensaje.id}
        celular={mensaje.celular}
        correo={mensaje.correo}
      />
    </div>
  )
}
