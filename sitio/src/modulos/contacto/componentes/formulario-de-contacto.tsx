'use client'

import { useId } from 'react'

import { Icono } from '@/compartido/componentes/iconos/icono'
import { propsDeRevelado } from '@/compartido/componentes/revelado/props-de-revelado'

import { AvisoDeEnvio } from './aviso-de-envio'
import { CamposDelMensaje } from './campos-del-mensaje'
import estilos from './contacto.module.css'
import { CAMPO_TRAMPA, valoresDe } from './estado-del-formulario'
import { useEnvioDeContacto } from './use-envio-de-contacto'

interface PropsFormularioDeContacto {
  titulo: string
  texto: string | null
  textoDelBoton: string
  opcionesDeServicio: readonly string[]
  celularWhatsApp: string
}

// Isla de cliente del formulario «Escríbenos» (T8): guarda el mensaje en el panel y abre
// WhatsApp con el mensaje listo, como la v4.
export function FormularioDeContacto(props: PropsFormularioDeContacto) {
  const { titulo, texto, textoDelBoton, opcionesDeServicio, celularWhatsApp } = props
  const prefijo = useId()
  const { formulario, accion, alEnviar, estado, errores, enviando, enlace } =
    useEnvioDeContacto(celularWhatsApp)
  return (
    <form
      ref={formulario}
      {...propsDeRevelado({ clase: estilos.formulario })}
      action={accion}
      onSubmit={alEnviar}
      noValidate
      aria-labelledby={`${prefijo}-titulo`}
    >
      <h3 id={`${prefijo}-titulo`}>{titulo}</h3>
      {texto ? <p>{texto}</p> : null}
      <CamposDelMensaje
        prefijo={prefijo}
        errores={errores}
        opcionesDeServicio={opcionesDeServicio}
        valores={valoresDe(estado)}
      />
      {/* Trampa para robots: una persona no la ve ni la alcanza con el teclado. */}
      <div className={estilos.trampa} aria-hidden="true">
        <label>
          No llenes este campo
          <input name={CAMPO_TRAMPA} type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <button className="boton boton-contacto" type="submit" disabled={enviando}>
        <Icono nombre="whatsapp" />
        {textoDelBoton}
      </button>
      <AvisoDeEnvio estado={estado.estado} enlace={enlace} />
    </form>
  )
}
