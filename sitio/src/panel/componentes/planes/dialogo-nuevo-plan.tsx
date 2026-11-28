'use client'

import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useActionState, useState } from 'react'

import { crearElPlan } from '../../acciones/planes'
import { ESTADO_INICIAL_DE_CREACION, type EstadoDeCreacion } from '../../aplicacion/guardar-plan'
import { rutaDelPlan } from '../../dominio/planes'
import { MensajeDeError } from '../comunes/mensaje-de-error'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { avisarError, avisarExito } from '../mensajes/avisos'

// Al crear, el aviso se da y se va a la edición del plan nuevo para elegir qué incluye.
function useCrearPlan() {
  const router = useRouter()
  return useActionState(async (previo: EstadoDeCreacion, datos: FormData) => {
    const resultado = await crearElPlan(previo, datos)
    if (resultado.estado === 'creado') {
      avisarExito(resultado.aviso)
      router.push(rutaDelPlan(resultado.id))
    }
    if (resultado.estado === 'error') avisarError(resultado.error)
    return resultado
  }, ESTADO_INICIAL_DE_CREACION)
}

function CampoDelNombre({ error }: { error: string | null }) {
  return (
    <div className="grid gap-[0.4rem]">
      <Label htmlFor="nuevo-plan-nombre" className="font-semibold">
        Nombre del plan
      </Label>
      <Input
        id="nuevo-plan-nombre"
        name="nombre"
        required
        autoComplete="off"
        placeholder="Por ejemplo, SIGEMype III"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? 'nuevo-plan-error' : undefined}
        className="bg-card"
      />
      {error && <MensajeDeError id="nuevo-plan-error" texto={error} />}
    </div>
  )
}

// «Nuevo plan»: diálogo con el nombre. El plan se agrega al final de la tabla y oculto.
export function DialogoNuevoPlan() {
  const [abierto, setAbierto] = useState(false)
  const [estado, crear, creando] = useCrearPlan()
  const error = estado.estado === 'invalido' ? estado.error : null
  return (
    <Dialog open={abierto} onOpenChange={(abrir) => creando || setAbierto(abrir)}>
      <DialogTrigger asChild>
        <Button type="button" className="hover:bg-primary-hover max-sm:w-full">
          <Plus aria-hidden="true" />
          Nuevo plan
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card">
        <form action={crear} noValidate className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Nuevo plan</DialogTitle>
            <DialogDescription>
              Después eliges qué incluye. Se agrega al final de la tabla y queda oculto hasta que lo
              marques como visible.
            </DialogDescription>
          </DialogHeader>
          <CampoDelNombre error={error} />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={creando} className="bg-card">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={creando} className="hover:bg-primary-hover">
              {creando ? 'Creando…' : 'Crear y elegir qué incluye'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
