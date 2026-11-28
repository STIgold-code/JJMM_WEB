'use client'

import type { FormularioDeArea } from '../../dominio/formulario-de-area'
import type { ErroresDeArea } from '../../dominio/validacion-de-area'
import { AreaDeTexto } from '../comunes/area-de-texto'
import { Campo } from '../comunes/campo'
import { TarjetaDelPanel } from '../inicio/tarjeta-del-panel'
import type { CambiosDelArea, CampoDeTextoDelArea } from './use-edicion-de-area'

export interface PropsDeSeccionDelArea {
  formulario: FormularioDeArea
  errores: ErroresDeArea
  cambios: CambiosDelArea
}

// Valor, error y cambio de un campo de texto (se llaman igual en el formulario y en los errores).
function enlazarCon({ formulario, errores, cambios }: PropsDeSeccionDelArea) {
  return (campo: Exclude<CampoDeTextoDelArea, 'poligono'>) => ({
    value: formulario[campo],
    error: errores[campo],
    onChange: (evento: { target: { value: string } }) =>
      cambios.cambiarTexto(campo, evento.target.value),
  })
}

function Nombres(props: PropsDeSeccionDelArea) {
  const enlazar = enlazarCon(props)
  return (
    <>
      <Campo
        id="area-nombre"
        etiqueta="Nombre"
        required
        maxLength={200}
        ayuda="Título de la pestaña abierta, por ejemplo «Sistema de calidad»."
        {...enlazar('nombre')}
      />
      <Campo
        id="area-corto"
        etiqueta="Nombre corto"
        required
        maxLength={60}
        ayuda="Va en el botón de la pestaña, debajo del código. Por ejemplo «Calidad»."
        {...enlazar('nombreCorto')}
      />
    </>
  )
}

// «Datos del área»: nombre, nombre corto, descripción y mensaje de WhatsApp. El código no está:
// identifica el gajo de la rueda.
export function DatosDelArea(props: PropsDeSeccionDelArea) {
  const enlazar = enlazarCon(props)
  return (
    <TarjetaDelPanel
      idDelTitulo="titulo-datos"
      titulo="Datos del área"
      bajada="El código es fijo: identifica el gajo de la rueda."
    >
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 px-5 py-5 sm:grid-cols-2">
        <Nombres {...props} />
        <div className="sm:col-span-2">
          <AreaDeTexto
            id="area-descripcion"
            etiqueta="Descripción"
            rows={5}
            required
            maxLength={2000}
            {...enlazar('descripcion')}
          />
        </div>
        <Campo
          id="area-mensaje"
          etiqueta="Mensaje de WhatsApp al pulsar «Consultar este servicio»"
          className="grid gap-[0.4rem] sm:col-span-2"
          maxLength={400}
          ayuda="Opcional. Si lo dejas vacío, se usa el mensaje por defecto de Datos del estudio."
          {...enlazar('mensaje')}
        />
      </div>
    </TarjetaDelPanel>
  )
}
