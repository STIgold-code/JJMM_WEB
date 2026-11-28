'use client'

import type { FormularioDePlan } from '../../dominio/formulario-de-plan'
import { Campo } from '../comunes/campo'
import { FilaVisible } from '../comunes/fila-visible'
import { TarjetaDelPanel } from '../inicio/tarjeta-del-panel'

interface Props {
  formulario: FormularioDePlan
  errorDelNombre?: string
  alCambiar: (cambio: Partial<Omit<FormularioDePlan, 'celdas'>>) => void
}

// «Datos del plan»: solo los campos que usa el sitio. «Descripción» y «Destacado» existen en la
// colección pero el sitio no los muestra, así que no se piden aquí.
export function DatosDelPlan({ formulario, errorDelNombre, alCambiar }: Props) {
  return (
    <TarjetaDelPanel idDelTitulo="titulo-datos" titulo="Datos del plan">
      <div className="grid gap-4 px-5 py-5">
        <Campo
          id="plan-nombre"
          etiqueta="Nombre"
          ayuda="Encabeza la columna en la tabla del sitio."
          error={errorDelNombre}
          required
          value={formulario.nombre}
          onChange={(evento) => alCambiar({ nombre: evento.target.value })}
        />
        <Campo
          id="plan-mensaje"
          etiqueta="Mensaje de WhatsApp al pulsar «Solicitar»"
          ayuda="Es el texto que aparece listo para enviar por WhatsApp al estudio."
          placeholder="Hola, quiero información del plan…"
          value={formulario.mensajeDeConsulta}
          onChange={(evento) => alCambiar({ mensajeDeConsulta: evento.target.value })}
        />
        <FilaVisible
          id="plan-visible"
          visible={formulario.visible}
          ayuda="Si lo apagas, la columna deja de mostrarse sin borrar el plan."
          alCambiar={(visible) => alCambiar({ visible })}
        />
      </div>
    </TarjetaDelPanel>
  )
}
