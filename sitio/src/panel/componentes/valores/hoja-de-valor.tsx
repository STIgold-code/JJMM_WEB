'use client'

import { Info } from 'lucide-react'

import { eliminarElValor, guardarElValor } from '../../acciones/valores'
import {
  type ErroresDeValor,
  type FormularioDeValor,
  formularioDeValor,
  hayCambiosEnElValor,
  type ValorDelPanel,
} from '../../dominio/valores'
import { Campo } from '../comunes/campo'
import { HojaDeEdicion } from '../comunes/hoja-de-edicion'
import { useFormularioEnHoja } from '../comunes/use-formulario-en-hoja'
import { EliminarDeLaGuia } from '../guia/eliminar-de-la-guia'
import { SelectorDeIcono } from './selector-de-icono'

interface Props {
  // Nulo: «Nuevo valor».
  valor: ValorDelPanel | null
  puedeEliminar: boolean
  alCerrar: () => void
}

function Eliminar({ valor, alEliminar }: { valor: ValorDelPanel; alEliminar: () => void }) {
  return (
    <EliminarDeLaGuia
      accion="Eliminar valor"
      titulo={`¿Eliminar «${valor.nombre}»?`}
      texto="Deja de verse en «¿Por qué elegirnos?». No se puede deshacer."
      eliminar={() => eliminarElValor(valor.id)}
      alEliminar={alEliminar}
    />
  )
}

type Edicion = ReturnType<typeof useFormularioEnHoja<FormularioDeValor, ErroresDeValor>>

function Campos({
  formulario,
  errores,
  cambiar,
}: Pick<Edicion, 'formulario' | 'errores' | 'cambiar'>) {
  return (
    <>
      <Campo
        id="valor-nombre"
        etiqueta="Nombre"
        required
        maxLength={100}
        placeholder="Por ejemplo, Excelencia"
        value={formulario.nombre}
        error={errores.nombre}
        onChange={(evento) => cambiar('nombre', evento.target.value)}
      />
      <SelectorDeIcono
        valor={formulario.icono}
        error={errores.icono}
        alCambiar={(icono) => cambiar('icono', icono)}
      />
    </>
  )
}

// Panel lateral de un valor (`valor` nulo: uno nuevo): nombre e ícono. El servidor valida todo de
// nuevo; solo el administrador ve «Eliminar».
export function HojaDeValor({ valor, puedeEliminar, alCerrar }: Props) {
  const edicion = useFormularioEnHoja<FormularioDeValor, ErroresDeValor>({
    inicial: formularioDeValor(valor),
    hayCambios: hayCambiosEnElValor,
    guardarEnServidor: (datos) => guardarElValor(valor?.id ?? null, datos),
    alGuardar: alCerrar,
  })
  return (
    <HojaDeEdicion
      abierta
      alCerrar={alCerrar}
      titulo={valor ? 'Editar valor' : 'Nuevo valor'}
      descripcion="Se muestra con su ícono en «¿Por qué elegirnos?»."
      sucio={edicion.sucio}
      guardando={edicion.guardando}
      textoDeGuardar="Guardar valor"
      alGuardar={edicion.guardar}
      eliminar={valor && puedeEliminar && <Eliminar valor={valor} alEliminar={alCerrar} />}
    >
      <Campos formulario={edicion.formulario} errores={edicion.errores} cambiar={edicion.cambiar} />
      {!valor && (
        <p className="flex items-start gap-2 rounded-md border bg-muted px-3 py-2 text-[0.8125rem] text-muted-foreground">
          <Info aria-hidden="true" className="mt-[0.1rem] size-4 shrink-0" />
          Se agrega al final de la sección.
        </p>
      )}
    </HojaDeEdicion>
  )
}
