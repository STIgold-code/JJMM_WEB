import type { FormEvent, RefObject } from 'react'

import type { PeriodoPublico } from '../aplicacion/obtener-cronograma-sunat'
import estilos from './cronograma.module.css'

const ID_DEL_ERROR = 'consulta-ruc-error'
const ID_DE_LA_AYUDA = 'consulta-ruc-ayuda'

interface PropsSelectorDePeriodo {
  periodos: readonly PeriodoPublico[]
  clave: string
  alElegir: (clave: string) => void
}

function SelectorDePeriodo({ periodos, clave, alElegir }: PropsSelectorDePeriodo) {
  return (
    <div className={estilos.campo}>
      <label htmlFor="consulta-periodo">Periodo tributario</label>
      <select id="consulta-periodo" value={clave} onChange={(e) => alElegir(e.target.value)}>
        {periodos.map((periodo) => (
          <option key={periodo.clave} value={periodo.clave}>
            {periodo.periodo}
          </option>
        ))}
      </select>
    </div>
  )
}

interface PropsCampoRuc {
  valor: string
  alEscribir: (valor: string) => void
  error: string | null
  referencia: RefObject<HTMLInputElement | null>
}

// El error se asocia al campo (aria-invalid + aria-describedby) para que se anuncie al
// volver el foco.
function CampoRuc({ valor, alEscribir, error, referencia }: PropsCampoRuc) {
  return (
    <div className={estilos.campo}>
      <label htmlFor="consulta-ruc">Tu RUC</label>
      <input
        ref={referencia}
        id="consulta-ruc"
        name="ruc"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        maxLength={13}
        value={valor}
        onChange={(e) => alEscribir(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${ID_DE_LA_AYUDA} ${ID_DEL_ERROR}` : ID_DE_LA_AYUDA}
      />
      <p id={ID_DE_LA_AYUDA} className={estilos.ayuda}>
        Son 11 dígitos. Tu fecha depende del último.
      </p>
      {error ? (
        <p id={ID_DEL_ERROR} className={estilos.error}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

interface PropsFormularioDeConsulta {
  periodos: readonly PeriodoPublico[]
  clave: string
  alElegirPeriodo: (clave: string) => void
  ruc: string
  alEscribirRuc: (ruc: string) => void
  error: string | null
  campoRuc: RefObject<HTMLInputElement | null>
  alConsultar: (evento: FormEvent<HTMLFormElement>) => void
}

export function FormularioDeConsulta(props: PropsFormularioDeConsulta) {
  return (
    <form className={estilos.formulario} onSubmit={props.alConsultar} noValidate>
      <SelectorDePeriodo
        periodos={props.periodos}
        clave={props.clave}
        alElegir={props.alElegirPeriodo}
      />
      <CampoRuc
        valor={props.ruc}
        alEscribir={props.alEscribirRuc}
        error={props.error}
        referencia={props.campoRuc}
      />
      <button type="submit" className="boton boton-azul">
        Ver mi fecha
      </button>
    </form>
  )
}
