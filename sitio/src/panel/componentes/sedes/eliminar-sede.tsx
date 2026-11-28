'use client'

import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

import { eliminarLaSede } from '../../acciones/sedes'
import { AVISO_DE_ULTIMA_VISIBLE, nombreCorto, RUTA_DE_SEDES } from '../../dominio/sedes'
import { Confirmacion } from '../comunes/confirmacion'
import { avisarResultado } from '../mensajes/avisos'
import { Button } from '../ui/button'

interface Props {
  id: number
  nombre: string
  // Es la única sede visible: borrarla deja el sitio sin sedes (se permite, con aviso).
  ultimaVisible: boolean
}

function Explicacion({ alPulsar }: { alPulsar: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
      <div>
        <h2 id="titulo-eliminar" className="text-[1.0625rem] leading-[1.35] font-[650]">
          Eliminar la sede
        </h2>
        <p className="text-[0.8125rem] text-muted-foreground">
          Se quita del sitio con sus celulares y su mapa. Si solo quieres dejar de mostrarla, apaga
          «Visible en el sitio».
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={alPulsar}
        className="border-destructive/40 bg-card text-destructive hover:bg-error-fondo hover:text-destructive"
      >
        <Trash2 aria-hidden="true" />
        Eliminar sede
      </Button>
    </div>
  )
}

const textoDelBorrado = (ultimaVisible: boolean) =>
  ultimaVisible
    ? `${AVISO_DE_ULTIMA_VISIBLE} No se puede deshacer.`
    : 'Se borra la sede con sus celulares y su mapa. No se puede deshacer.'

// «Eliminar la sede», solo para el administrador (la acción lo vuelve a comprobar).
export function EliminarSede({ id, nombre, ultimaVisible }: Props) {
  const router = useRouter()
  const [abierta, setAbierta] = useState(false)
  const [eliminando, iniciar] = useTransition()

  const confirmar = () =>
    iniciar(async () => {
      const resultado = await eliminarLaSede(id)
      avisarResultado(resultado)
      setAbierta(false)
      if (resultado.ok) router.push(RUTA_DE_SEDES)
    })

  return (
    <section
      aria-labelledby="titulo-eliminar"
      className="rounded-lg border bg-card text-card-foreground shadow-sm"
    >
      <Explicacion alPulsar={() => setAbierta(true)} />
      <Confirmacion
        abierta={abierta}
        titulo={`¿Eliminar la sede ${nombreCorto(nombre)}?`}
        texto={textoDelBorrado(ultimaVisible)}
        accion={eliminando ? 'Eliminando…' : 'Eliminar sede'}
        ocupada={eliminando}
        alConfirmar={confirmar}
        alCerrar={() => setAbierta(false)}
      />
    </section>
  )
}
