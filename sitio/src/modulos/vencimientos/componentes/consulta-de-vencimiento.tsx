'use client'

import { type FormEvent, useRef, useState } from 'react'

import { consultarVencimiento } from '../aplicacion/consultar-vencimiento'
import type { PeriodoPublico } from '../aplicacion/obtener-cronograma-sunat'
import estilos from './cronograma.module.css'
import { FormularioDeConsulta } from './formulario-de-consulta'
import { MENSAJES_DE_ERROR, textoDelResultado } from './mensajes-de-consulta'
import { TablaDeFechas } from './tabla-de-fechas'

interface PropsConsultaDeVencimiento {
  periodos: readonly PeriodoPublico[]
  claveInicial: string
}

interface EstadoVisible {
  error: string | null
  mensaje: string | null
  digito: number | null
}

const SIN_CONSULTA: EstadoVisible = { error: null, mensaje: null, digito: null }

function estadoVisible(periodo: PeriodoPublico, consultado: string | null): EstadoVisible {
  if (consultado === null) return SIN_CONSULTA
  const resultado = consultarVencimiento(periodo, consultado)
  if (resultado.tipo === 'error') {
    return { ...SIN_CONSULTA, error: MENSAJES_DE_ERROR[resultado.motivo] }
  }
  const mensaje = textoDelResultado(resultado.digito, periodo.periodo, resultado.texto)
  return { error: null, mensaje, digito: resultado.digito }
}

// Isla de cliente: busca la fecha de vencimiento de un RUC en el periodo elegido. Las
// fechas llegan ya escritas desde el servidor, así que no hay diferencias al hidratar.
export function ConsultaDeVencimiento({ periodos, claveInicial }: PropsConsultaDeVencimiento) {
  const [clave, setClave] = useState(claveInicial)
  const [ruc, setRuc] = useState('')
  const [consultado, setConsultado] = useState<string | null>(null)
  const campoRuc = useRef<HTMLInputElement>(null)
  const periodo = periodos.find((p) => p.clave === clave) ?? periodos[0]
  if (!periodo) return null

  const { error, mensaje, digito } = estadoVisible(periodo, consultado)
  const alConsultar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    setConsultado(ruc)
    // Con un RUC que no sirve, el foco vuelve al campo, que anuncia el error.
    if (consultarVencimiento(periodo, ruc).tipo === 'error') campoRuc.current?.focus()
  }

  return (
    <div className={estilos.consulta}>
      <FormularioDeConsulta
        periodos={periodos}
        clave={periodo.clave}
        alElegirPeriodo={setClave}
        ruc={ruc}
        alEscribirRuc={setRuc}
        error={error}
        campoRuc={campoRuc}
        alConsultar={alConsultar}
      />
      <p className={estilos.resultado} role="status">
        {mensaje}
      </p>
      <TablaDeFechas periodo={periodo} digitoResaltado={digito} />
    </div>
  )
}
