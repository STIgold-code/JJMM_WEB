import type { DatosDelFormulario, ErroresDelMensaje } from '../dominio/mensaje-de-contacto'
import { CampoDeFormulario } from './campo-de-formulario'

interface PropsDeCampos {
  prefijo: string
  errores: ErroresDelMensaje
  // Valores que vuelven del servidor cuando el envío no se guardó.
  valores: DatosDelFormulario | null
}

const comunes = ({ prefijo, errores }: PropsDeCampos, campo: keyof DatosDelFormulario) => ({
  campo,
  prefijo,
  error: errores[campo],
})

// Quién escribe: nombre, celular (obligatorio, para responderle) y correo opcional.
function CamposDePersona(props: PropsDeCampos) {
  const { valores } = props
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
      <CampoDeFormulario {...comunes(props, 'celular')} etiqueta="Celular">
        {(control) => (
          <input
            {...control}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            required
            defaultValue={valores?.celular}
          />
        )}
      </CampoDeFormulario>
      <CampoDeFormulario {...comunes(props, 'correo')} etiqueta="Correo (opcional)">
        {(control) => (
          <input {...control} type="email" autoComplete="email" defaultValue={valores?.correo} />
        )}
      </CampoDeFormulario>
    </>
  )
}

// Qué necesita: el servicio (opciones del panel) y su caso.
function CamposDelCaso(props: PropsDeCampos & { opcionesDeServicio: readonly string[] }) {
  const { valores, opcionesDeServicio } = props
  return (
    <>
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

// Campos del formulario «Escríbenos». La validación la hace el dominio, por eso no se usa la
// del navegador (noValidate en el formulario) y los mensajes son siempre los mismos.
export function CamposDelMensaje(props: PropsDeCampos & { opcionesDeServicio: readonly string[] }) {
  return (
    <>
      <CamposDePersona {...props} />
      <CamposDelCaso {...props} />
    </>
  )
}
