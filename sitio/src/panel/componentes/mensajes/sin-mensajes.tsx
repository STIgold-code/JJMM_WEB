import { Inbox } from 'lucide-react'

// Estado vacío de la pantalla: todavía no llega ningún mensaje.
export function SinMensajes() {
  return (
    <section
      aria-labelledby="titulo-sin-mensajes"
      className="rounded-lg border bg-card text-card-foreground shadow-sm"
    >
      <div className="mx-auto grid max-w-[30rem] justify-items-center gap-[0.6rem] px-6 py-12 text-center">
        <span className="mb-1 grid size-12 place-items-center rounded-full bg-accent text-primary">
          <Inbox aria-hidden="true" strokeWidth={1.75} className="size-[1.375rem]" />
        </span>
        <h2 id="titulo-sin-mensajes" className="text-[0.9375rem] font-[650]">
          Aún no llegan mensajes
        </h2>
        <p className="text-muted-foreground">
          Cuando alguien complete el formulario «Contáctanos» del sitio, su nombre, el servicio que
          le interesa y su mensaje aparecerán aquí, y el inicio del panel te avisará.
        </p>
      </div>
    </section>
  )
}
