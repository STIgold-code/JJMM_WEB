'use client'

import { Campo } from '../comunes/campo'
import { TarjetaDelPanel } from '../inicio/tarjeta-del-panel'

interface Props {
  mapa: string
  error?: string
  alCambiar: (mapa: string) => void
}

// Los pasos de la maqueta para conseguir el mapa insertado de Google Maps.
function ComoObtenerElMapa() {
  return (
    <details className="rounded-md border bg-muted px-4 py-3 text-[0.8125rem] text-muted-foreground">
      <summary className="cursor-pointer font-semibold text-foreground">
        Cómo obtener el mapa insertado
      </summary>
      <ol className="mt-2 grid list-decimal gap-1 pl-5">
        <li>Busca la sede en Google Maps.</li>
        <li>Pulsa «Compartir» y luego «Insertar un mapa».</li>
        <li>
          En el código que aparece, copia solo lo que está entre comillas después de{' '}
          <code className="font-mono text-foreground">src=</code>.
        </li>
        <li>Pégalo aquí. Un enlace normal de Google Maps no sirve.</li>
      </ol>
    </details>
  )
}

// «Mapa»: el mapa insertado que se abre con «Ver mapa». Es opcional: sin él, el sitio busca la
// dirección de la sede en Google Maps.
export function MapaDeLaSede({ mapa, error, alCambiar }: Props) {
  return (
    <TarjetaDelPanel idDelTitulo="titulo-mapa" titulo="Mapa">
      <div className="grid gap-4 px-5 py-5">
        <Campo
          id="sede-mapa"
          etiqueta="Mapa insertado de Google Maps"
          ayuda="Opcional. Si lo dejas vacío, «Ver mapa» busca la dirección de la sede."
          error={error}
          type="url"
          inputMode="url"
          placeholder="https://www.google.com/maps/embed?pb=…"
          value={mapa}
          onChange={(evento) => alCambiar(evento.target.value)}
        />
        <ComoObtenerElMapa />
      </div>
    </TarjetaDelPanel>
  )
}
