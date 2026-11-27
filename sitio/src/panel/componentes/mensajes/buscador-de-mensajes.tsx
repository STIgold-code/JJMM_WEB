'use client'

import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type FormEvent, useEffect, useState } from 'react'

import {
  type FiltroDeMensajes,
  LARGO_MAXIMO_DE_BUSQUEDA,
  RUTA_DE_MENSAJES,
  rutaDeMensajes,
} from '../../dominio/mensajes'
import { Input } from '../ui/input'

const ESPERA_MS = 350

interface Props {
  busqueda: string
  filtro: FiltroDeMensajes
}

// Lleva lo escrito a la URL tras una pausa corta (o al pulsar Enter). Cambiar la búsqueda vuelve
// a la primera página y cierra el mensaje abierto.
function useBusquedaEnLaUrl({ busqueda, filtro }: Props) {
  const router = useRouter()
  const [texto, setTexto] = useState(busqueda)

  useEffect(() => {
    const limpio = texto.trim()
    if (limpio === busqueda) return
    const espera = setTimeout(
      () => router.replace(rutaDeMensajes({ filtro, busqueda: limpio }), { scroll: false }),
      ESPERA_MS,
    )
    return () => clearTimeout(espera)
  }, [texto, busqueda, filtro, router])

  function alEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    router.replace(rutaDeMensajes({ filtro, busqueda: texto.trim() }), { scroll: false })
  }

  return { texto, setTexto, alEnviar }
}

// Buscador del listado. Busca en el servidor y deja la búsqueda en la URL mientras se escribe.
// Sin JavaScript funciona igual como formulario GET.
export function BuscadorDeMensajes({ busqueda, filtro }: Props) {
  const { texto, setTexto, alEnviar } = useBusquedaEnLaUrl({ busqueda, filtro })
  return (
    <form
      role="search"
      action={RUTA_DE_MENSAJES}
      method="get"
      onSubmit={alEnviar}
      className="relative flex-[1_1_14rem] sm:ml-auto sm:max-w-80"
    >
      {filtro !== 'nuevo' && <input type="hidden" name="filtro" value={filtro} />}
      <label htmlFor="buscar-mensajes" className="sr-only">
        Buscar mensajes
      </label>
      <Search
        aria-hidden="true"
        strokeWidth={1.75}
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        id="buscar-mensajes"
        name="q"
        type="search"
        value={texto}
        onChange={(evento) => setTexto(evento.target.value)}
        maxLength={LARGO_MAXIMO_DE_BUSQUEDA}
        placeholder="Buscar por nombre, servicio o texto"
        className="h-9 bg-card pl-9 text-sm"
      />
    </form>
  )
}
