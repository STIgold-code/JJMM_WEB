import { describe, expect, it } from 'vitest'

import type { SedeDelPanel } from '../dominio/sedes'
import {
  obtenerEdicionDeSede,
  obtenerListadoDeSedes,
  obtenerNuevaSede,
  type RepositorioDeLecturaDeSedes,
  TEXTOS_DE_CONTACTO_PREDETERMINADOS,
} from './consultar-sedes'

const sede = (id: number, visible: boolean, distrito: string): SedeDelPanel => ({
  id,
  nombre: `Sede ${distrito}`,
  direccion: 'Jr. Iquitos 593',
  distrito,
  ciudad: 'Lima',
  celulares: [{ numero: '951 965 242', tieneWhatsApp: true }],
  correo: null,
  mapa: null,
  visible,
  orden: id,
})

const SEDES = [sede(1, true, 'San Martín de Porres'), sede(2, false, 'San Isidro')]

const repositorio = (
  textos: Awaited<ReturnType<RepositorioDeLecturaDeSedes['leerTextosDeContacto']>> = null,
): RepositorioDeLecturaDeSedes => ({
  listarSedes: async () => SEDES,
  leerTextosDeContacto: async () => textos,
})

describe('obtenerListadoDeSedes', () => {
  it('devuelve las sedes en el orden guardado', async () => {
    expect((await obtenerListadoDeSedes(repositorio())).map((s) => s.id)).toEqual([1, 2])
  })
})

describe('obtenerEdicionDeSede', () => {
  it('arma el formulario, las pestañas y cuántas otras sedes se ven', async () => {
    const datos = await obtenerEdicionDeSede(repositorio(), '1')
    expect(datos?.sede?.id).toBe(1)
    expect(datos?.formulario.nombre).toBe('Sede San Martín de Porres')
    expect(datos?.pestanas).toEqual([
      { id: 1, distrito: 'San Martín de Porres', visible: true },
      { id: 2, distrito: 'San Isidro', visible: false },
    ])
    expect(datos?.otrasVisibles).toBe(0)
    expect(datos?.textos).toEqual(TEXTOS_DE_CONTACTO_PREDETERMINADOS)
  })

  it('usa los textos de los botones de «Contáctanos» si la página los tiene', async () => {
    const textos = { titulo: 'Escríbenos', comoLlegar: null, verMapa: 'Abrir mapa' }
    expect((await obtenerEdicionDeSede(repositorio(textos), 2))?.textos).toEqual(textos)
  })

  it.each(['x', '0', 9])('con el id «%s» no hay sede que editar', async (id) => {
    expect(await obtenerEdicionDeSede(repositorio(), id)).toBeNull()
  })
})

describe('obtenerNuevaSede', () => {
  it('empieza vacía, sin sede guardada, y cuenta las sedes visibles', async () => {
    const datos = await obtenerNuevaSede(repositorio())
    expect(datos.sede).toBeNull()
    expect(datos.formulario.nombre).toBe('')
    expect(datos.otrasVisibles).toBe(1)
  })
})
