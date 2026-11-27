import type { DatosDelFormulario, ErroresDelMensaje } from '../dominio/mensaje-de-contacto'
import { CampoDeFormulario } from './campo-de-formulario'

interface PropsDeCampos {
  prefijo: string
  errores: ErroresDelMensaje
  opcionesDeServicio: readonly string[]
  // Valores que vuelven del servidor cuando el envío no se guardó.
  valores: DatosDelFormulario | null
}

const comunes = ({ prefijo, errores }: PropsDeCampos, campo: keyof DatosDelFormulario) => ({
  campo,
  prefijo,
  error: errores[campo],
})

// Campos del formulario «Escríbenos», los tres de la v5: nombre, servicio (opciones del panel)
// y caso. La validación la hace el dominio, por eso no se usa la del navegador (noValidate en
// el formulario) y los mensajes son siempre los mismos.
export function CamposDelMensaje(props: PropsDeCampos) {
  const { valores, opcionesDeServicio } = props
  return (
    <>
      <CampoDeFormulario {...comunes(props, 'nombre')} etiqueta="Nombre y apellido">
        {(control) => (
          <input
            {...control}
            type="text"
            autoComplete="name"
            required
            defaultValue={valores?.nombre}
          />
        )}
      </CampoDeFormulario>
      {opcionesDeServicio.length > 0 ? (
        <CampoDeFormulario {...comunes(props, 'servicio')} etiqueta="¿Qué necesitas?">
          {(control) => (
            <select {...control} defaultValue={valores?.servicio}>
              {opcionesDeServicio.map((opcion) => (
                <option key={opcion}>{opcion}</option>
              ))}
            </select>
          )}
        </CampoDeFormulario>
      ) : null}
      <CampoDeFormulario {...comunes(props, 'mensaje')} etiqueta="Cuéntanos tu caso">
        {(control) => <textarea {...control} required defaultValue={valores?.mensaje} />}
      </CampoDeFormulario>
    </>
  )
}
