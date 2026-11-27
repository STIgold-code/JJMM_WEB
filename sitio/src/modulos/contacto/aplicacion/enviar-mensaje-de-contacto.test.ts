import { describe, expect, it, vi } from 'vitest'

import type { DatosDelFormulario, MensajeDeContacto } from '../dominio/mensaje-de-contacto'
import {
  crearEnviarMensajeDeContacto,
  type SolicitudDeEnvio,
  TIEMPO_MINIMO_MS,
} from './enviar-mensaje-de-contacto'
import type { LimitadorDeEnvios } from './limitador-de-envios'

const DATOS: DatosDelFormulario = {
  nombre: 'Ana',
  celular: '987654321',
  correo: '',
  servicio: 'Asesoría legal',
  mensaje: 'Necesito constituir una empresa.',
}

const AHORA = 1_000_000

const solicitud = (cambios: Partial<SolicitudDeEnvio> = {}): SolicitudDeEnvio => ({
  datos: DATOS,
  trampa: '',
  inicioEn: AHORA - 10_000,
  ip: '200.1.1.1',
  ahora: AHORA,
  ...cambios,
})

function preparar(permitir = true) {
  const guardados: MensajeDeContacto[] = []
  const notificados: MensajeDeContacto[] = []
  const limitador: LimitadorDeEnvios = { permitir: vi.fn(() => permitir) }
  const enviar = crearEnviarMensajeDeContacto({
    repositorio: { guardar: async (mensaje) => void guardados.push(mensaje) },
    notificador: { notificar: async (mensaje) => void notificados.push(mensaje) },
    limitador,
  })
  return { enviar, guardados, notificados, limitador }
}

describe('crearEnviarMensajeDeContacto', () => {
  it('guarda el mensaje válido, avisa al estudio y responde enviado', async () => {
    const { enviar, guardados, notificados } = preparar()

    expect(await enviar(solicitud())).toEqual({ estado: 'enviado' })
    expect(guardados).toEqual([
      {
        nombre: 'Ana',
        celular: '987654321',
        correo: null,
        servicio: 'Asesoría legal',
        mensaje: 'Necesito constituir una empresa.',
      },
    ])
    expect(notificados).toEqual(guardados)
  })

  it('devuelve los errores y no guarda un mensaje inválido', async () => {
    const { enviar, guardados } = preparar()

    const resultado = await enviar(solicitud({ datos: { ...DATOS, nombre: '' } }))

    expect(resultado).toEqual({
      estado: 'invalido',
      errores: { nombre: 'Escribe tu nombre para saber cómo dirigirnos a ti.' },
    })
    expect(guardados).toEqual([])
  })

  it('descarta sin avisar el envío con el campo trampa lleno', async () => {
    const { enviar, guardados, limitador } = preparar()

    expect(await enviar(solicitud({ trampa: 'https://spam.example' }))).toEqual({
      estado: 'enviado',
    })
    expect(guardados).toEqual([])
    expect(limitador.permitir).not.toHaveBeenCalled()
  })

  it('descarta sin avisar el envío más rápido que una persona o sin hora de inicio', async () => {
    const { enviar, guardados } = preparar()

    await enviar(solicitud({ inicioEn: AHORA - TIEMPO_MINIMO_MS + 1 }))
    await enviar(solicitud({ inicioEn: null }))
    await enviar(solicitud({ inicioEn: AHORA + 5_000 }))

    expect(guardados).toEqual([])
  })

  it('rechaza cuando la misma dirección supera el límite de envíos', async () => {
    const { enviar, guardados, limitador } = preparar(false)

    expect(await enviar(solicitud())).toEqual({ estado: 'limite' })
    expect(limitador.permitir).toHaveBeenCalledWith('200.1.1.1', AHORA)
    expect(guardados).toEqual([])
  })

  it('no oculta un error al guardar', async () => {
    const enviar = crearEnviarMensajeDeContacto({
      repositorio: { guardar: async () => Promise.reject(new Error('base caída')) },
      notificador: { notificar: async () => undefined },
      limitador: { permitir: () => true },
    })

    await expect(enviar(solicitud())).rejects.toThrow('base caída')
  })
})
