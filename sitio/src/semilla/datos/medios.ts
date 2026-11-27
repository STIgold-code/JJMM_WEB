import type { MedioSemilla } from './tipos'

// Imágenes que usa el inicio v4 (`resources/views/web/index.blade.php`), copiadas a
// `semilla/imagenes/` para que la carga funcione dentro del contenedor y tras borrar el sitio anterior.
const IMAGENES = 'semilla/imagenes'
const INICIO = `${IMAGENES}/inicio`

const SELLO_SIGE = 'Sello SIGE Mype del Grupo JJMM'
const TEXTO_DEL_BANNER =
  'Contamos con Sistema de Gestión Empresarial SIGE Mype. Somos más que un estudio contable. Asesoría gratuita.'

const MEDIOS_DE_MARCA: MedioSemilla[] = [
  { archivo: `${INICIO}/logo-jjmm.png`, alt: 'JJMM, Mariñas & Asociados, Estudio Contable' },
  { archivo: `${IMAGENES}/logo-grupo-lenin.png`, alt: SELLO_SIGE },
  { archivo: `${IMAGENES}/sige-312.png`, alt: SELLO_SIGE },
  { archivo: `${IMAGENES}/sigefact.png`, alt: 'SIGEFact, facturación electrónica' },
]

const MEDIOS_DEL_INICIO: MedioSemilla[] = [
  {
    archivo: `${INICIO}/hero-plan.webp`,
    alt: 'Profesional con camisa del Grupo JJMM toca una pantalla digital con un mapamundi de fondo.',
  },
  { archivo: `${INICIO}/banner-sige-mype.webp`, alt: TEXTO_DEL_BANNER },
  { archivo: `${INICIO}/hero-sige-movil.webp`, alt: TEXTO_DEL_BANNER },
  {
    archivo: `${INICIO}/hero-taza.webp`,
    alt: 'Manos que señalan gráficos de barras en un informe, junto a una taza del Grupo JJMM.',
  },
  {
    archivo: `${INICIO}/hero-equipo.webp`,
    alt: 'Equipo de trabajo que revisa gráficos financieros sobre una mesa con computadoras portátiles.',
  },
  {
    archivo: `${INICIO}/rueda-sige-mype.webp`,
    alt: 'Rueda SIGE Mype: la contabilidad al centro, rodeada por nueve áreas de servicio en un ciclo de mejora continua.',
  },
]

// Nombres tal como los publica el inicio v4. Dos logotipos siguen sin nombre confirmado (L7).
export const NOMBRES_DE_CLIENTES = [
  'Cadex',
  'Cliente del estudio (nombre por confirmar)',
  'Insutec',
  'Interfreeze',
  'Líneas Perú Travel',
  'Cliente del estudio (nombre por confirmar)',
  'Lineaz Tour Operador',
  'Empresa Pesquera Yabafish S.A.C.',
  'Faser Rent a Car',
  'Samari S.A.C.',
  'STI Gold',
] as const

export const archivoDeLogoDeCliente = (indice: number): string => `client-logo${indice + 1}.png`

const MEDIOS_DE_CLIENTES: MedioSemilla[] = NOMBRES_DE_CLIENTES.map((nombre, indice) => ({
  archivo: `${IMAGENES}/${archivoDeLogoDeCliente(indice)}`,
  alt: nombre,
}))

export const MEDIOS: readonly MedioSemilla[] = [
  ...MEDIOS_DE_MARCA,
  ...MEDIOS_DEL_INICIO,
  ...MEDIOS_DE_CLIENTES,
]
