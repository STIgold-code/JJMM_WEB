import type { ConfiguracionSemilla, ItemDeMenuSemilla, SedeSemilla } from './tipos'

// Datos de todo el sitio tal como los publica el inicio v4 y PRODUCT.md.

const CORREO = 'contabilidad@jjmm.com.pe'
const CELULAR_WHATSAPP = '951 965 242'
const CELULAR_DE_LLAMADAS = '952 249 102'

export const CONFIGURACION: ConfiguracionSemilla = {
  marca: {
    nombreComercial: 'Estudio Contable JJMM',
    razonSocial: 'Estudio Contable JJMM S.A.C.',
    grupo: 'Grupo JJMM',
    lema: 'Cada empresa guiada por nuestro sistema, llega a ser líder.',
    logo: 'logo-jjmm.png',
    sello: 'logo-grupo-lenin.png',
  },
  contacto: {
    correo: CORREO,
    celularWhatsApp: CELULAR_WHATSAPP,
    mensajeWhatsApp: 'Hola, quiero información sobre sus servicios contables.',
    celularDeLlamadas: CELULAR_DE_LLAMADAS,
    textoDelBotonFlotante: 'Escríbenos',
  },
  redesSociales: [
    { red: 'facebook', url: 'https://www.facebook.com/Grupo-Contable-JJMM-1375492852750200/' },
    { red: 'x', url: 'https://twitter.com/CONTABLEJJMMSAC' },
    { red: 'youtube', url: 'https://www.youtube.com/channel/UC_3EI0DpkhlLKGBGfvY2oXg' },
  ],
  seo: {
    titulo: 'JJMM | Estudio Contable | Asesoría contable y tributaria en Lima',
    descripcion:
      'Estudio Contable JJMM S.A.C.: outsourcing contable para MYPE en Lima con el sistema de gestión empresarial SIGE Mype. Escríbenos por WhatsApp.',
    imagen: 'hero-plan.webp',
  },
}

// Menú del inicio v4. «Inicio» apunta a «/» para que funcione desde cualquier página.
export const NAVEGACION: readonly ItemDeMenuSemilla[] = [
  { etiqueta: 'Inicio', tipo: 'interna', destino: '/' },
  { etiqueta: 'Quiénes somos', tipo: 'seccion', destino: '#quienes-somos' },
  { etiqueta: 'Servicios', tipo: 'seccion', destino: '#servicios' },
  { etiqueta: 'Planes', tipo: 'seccion', destino: '#planes' },
  { etiqueta: 'Blog', tipo: 'interna', destino: '/blog' },
  { etiqueta: 'Contacto', tipo: 'seccion', destino: '#contacto' },
  { etiqueta: 'Guía de clientes', tipo: 'interna', destino: '/guia' },
  {
    etiqueta: 'SIGEFact',
    tipo: 'externa',
    destino: 'https://sigefact.pse.pe/',
    abrirEnNuevaPestana: true,
    imagen: 'sigefact.png',
  },
]

// El inicio v4 publica los dos celulares en ambas sedes; qué celular corresponde a cada sede
// y cuáles atienden por WhatsApp está por confirmar (L7).
const CELULARES_DE_SEDE: SedeSemilla['celulares'] = [
  { numero: CELULAR_WHATSAPP, tieneWhatsApp: true },
  { numero: CELULAR_DE_LLAMADAS, tieneWhatsApp: false },
]

const MAPA_SAN_MARTIN_DE_PORRES =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15608.707509981834!2d-77.08950189118585!3d-12.03134101480463!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105ceb0a5b6860b%3A0xb62bd9617941db!2sESTUDIO+CONTABLE+JJMM+SAC!5e0!3m2!1ses!2spe!4v1520698936292'

export const SEDES: readonly SedeSemilla[] = [
  {
    nombre: 'Sede San Martín de Porres',
    direccion: 'Jr. Iquitos 593',
    distrito: 'San Martín de Porres',
    ciudad: 'Lima',
    celulares: CELULARES_DE_SEDE,
    correo: CORREO,
    enlaceDeMapa: MAPA_SAN_MARTIN_DE_PORRES,
    activo: true,
  },
  {
    nombre: 'Sede San Isidro',
    direccion: 'Calle Gorriones 151',
    distrito: 'San Isidro',
    ciudad: 'Lima',
    celulares: CELULARES_DE_SEDE,
    correo: CORREO,
    activo: true,
  },
]
