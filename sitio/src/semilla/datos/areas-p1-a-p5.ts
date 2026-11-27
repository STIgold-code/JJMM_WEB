import { consultaDelServicio as consulta, listaDePuntos as puntos } from './ayudantes-de-areas'
import type { AreaSemilla } from './tipos'

export const AREAS_P1_A_P5: readonly AreaSemilla[] = [
  {
    codigo: 'P1',
    nombre: 'Legal',
    nombreCorto: 'Legal',
    descripcion:
      'Un equipo de abogados y contadores especializados en diversos campos para el sector empresarial peruano y la inversión extranjera. Damos información precisa en aplicación de las normas comerciales vigentes, en asuntos societarios y contractuales, para resolver tus necesidades legales de manera oportuna.',
    puntos: puntos('Asesoría legal', 'Servicios legales', 'Asesoría contable legal'),
    mensajeDeConsulta: consulta('Legal'),
    poligonoEnLaRueda:
      '72.8,155.8 174.1,78.7 216.5,191.5 203.1,197.6 190.8,205.7 179.8,215.4 170.3,226.6',
  },
  {
    codigo: 'P2',
    nombre: 'Tributaria',
    nombreCorto: 'Tributaria',
    descripcion:
      'Un equipo de contadores especialistas para el sector empresarial peruano y la inversión extranjera. Damos solución ante las contingencias que generan los cambios en las normas tributarias, con atención personalizada, cualquiera sea tu régimen tributario.',
    puntos: puntos(
      'Consultas tributarias',
      'Problemática fiscal',
      'Cumplimiento de las normas tributarias',
      'Asesoría contable tributaria',
    ),
    mensajeDeConsulta: consulta('Tributario'),
    poligonoEnLaRueda:
      '183.5,77.6 322.0,78.1 284.2,190.3 268.5,186.4 252.4,185.0 236.2,186.2 220.5,190.1',
  },
  {
    codigo: 'P3',
    nombre: 'Laboral',
    nombreCorto: 'Laboral',
    descripcion:
      'Contadores y abogados laboralistas trabajamos en equipo, con gran experiencia en derecho laboral y de la seguridad social. Asesoramos a personas naturales y empresas, cualquiera sea su régimen laboral.',
    puntos: puntos(
      'Manejo de nóminas',
      'Indemnizaciones',
      'Informes sobre consultas específicas',
      'Asesoría contable laboral',
    ),
    mensajeDeConsulta: consulta('Laboral'),
    poligonoEnLaRueda:
      '331.0,80.3 438.3,168.3 337.4,232.0 327.7,219.1 316.0,207.9 302.8,198.7 288.2,191.7',
  },
  {
    codigo: 'P4',
    nombre: 'Administración',
    nombreCorto: 'Administración',
    descripcion:
      'Administradores especialistas evaluamos y asesoramos a empresas que buscan más eficiencia en el uso de sus recursos, con una organización simple, dinámica y actual que cubre todas las etapas de la administración.',
    puntos: puntos(
      'Reducción de procesos inútiles y repetidos',
      'Optimización de procedimientos administrativos',
      'Herramientas de gestión para decidir mejor',
      'Políticas, normas y procedimientos',
      'Formatos de control administrativo',
      'Asesoría contable administrativa',
    ),
    mensajeDeConsulta: consulta('de Administración'),
    poligonoEnLaRueda:
      '443.0,176.2 471.4,305.2 352.6,294.8 352.8,279.4 350.6,264.2 346.2,249.5 339.6,235.7',
  },
  {
    codigo: 'P5',
    nombre: 'Financiera',
    nombreCorto: 'Financiera',
    descripcion:
      'Las finanzas son una de las áreas más importantes para que un negocio siga en marcha, aunque muchos emprendedores las dejan para después. Te ayudamos a ordenarlas y a planificar.',
    puntos: puntos(
      'Registro de operaciones contables y financieras',
      'Análisis y evaluación de la información',
      'Fuentes de financiamiento',
      'Opciones de inversión',
      'Flujos proyectados',
      'Asesoría contable financiera',
    ),
    mensajeDeConsulta: consulta('Financiero'),
    poligonoEnLaRueda:
      '465.8,313.8 408.9,433.9 325.5,355.3 335.4,343.0 343.3,329.2 348.9,314.5 352.2,299.0',
  },
]
