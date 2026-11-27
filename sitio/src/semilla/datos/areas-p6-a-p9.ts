import { consultaDelServicio as consulta, listaDePuntos as puntos } from './ayudantes-de-areas'
import type { AreaSemilla } from './tipos'

export const AREAS_P6_A_P9: readonly AreaSemilla[] = [
  {
    codigo: 'P6',
    nombre: 'Sistema de calidad',
    nombreCorto: 'Calidad',
    descripcion:
      'Un sistema de gestión de calidad permite planear, ejecutar y controlar las actividades de tu organización con altos estándares, medidos con indicadores de satisfacción de tus clientes.',
    puntos: puntos(
      'Sistema de calidad SIGE Mype',
      'Sistemas de calidad ISO',
      'Seguridad y salud en el trabajo (SUNAFIL)',
      'Homologaciones',
    ),
    mensajeDeConsulta: consulta('de Sistema de calidad'),
    poligonoEnLaRueda:
      '398.0,435.6 260.4,494.9 256.1,386.9 274.4,384.5 292.0,378.8 308.2,369.9 322.5,358.3',
  },
  {
    codigo: 'P7',
    nombre: 'Tecnología de la información',
    nombreCorto: 'Tecnología',
    descripcion:
      'Prevenimos incidencias en tus equipos y, si ocurren, las resolvemos rápido, para que tus datos estén siempre a salvo y tu negocio no se detenga.',
    puntos: puntos(
      'Soporte remoto',
      'Configuración de redes',
      'Copias de respaldo de datos',
      'Cableado estructurado',
      'Diagnóstico',
    ),
    mensajeDeConsulta: consulta('de Tecnología'),
    poligonoEnLaRueda:
      '251.6,494.2 107.9,436.2 182.1,358.9 197.2,370.8 214.2,379.7 232.7,385.1 251.8,387.0',
  },
  {
    codigo: 'P8',
    nombre: 'Comercio exterior',
    nombreCorto: 'Comercio exterior',
    descripcion:
      'Especialistas en comercio internacional para acompañar a las pequeñas y medianas empresas que importan y exportan.',
    puntos: puntos(
      'Asesoría en importaciones y exportaciones',
      'Devolución de impuestos a exportadores y por pagos en exceso',
      'Drawback y devolución de IGV ante SUNAT',
    ),
    mensajeDeConsulta: consulta('de Comercio exterior'),
    poligonoEnLaRueda:
      '96.0,435.6 36.3,300.7 151.2,292.9 153.9,310.2 159.6,326.8 168.1,342.2 179.1,355.9',
  },
  {
    codigo: 'P9',
    nombre: 'Auditorías y precios de transferencia',
    nombreCorto: 'Auditoría',
    descripcion:
      'Profesionales con amplia experiencia en auditoría y consultoría en firmas internacionales, para un servicio de alta calidad cuando lo necesitas.',
    puntos: puntos(
      'Auditoría de estados financieros',
      'Evaluación de control interno',
      'Auditoría financiera y tributaria',
      'Exámenes especiales y peritajes',
    ),
    mensajeDeConsulta: consulta('de Auditoría'),
    poligonoEnLaRueda:
      '30.6,291.8 67.6,163.5 167.9,230.1 160.3,243.6 154.9,258.1 151.8,273.2 151.0,288.6',
  },
]
