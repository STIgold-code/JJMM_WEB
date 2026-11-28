'use client'

import { MESES } from '@/modulos/vencimientos/dominio/cronograma-sunat'

import { eliminarElCronograma, guardarElCronograma } from '../../acciones/cronogramas'
import {
  type CronogramaDelPanel,
  type FormularioDeCronograma,
  formularioDeCronograma,
  hayCambiosEnElCronograma,
} from '../../dominio/cronogramas-del-panel'
import type { ErroresDeCronograma } from '../../dominio/validacion-de-cronograma'
import { Campo } from '../comunes/campo'
import { HojaDeEdicion } from '../comunes/hoja-de-edicion'
import { useFormularioEnHoja } from '../comunes/use-formulario-en-hoja'
import { EliminarDeLaGuia } from './eliminar-de-la-guia'
import { FechasPorDigito } from './fechas-por-digito'
import { SelectorDeMes } from './selector-de-mes'

interface Props {
  // Nulo: cargar el cronograma de un periodo nuevo.
  cronograma: CronogramaDelPanel | null
  anioActual: number
  puedeEliminar: boolean
  alCerrar: () => void
}

// Panel lateral del cronograma de un periodo: año, mes, las diez fechas y la de buenos
// contribuyentes (opcional). El servidor valida las fechas y que el periodo no esté repetido.
export function HojaDelCronograma({ cronograma, anioActual, puedeEliminar, alCerrar }: Props) {
  const edicion = useFormularioEnHoja<FormularioDeCronograma, ErroresDeCronograma>({
    inicial: formularioDeCronograma(cronograma, anioActual),
    hayCambios: hayCambiosEnElCronograma,
    guardarEnServidor: (formulario) => guardarElCronograma(cronograma?.id ?? null, formulario),
    alGuardar: alCerrar,
  })
  const eliminar = cronograma && puedeEliminar && (
    <EliminarDeLaGuia
      accion="Eliminar cronograma"
      titulo={`¿Eliminar el cronograma de ${cronograma.periodo}?`}
      texto="La guía deja de mostrar sus fechas y no se puede recuperar."
      eliminar={() => eliminarElCronograma(cronograma.id)}
      alEliminar={alCerrar}
    />
  )
  return (
    <HojaDeEdicion
      abierta
      alCerrar={alCerrar}
      titulo={cronograma ? `Cronograma de ${cronograma.periodo}` : 'Cargar cronograma'}
      descripcion="Cópialo tal como lo publica SUNAT. El periodo es el mes que se declara."
      sucio={edicion.sucio}
      guardando={edicion.guardando}
      textoDeGuardar={cronograma ? 'Guardar cronograma' : 'Cargar cronograma'}
      alGuardar={edicion.guardar}
      eliminar={eliminar}
    >
      <CamposDelCronograma {...edicion} />
    </HojaDeEdicion>
  )
}

interface PropsDeCampos {
  formulario: FormularioDeCronograma
  errores: ErroresDeCronograma
  cambiar: <C extends keyof FormularioDeCronograma>(
    campo: C,
    valor: FormularioDeCronograma[C],
  ) => void
}

function CamposDelCronograma({ formulario, errores, cambiar }: PropsDeCampos) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Campo
          id="cronograma-anio"
          etiqueta="Año"
          required
          inputMode="numeric"
          maxLength={4}
          value={formulario.anio}
          error={errores.anio}
          onChange={(evento) => cambiar('anio', evento.target.value)}
        />
        <SelectorDeMes
          valor={formulario.mes}
          meses={MESES}
          error={errores.mes}
          alCambiar={(mes) => cambiar('mes', mes)}
        />
      </div>
      <FechasPorDigito
        fechas={formulario.fechas}
        errores={errores.fechas}
        alCambiar={(fechas) => cambiar('fechas', fechas)}
      />
      <Campo
        id="cronograma-buenos"
        etiqueta="Buenos contribuyentes y UESP"
        type="date"
        ayuda="Opcional: solo si SUNAT publica esa fecha."
        value={formulario.buenosContribuyentes}
        error={errores.buenosContribuyentes}
        onChange={(evento) => cambiar('buenosContribuyentes', evento.target.value)}
      />
    </>
  )
}
