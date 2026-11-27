import { describe, expect, it } from 'vitest'

import type { SedeDeContactoGuardada } from '../dominio/sede-de-contacto'
import { crearListarSedesDeContacto } from './listar-sedes-de-contacto'
import type { RepositorioSedesDeContacto } from './repositorio-sedes'

const SEDE: SedeDeContactoGuardada = {
  nombre: 'Sede San Isidro',
  direccion: 'Calle Gorriones 151',
  distrito: 'San Isidro',
  ciudad: 'Lima',
  celulares: [{ numero: '951965242', tieneWhatsApp: true }],
  mapaIncrustado: null,
}

describe('crearListarSedesDeContacto', () => {
  it('prepara cada sede activa con el mensaje de WhatsApp del sitio, en su orden', async () => {
    const repositorio: RepositorioSedesDeContacto = {
      listarParaContacto: async () => [SEDE, { ...SEDE, nombre: 'Sede Dos' }],
    }

    const sedes = await crearListarSedesDeContacto(repositorio)('Hola')

    expect(sedes.map((sede) => sede.nombre)).toEqual(['Sede San Isidro', 'Sede Dos'])
    expect(sedes[0]?.whatsapp?.href).toBe('https://wa.me/51951965242?text=Hola')
  })

  it('devuelve una lista vacía si no hay sedes', async () => {
    const repositorio: RepositorioSedesDeContacto = { listarParaContacto: async () => [] }

    expect(await crearListarSedesDeContacto(repositorio)('Hola')).toEqual([])
  })
})
