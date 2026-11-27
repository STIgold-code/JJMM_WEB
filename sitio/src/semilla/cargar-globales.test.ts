import { describe, expect, it } from 'vitest'

import { cargarSemilla } from './cargar'
import { SEMILLA } from './datos'
import type { DatosDeSemilla } from './datos/tipos'
import { PuertoEnMemoria } from './prueba/puerto-en-memoria'

const OPCIONES = { resolverRuta: (archivo: string) => archivo, administrador: null }

async function cargar(datos: DatosDeSemilla = SEMILLA): Promise<PuertoEnMemoria> {
  const puerto = new PuertoEnMemoria()
  await cargarSemilla(puerto, datos, OPCIONES)
  return puerto
}

const lista = (valor: unknown): Record<string, unknown>[] => (Array.isArray(valor) ? valor : [])

const idDeMedio = (puerto: PuertoEnMemoria, archivo: string) =>
  puerto.documentos('medios').find((d) => d.datos.filename === archivo)?.id

const seccionesDelInicio = (puerto: PuertoEnMemoria) =>
  lista(puerto.globales.get('pagina-de-inicio')?.secciones)

describe('cargarSemilla: globales', () => {
  it('arma el inicio con los siete bloques en el orden de la v4', async () => {
    const secciones = seccionesDelInicio(await cargar())

    expect(secciones.map((s) => s.blockType)).toEqual([
      'carrusel-de-portadas',
      'quienes-somos',
      'servicios',
      'planes',
      'por-que-elegirnos',
      'clientes',
      'contacto',
    ])
  })

  it('cambia los nombres de archivo y de sede por sus id', async () => {
    const puerto = await cargar()
    const [carrusel, , servicios, , , , contacto] = seccionesDelInicio(puerto)
    const sedeDelMapa = puerto
      .documentos('sedes')
      .find((d) => d.datos.nombre === 'Sede San Martín de Porres')?.id

    expect(lista(carrusel?.portadas)[0]?.imagen).toBe(idDeMedio(puerto, 'hero-plan.webp'))
    expect(servicios?.imagenDeLaRueda).toBe(idDeMedio(puerto, 'rueda-sige-mype.webp'))
    expect(contacto?.sedeDelMapa).toBe(sedeDelMapa)
  })

  it('convierte la presentación a texto enriquecido con negritas', async () => {
    const texto = JSON.stringify(seccionesDelInicio(await cargar())[1]?.presentacion)

    expect(texto).toContain('"text":"Estudio Contable JJMM S.A.C.","format":1')
    expect(texto).toContain('"text":"Somos el ","format":0')
  })

  it('el ítem SIGEFact del menú usa el id del logo de SIGEFact', async () => {
    const puerto = await cargar()
    const items = lista(puerto.globales.get('navegacion')?.items)

    expect(items.find((item) => item.etiqueta === 'SIGEFact')?.imagen).toBe(
      idDeMedio(puerto, 'sigefact.png'),
    )
    expect(items.find((item) => item.etiqueta === 'Blog')?.imagen).toBeNull()
  })

  it('falla con un mensaje claro si un medio referenciado no está en la lista', async () => {
    const medios = SEMILLA.medios.filter((m) => !m.archivo.endsWith('logo-jjmm.png'))

    await expect(cargar({ ...SEMILLA, medios })).rejects.toThrow('«logo-jjmm.png»')
  })
})
