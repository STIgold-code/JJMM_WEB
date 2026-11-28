'use client'

import { Info, TriangleAlert } from 'lucide-react'

import { eliminarElCliente, guardarElCliente } from '../../acciones/clientes'
import {
  type ClienteDelPanel,
  type FormularioDeCliente,
  formularioDeCliente,
  formularioDeClienteParaGuardar,
  hayCambiosEnElCliente,
  nombrePorConfirmar,
} from '../../dominio/clientes'
import type { ErroresDeCliente } from '../../dominio/validacion-de-cliente'
import { Campo } from '../comunes/campo'
import { FilaVisible } from '../comunes/fila-visible'
import { HojaDeEdicion } from '../comunes/hoja-de-edicion'
import { SelectorDeImagen } from '../comunes/selector-de-imagen'
import { useFormularioEnHoja } from '../comunes/use-formulario-en-hoja'
import { EliminarDeLaGuia } from '../guia/eliminar-de-la-guia'

interface Props {
  // Nulo: «Nuevo cliente».
  cliente: ClienteDelPanel | null
  puedeEliminar: boolean
  alCerrar: () => void
}

const NOTA = 'flex items-start gap-2 rounded-md border px-3 py-2 text-[0.8125rem]'

function Eliminar({ cliente, alEliminar }: { cliente: ClienteDelPanel; alEliminar: () => void }) {
  return (
    <EliminarDeLaGuia
      accion="Eliminar cliente"
      titulo={`¿Eliminar a ${cliente.nombre}?`}
      texto="Su logotipo deja de verse en «Nuestros clientes». La imagen sigue en Imágenes. Si solo quieres dejar de mostrarlo, apaga «Visible en el sitio»."
      eliminar={() => eliminarElCliente(cliente.id)}
      alEliminar={alEliminar}
    />
  )
}

type Edicion = ReturnType<typeof useFormularioEnHoja<FormularioDeCliente, ErroresDeCliente>>

type PropsDeCampos = Pick<Edicion, 'formulario' | 'errores' | 'cambiar'>

// El nombre es también el texto alternativo del logotipo; uno «por confirmar» lleva su nota.
function Nombre({ formulario, errores, cambiar }: PropsDeCampos) {
  return (
    <div className="grid gap-2">
      <Campo
        id="cliente-nombre"
        etiqueta="Nombre"
        required
        maxLength={200}
        ayuda="Tal como el cliente quiere aparecer. También es el texto alternativo del logotipo."
        value={formulario.nombre}
        error={errores.nombre}
        onChange={(evento) => cambiar('nombre', evento.target.value)}
      />
      {nombrePorConfirmar(formulario.nombre) && (
        <p className={`${NOTA} border-pendiente-borde bg-pendiente-fondo text-pendiente`}>
          <TriangleAlert aria-hidden="true" className="mt-[0.1rem] size-4 shrink-0" />
          Este nombre está por confirmar con el estudio.
        </p>
      )}
    </div>
  )
}

function Campos(props: PropsDeCampos) {
  const { formulario, errores, cambiar } = props
  return (
    <>
      <SelectorDeImagen
        id="cliente-logo"
        etiqueta="Logotipo"
        valor={formulario.logo}
        alCambiar={(logo) => cambiar('logo', logo)}
        ayuda="PNG con fondo transparente o blanco. Se muestra en gris y toma color al pasar el mouse."
        error={errores.logo}
      />
      <Nombre {...props} />
      <Campo
        id="cliente-enlace"
        etiqueta="Sitio web del cliente"
        type="url"
        inputMode="url"
        placeholder="https://"
        maxLength={500}
        ayuda="Opcional. Si lo escribes, el logotipo lleva a ese sitio en una pestaña nueva."
        value={formulario.enlace}
        error={errores.enlace}
        onChange={(evento) => cambiar('enlace', evento.target.value)}
      />
      <FilaVisible
        id="cliente-visible"
        visible={formulario.visible}
        ayuda="Apágalo para dejar de mostrar el logotipo sin borrarlo."
        alCambiar={(visible) => cambiar('visible', visible)}
      />
    </>
  )
}

// Panel lateral de un cliente (`cliente` nulo: uno nuevo, oculto y al final). El servidor valida
// todo de nuevo; solo el administrador ve «Eliminar».
export function HojaDeCliente({ cliente, puedeEliminar, alCerrar }: Props) {
  const edicion = useFormularioEnHoja<FormularioDeCliente, ErroresDeCliente>({
    inicial: formularioDeCliente(cliente),
    hayCambios: hayCambiosEnElCliente,
    guardarEnServidor: (formulario) =>
      guardarElCliente(cliente?.id ?? null, formularioDeClienteParaGuardar(formulario)),
    alGuardar: alCerrar,
  })
  return (
    <HojaDeEdicion
      abierta
      alCerrar={alCerrar}
      titulo={cliente ? 'Editar cliente' : 'Nuevo cliente'}
      descripcion="Publica solo clientes reales que aceptaron aparecer."
      sucio={edicion.sucio}
      guardando={edicion.guardando}
      textoDeGuardar="Guardar cliente"
      alGuardar={edicion.guardar}
      eliminar={cliente && puedeEliminar && <Eliminar cliente={cliente} alEliminar={alCerrar} />}
    >
      <Campos formulario={edicion.formulario} errores={edicion.errores} cambiar={edicion.cambiar} />
      {!cliente && (
        <p className={`${NOTA} bg-muted text-muted-foreground`}>
          <Info aria-hidden="true" className="mt-[0.1rem] size-4 shrink-0" />
          Se agrega al final del carrusel.
        </p>
      )}
    </HojaDeEdicion>
  )
}
