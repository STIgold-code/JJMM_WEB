import type { PaginaDeInicio } from '@/payload-types'

import type { PaginaDeInicioSemilla, PortadaSemilla } from '../datos/tipos'
import type { PuertoDeCarga } from '../puerto-de-carga'
import type { IdsDeMedios } from './cargar-medios'
import { idDeSede, type IdsDeSedes } from './cargar-sitio'
import { aTextoEnriquecido } from './texto-enriquecido'

type Seccion = NonNullable<PaginaDeInicio['secciones']>[number]

const portada = (datos: PortadaSemilla, medios: IdsDeMedios) => ({
  ...datos,
  imagen: medios.de(datos.imagen),
  imagenParaCelular: medios.opcional(datos.imagenParaCelular),
  sello: medios.opcional(datos.sello),
})

// Secciones en el orden del inicio v4.
function secciones(
  pagina: PaginaDeInicioSemilla,
  medios: IdsDeMedios,
  sedes: IdsDeSedes,
): Seccion[] {
  const { carrusel, quienesSomos, servicios, contacto } = pagina
  return [
    {
      blockType: 'carrusel-de-portadas',
      segundosPorPortada: carrusel.segundosPorPortada,
      portadas: carrusel.portadas.map((p) => portada(p, medios)),
    },
    {
      blockType: 'quienes-somos',
      ...quienesSomos,
      presentacion: aTextoEnriquecido(quienesSomos.presentacion),
    },
    {
      blockType: 'servicios',
      ...servicios,
      imagenDeLaRueda: medios.de(servicios.imagenDeLaRueda),
    },
    { blockType: 'planes', ...pagina.planes },
    { blockType: 'por-que-elegirnos', ...pagina.porQueElegirnos },
    { blockType: 'clientes', ...pagina.clientes },
    { blockType: 'contacto', ...contacto, sedeDelMapa: idDeSede(sedes, contacto.sedeDelMapa) },
  ]
}

export async function cargarPaginaDeInicio(
  puerto: PuertoDeCarga,
  pagina: PaginaDeInicioSemilla,
  medios: IdsDeMedios,
  sedes: IdsDeSedes,
): Promise<void> {
  await puerto.actualizarGlobal('pagina-de-inicio', {
    secciones: secciones(pagina, medios, sedes),
  })
}
