'use client'

import { type FormEvent, useActionState, useEffect, useRef, useState } from 'react'

import { enlaceDeConsulta } from '../dominio/enlace-de-consulta'
import {
  type CampoDelMensaje,
  type ErroresDelMensaje,
  primerCampoConError,
  textoParaWhatsApp,
  validarMensajeDeContacto,
} from '../dominio/mensaje-de-contacto'
import { enviarMensajeDeContacto } from './enviar-mensaje-de-contacto'
import { CAMPO_INICIO, ESTADO_INICIAL, leerDatos } from './estado-del-formulario'

function enfocar(formulario: HTMLFormElement | null, campo: CampoDelMensaje | null) {
  const elemento = campo ? formulario?.elements.namedItem(campo) : null
  if (elemento instanceof HTMLElement) elemento.focus()
}

// Envío del formulario: valida en el navegador con las reglas del dominio; si todo está bien,
// abre WhatsApp en el mismo clic (sin que el navegador lo bloquee) y guarda el mensaje con la
// acción del servidor. Los errores del servidor se muestran igual que los del navegador.
export function useEnvioDeContacto(celularWhatsApp: string) {
  const [estado, despachar, enviando] = useActionState(enviarMensajeDeContacto, ESTADO_INICIAL)
  const [erroresLocales, setErroresLocales] = useState<ErroresDelMensaje>({})
  const [enlace, setEnlace] = useState<string | null>(null)
  const formulario = useRef<HTMLFormElement>(null)
  const inicio = useRef(0)

  useEffect(() => {
    inicio.current = Date.now()
  }, [])

  useEffect(() => {
    if (estado.estado === 'invalido')
      enfocar(formulario.current, primerCampoConError(estado.errores))
  }, [estado])

  const errores =
    estado.estado === 'invalido' ? { ...estado.errores, ...erroresLocales } : erroresLocales

  function alEnviar(evento: FormEvent<HTMLFormElement>) {
    const validacion = validarMensajeDeContacto(leerDatos(new FormData(evento.currentTarget)))
    if (!validacion.valido) {
      evento.preventDefault()
      setErroresLocales(validacion.errores)
      enfocar(evento.currentTarget, primerCampoConError(validacion.errores))
      return
    }
    setErroresLocales({})
    const { href } = enlaceDeConsulta(
      { celularWhatsApp, mensajeWhatsApp: '' },
      textoParaWhatsApp(validacion.mensaje),
    )
    setEnlace(href)
    window.open(href, '_blank', 'noopener')
  }

  // La hora de inicio se agrega aquí: es la del primer dibujo del formulario en el navegador.
  const accion = (datos: FormData) => {
    datos.set(CAMPO_INICIO, String(inicio.current))
    despachar(datos)
  }

  return { estado, accion, enviando, errores, enlace, alEnviar, formulario }
}
