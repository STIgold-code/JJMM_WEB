'use client'

import type { ChangeEvent } from 'react'

import type { Periodicidad } from '@/modulos/vencimientos/dominio/vencimiento'

import { eliminarElVencimiento, guardarElVencimiento } from '../../acciones/vencimientos'
import type { ErroresDeVencimiento } from '../../dominio/validacion-de-vencimiento'
import {
  type FormularioDeVencimiento,
  formularioDeVencimiento,
  hayCambiosEnElVencimiento,
  NOMBRES_DE_PERIODICIDAD,
  SIN_FECHA_PUBLICADA,
  type VencimientoDelPanel,
} from '../../dominio/vencimientos-del-panel'
import { AreaDeTexto } from '../comunes/area-de-texto'
import { Campo } from '../comunes/campo'
import { FiltrosSegmentados } from '../comunes/filtros-segmentados'
import { HojaDeEdicion } from '../comunes/hoja-de-edicion'
import { useFormularioEnHoja } from '../comunes/use-formulario-en-hoja'
import { EliminarDeLaGuia } from './eliminar-de-la-guia'

interface Props {
  // Nulo: «Nuevo vencimiento».
  vencimiento: VencimientoDelPanel | null
  puedeEliminar: boolean
  alCerrar: () => void
}

const PERIODICIDADES: readonly Periodicidad[] = ['mensual', 'anual']

// Panel lateral de un vencimiento (`vencimiento` nulo: uno nuevo, al final de la lista).
export function HojaDeVencimiento({ vencimiento, puedeEliminar, alCerrar }: Props) {
  const edicion = useFormularioEnHoja<FormularioDeVencimiento, ErroresDeVencimiento>({
    inicial: formularioDeVencimiento(vencimiento),
    hayCambios: hayCambiosEnElVencimiento,
    guardarEnServidor: (formulario) => guardarElVencimiento(vencimiento?.id ?? null, formulario),
    alGuardar: alCerrar,
  })
  const eliminar = vencimiento && puedeEliminar && (
    <EliminarDeLaGuia
      accion="Eliminar vencimiento"
      titulo={`¿Eliminar «${vencimiento.obligacion}»?`}
      texto="Deja de verse en la guía y no se puede recuperar."
      eliminar={() => eliminarElVencimiento(vencimiento.id)}
      alEliminar={alCerrar}
    />
  )
  return (
    <HojaDeEdicion
      abierta
      alCerrar={alCerrar}
      titulo={vencimiento ? 'Editar vencimiento' : 'Nuevo vencimiento'}
      descripcion="La guía agrupa los vencimientos en mensuales y anuales."
      sucio={edicion.sucio}
      guardando={edicion.guardando}
      textoDeGuardar={vencimiento ? 'Guardar vencimiento' : 'Crear vencimiento'}
      alGuardar={edicion.guardar}
      eliminar={eliminar}
    >
      <CamposDeVencimiento {...edicion} />
    </HojaDeEdicion>
  )
}

interface PropsDeCampos {
  formulario: FormularioDeVencimiento
  errores: ErroresDeVencimiento
  cambiar: <C extends keyof FormularioDeVencimiento>(
    campo: C,
    valor: FormularioDeVencimiento[C],
  ) => void
}

// Obligación, periodicidad (control segmentado de la maqueta), cuándo vence y la nota, que la
// colección tiene aunque la maqueta no la muestre.
function CamposDeVencimiento({ formulario, errores, cambiar }: PropsDeCampos) {
  const enlazar = (campo: 'obligacion' | 'cuandoVence' | 'nota') => ({
    value: formulario[campo],
    error: errores[campo],
    onChange: (evento: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      cambiar(campo, evento.target.value),
  })
  return (
    <>
      <Campo
        id="vencimiento-obligacion"
        etiqueta="Obligación"
        required
        maxLength={200}
        {...enlazar('obligacion')}
      />
      <SelectorDePeriodicidad
        actual={formulario.periodicidad}
        alElegir={(periodicidad) => cambiar('periodicidad', periodicidad)}
      />
      <Campo
        id="vencimiento-cuando"
        etiqueta="Cuándo vence"
        required
        maxLength={200}
        ayuda={`Por ejemplo, «Los 07 de cada mes.» Si no hay fecha, escribe «${SIN_FECHA_PUBLICADA}»`}
        {...enlazar('cuandoVence')}
      />
      <AreaDeTexto
        id="vencimiento-nota"
        etiqueta="Nota"
        rows={3}
        ayuda="Opcional. La guía la muestra junto a cuándo vence."
        {...enlazar('nota')}
      />
    </>
  )
}

function SelectorDePeriodicidad(props: {
  actual: Periodicidad
  alElegir: (periodicidad: Periodicidad) => void
}) {
  return (
    <div className="grid gap-[0.4rem]">
      <span id="vencimiento-periodicidad" className="text-sm font-semibold">
        Periodicidad
      </span>
      <FiltrosSegmentados
        aria-labelledby="vencimiento-periodicidad"
        opciones={PERIODICIDADES.map((valor) => ({ valor, texto: NOMBRES_DE_PERIODICIDAD[valor] }))}
        actual={props.actual}
        alElegir={props.alElegir}
        className="justify-self-start"
      />
    </div>
  )
}
