import type { CollectionConfig, GlobalConfig } from 'payload'

import { coleccionMedios } from './compartido/infraestructura/coleccion-medios'
import { globalConfiguracionDelSitio } from './compartido/infraestructura/global-configuracion-del-sitio'
import { coleccionAvisosParaClientes } from './modulos/avisos/infraestructura/coleccion-avisos-para-clientes'
import { globalGuiaDeClientes } from './modulos/avisos/infraestructura/global-guia-de-clientes'
import { coleccionCategorias } from './modulos/blog/infraestructura/coleccion-categorias'
import { coleccionEtiquetas } from './modulos/blog/infraestructura/coleccion-etiquetas'
import { coleccionPublicaciones } from './modulos/blog/infraestructura/coleccion-publicaciones'
import { globalPaginaDelBlog } from './modulos/blog/infraestructura/global-pagina-del-blog'
import { coleccionClientes } from './modulos/clientes/infraestructura/coleccion-clientes'
import { coleccionMensajesDeContacto } from './modulos/contacto/infraestructura/coleccion-mensajes-de-contacto'
import { globalNavegacion } from './modulos/navegacion/infraestructura/global-navegacion'
import { coleccionValores } from './modulos/nosotros/infraestructura/coleccion-valores'
import { coleccionCaracteristicasDePlan } from './modulos/planes/infraestructura/coleccion-caracteristicas-de-plan'
import { coleccionInclusionesDePlan } from './modulos/planes/infraestructura/coleccion-inclusiones-de-plan'
import { coleccionPlanes } from './modulos/planes/infraestructura/coleccion-planes'
import { globalPaginaDeInicio } from './modulos/portada/infraestructura/global-pagina-de-inicio'
import { coleccionSedes } from './modulos/sedes/infraestructura/coleccion-sedes'
import { coleccionAreasDeServicio } from './modulos/servicios/infraestructura/coleccion-areas-de-servicio'
import { coleccionUsuarios } from './modulos/usuarios/infraestructura/coleccion-usuarios'
import { coleccionCronogramasSunat } from './modulos/vencimientos/infraestructura/coleccion-cronogramas-sunat'
import { coleccionVencimientos } from './modulos/vencimientos/infraestructura/coleccion-vencimientos'

// Raíz de composición del modelo de datos: todas las colecciones y globales del panel.
// El orden define el orden dentro de cada grupo del menú del panel.
export const COLECCIONES: CollectionConfig[] = [
  coleccionAreasDeServicio,
  coleccionPlanes,
  coleccionCaracteristicasDePlan,
  coleccionInclusionesDePlan,
  coleccionValores,
  coleccionClientes,
  coleccionAvisosParaClientes,
  coleccionVencimientos,
  coleccionCronogramasSunat,
  coleccionPublicaciones,
  coleccionCategorias,
  coleccionEtiquetas,
  coleccionMensajesDeContacto,
  coleccionSedes,
  coleccionMedios,
  coleccionUsuarios,
]

export const GLOBALES: GlobalConfig[] = [
  globalPaginaDeInicio,
  globalGuiaDeClientes,
  globalPaginaDelBlog,
  globalNavegacion,
  globalConfiguracionDelSitio,
]
