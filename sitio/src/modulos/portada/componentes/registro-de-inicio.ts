import type { RegistroDeBloques } from '@/compartido/componentes/bloques/registro-de-bloques'
import { ClientesContenedor } from '@/modulos/clientes/componentes/clientes-contenedor'
import { ContactoContenedor } from '@/modulos/contacto/componentes/contacto-contenedor'
import { PorQueElegirnosContenedor } from '@/modulos/nosotros/componentes/por-que-elegirnos-contenedor'
import { QuienesSomosContenedor } from '@/modulos/nosotros/componentes/quienes-somos-contenedor'
import { PlanesContenedor } from '@/modulos/planes/componentes/planes-contenedor'
import { ServiciosContenedor } from '@/modulos/servicios/componentes/servicios-contenedor'

import type { SeccionDeInicio } from '../infraestructura/repositorio-pagina-de-inicio-payload'
import { CarruselDePortadas } from './carrusel-de-portadas'

// Registro `tipo → componente` de la página de inicio (ADR 0001). Cada sección vive en su
// módulo; un bloque nuevo se agrega con una entrada más.
export const REGISTRO_DE_INICIO: RegistroDeBloques<SeccionDeInicio> = {
  'carrusel-de-portadas': CarruselDePortadas,
  'quienes-somos': QuienesSomosContenedor,
  servicios: ServiciosContenedor,
  planes: PlanesContenedor,
  'por-que-elegirnos': PorQueElegirnosContenedor,
  clientes: ClientesContenedor,
  contacto: ContactoContenedor,
}
