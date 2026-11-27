import { describe, expect, it } from 'vitest'

import type { AvisoGuardado } from '../dominio/aviso'
import { crearListarAvisos } from './listar-avisos'
import type { RepositorioAvisos } from './repositorio-avisos'

const aviso = (titulo: string): AvisoGuardado => ({
  titulo,
  cuandoAplica: 'Inicia el 20 de cada mes.',
  documentos: ['Permisos'],
  correoDeContacto: 'recursoshumanos@jjmm.com.pe',
})

describe('crearListarAvisos', () => {
  it('prepara cada aviso activo que entrega el repositorio, en su orden', async () => {
    const repositorio: RepositorioAvisos = {
      listarActivos: async () => [aviso('Cierre tributario'), aviso('Cierre de planilla')],
    }

    const avisos = await crearListarAvisos(repositorio)()

    expect(avisos.map((a) => a.titulo)).toEqual(['Cierre tributario', 'Cierre de planilla'])
    expect(avisos[0]?.correo?.href).toBe('mailto:recursoshumanos@jjmm.com.pe')
  })

  it('devuelve una lista vacía si no hay avisos', async () => {
    const repositorio: RepositorioAvisos = { listarActivos: async () => [] }

    expect(await crearListarAvisos(repositorio)()).toEqual([])
  })
})
