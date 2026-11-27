import { describe, expect, it } from 'vitest'

import { crearObtenerGuiaDeClientes } from './obtener-guia-de-clientes'
import type { RepositorioGuiaDeClientes } from './repositorio-guia-de-clientes'

describe('crearObtenerGuiaDeClientes', () => {
  it('prepara los textos guardados de la página', async () => {
    const repositorio: RepositorioGuiaDeClientes = {
      obtener: async () => ({
        titulo: 'Guía de clientes',
        tituloDeAvisos: 'Avisos para clientes',
        tituloDeVencimientos: 'Vencimientos tributarios',
        tituloDelCronograma: 'Cronograma de SUNAT',
      }),
    }

    const guia = await crearObtenerGuiaDeClientes(repositorio)()

    expect(guia?.titulo).toBe('Guía de clientes')
    expect(guia?.introduccion).toBeNull()
  })

  it('devuelve null si la página nunca se guardó', async () => {
    const repositorio: RepositorioGuiaDeClientes = { obtener: async () => ({}) }

    expect(await crearObtenerGuiaDeClientes(repositorio)()).toBeNull()
  })
})
