import type {
  AreasDeServicio,
  AvisosParaCliente,
  BloqueCarruselDePortadas,
  BloqueClientes,
  BloqueContacto,
  BloquePlanes,
  BloquePorQueElegirnos,
  BloqueQuienesSomos,
  BloqueServicios,
  ConfiguracionDelSitio,
  GuiaDeCliente,
  Navegacion,
  PaginaDelBlog,
  Plane,
  Sede,
  Valore,
  Vencimiento,
} from '@/payload-types'

// Tipos de los datos de la carga inicial. Se derivan de `payload-types.ts`, así que un cambio
// en el modelo que rompa la semilla falla en `pnpm typecheck`.
//
// Los medios se nombran por el nombre de su archivo y las relaciones por su clave natural
// (nombre del plan, nombre de la sede…): el cargador las cambia por los id de Payload. El
// `orden` sale de la posición en cada lista.

export type ClaveDeMedio = string

type SinSistema<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'orden'>
type SinTipoDeBloque<T> = Omit<T, 'blockType' | 'id' | 'blockName'>

export interface MedioSemilla {
  // Ruta relativa a la raíz del repositorio.
  archivo: string
  alt: string
}

type Portada = NonNullable<BloqueCarruselDePortadas['portadas']>[number]
export type PortadaSemilla = Omit<Portada, 'imagen' | 'imagenParaCelular' | 'sello' | 'id'> & {
  imagen: ClaveDeMedio
  imagenParaCelular?: ClaveDeMedio
  sello?: ClaveDeMedio
}

export interface PaginaDeInicioSemilla {
  carrusel: { segundosPorPortada: number; portadas: PortadaSemilla[] }
  // `presentacion` marca las negritas entre corchetes, como los títulos de las portadas.
  quienesSomos: Omit<SinTipoDeBloque<BloqueQuienesSomos>, 'presentacion'> & {
    presentacion: string[]
  }
  servicios: Omit<SinTipoDeBloque<BloqueServicios>, 'imagenDeLaRueda'> & {
    imagenDeLaRueda: ClaveDeMedio
  }
  planes: SinTipoDeBloque<BloquePlanes>
  porQueElegirnos: SinTipoDeBloque<BloquePorQueElegirnos>
  clientes: SinTipoDeBloque<BloqueClientes>
  // `sedeDelMapa` es el nombre de la sede.
  contacto: Omit<SinTipoDeBloque<BloqueContacto>, 'sedeDelMapa'> & { sedeDelMapa: string }
}

type Marca = ConfiguracionDelSitio['marca']
type SeoDelSitio = ConfiguracionDelSitio['seo']
export type ConfiguracionSemilla = Omit<SinSistema<ConfiguracionDelSitio>, 'marca' | 'seo'> & {
  marca: Omit<Marca, 'logo' | 'sello'> & { logo: ClaveDeMedio; sello: ClaveDeMedio }
  seo: Omit<SeoDelSitio, 'imagen'> & { imagen: ClaveDeMedio }
}

type ItemDeMenu = NonNullable<Navegacion['items']>[number]
export type ItemDeMenuSemilla = Omit<ItemDeMenu, 'imagen' | 'id'> & { imagen?: ClaveDeMedio }

export type SedeSemilla = SinSistema<Sede>
export type AreaSemilla = SinSistema<AreasDeServicio>
export type PlanSemilla = SinSistema<Plane>
export type ValorSemilla = SinSistema<Valore>
export type AvisoSemilla = SinSistema<AvisosParaCliente>
export type VencimientoSemilla = SinSistema<Vencimiento>
export type GuiaSemilla = SinSistema<GuiaDeCliente>
export type BlogSemilla = SinSistema<PaginaDelBlog>

export interface ClienteSemilla {
  nombre: string
  // Clave natural del cliente: cada logotipo es de un solo cliente.
  logo: ClaveDeMedio
}

// Celda de la matriz de planes, en el orden de `PLANES`.
export type CeldaSemilla = 'incluido' | 'no-incluido' | { texto: string }

export interface CaracteristicaSemilla {
  nombre: string
  celdas: readonly CeldaSemilla[]
}

export interface DatosDeSemilla {
  medios: readonly MedioSemilla[]
  configuracion: ConfiguracionSemilla
  navegacion: readonly ItemDeMenuSemilla[]
  sedes: readonly SedeSemilla[]
  paginaDeInicio: PaginaDeInicioSemilla
  areas: readonly AreaSemilla[]
  planes: readonly PlanSemilla[]
  caracteristicas: readonly CaracteristicaSemilla[]
  valores: readonly ValorSemilla[]
  clientes: readonly ClienteSemilla[]
  avisos: readonly AvisoSemilla[]
  vencimientos: readonly VencimientoSemilla[]
  guia: GuiaSemilla
  blog: BlogSemilla
}
