'use client'

import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

import { eliminarElPlan } from '../../acciones/planes'
import { RUTA_DE_PLANES } from '../../dominio/planes'
import { Button } from '../ui/button'
import { avisarResultado } from '../mensajes/avisos'
import { Confirmacion } from './confirmacion'

interface Props {
  id: number
  nombre: string
  celdasGuardadas: number
}

const textoDelBorrado = (celdas: number) =>
  celdas === 0
    ? 'Se borra el plan. No se puede deshacer.'
    : `Se borran el plan y ${celdas === 1 ? 'su fila' : `sus ${celdas} filas`} de «Qué incluye». No se puede deshacer.`

function Explicacion({ alPulsar }: { alPulsar: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
      <div>
        <h2 id="titulo-eliminar" className="text-[1.0625rem] leading-[1.35] font-[650]">
          Eliminar el plan
        </h2>
        <p className="text-[0.8125rem] text-muted-foreground">
          Se quita la columna y todo lo que incluye. Si solo quieres dejar de mostrarlo, apaga
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
        Eliminar plan
      </Button>
    </div>
  )
}

// «Eliminar el plan», solo para el administrador (la acción lo vuelve a comprobar). La colección
// borra antes las celdas del plan, en la misma transacción.
export function EliminarPlan({ id, nombre, celdasGuardadas }: Props) {
  const router = useRouter()
  const [abierta, setAbierta] = useState(false)
  const [eliminando, iniciar] = useTransition()

  const confirmar = () =>
    iniciar(async () => {
      const resultado = await eliminarElPlan(id)
      avisarResultado(resultado)
      setAbierta(false)
      if (resultado.ok) router.push(RUTA_DE_PLANES)
    })

  return (
    <section
      aria-labelledby="titulo-eliminar"
      className="rounded-lg border bg-card text-card-foreground shadow-sm"
    >
      <Explicacion alPulsar={() => setAbierta(true)} />
      <Confirmacion
        abierta={abierta}
        titulo={`¿Eliminar el plan ${nombre}?`}
        texto={textoDelBorrado(celdasGuardadas)}
        accion={eliminando ? 'Eliminando…' : 'Eliminar plan'}
        ocupada={eliminando}
        alConfirmar={confirmar}
        alCerrar={() => setAbierta(false)}
      />
    </section>
  )
}
