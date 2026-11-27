import { PORTADAS } from './portadas'
import type { PaginaDeInicioSemilla } from './tipos'

// Textos de las secciones del inicio v4. Las listas (áreas, planes, valores, clientes) se
// cargan en sus colecciones.
export const PAGINA_DE_INICIO: PaginaDeInicioSemilla = {
  carrusel: { segundosPorPortada: 9, portadas: [...PORTADAS] },
  quienesSomos: {
    ancla: 'quienes-somos',
    titulo: 'Quiénes somos',
    cifras: [
      {
        prefijo: 'Más de',
        valor: 100,
        descripcion: 'clientes de outsourcing de una amplia variedad de sectores',
      },
      {
        prefijo: 'Más de',
        valor: 100,
        descripcion: 'requerimientos de SUNAT atendidos satisfactoriamente',
      },
      {
        prefijo: 'Más de',
        valor: 10,
        sufijo: 'años',
        descripcion: 'de experiencia profesional brindando soluciones integrales',
      },
      { prefijo: 'Más de', valor: 20, descripcion: 'empresas constituidas' },
    ],
    presentacion: [
      'Somos el [Estudio Contable JJMM S.A.C.], empresa que busca la satisfacción de sus clientes y la excelencia en la prestación de servicios. Desarrollamos en todos los niveles de la organización un [Sistema de Gestión de Calidad Genuino], con un alto índice de responsabilidad, calidad y profesionalismo, y promovemos la mejora continua en nuestros servicios. Con base en esa retroalimentación creamos el sistema de gestión empresarial [SIGE Mype].',
    ],
  },
  servicios: {
    ancla: 'servicios',
    titulo: 'Nuestros servicios empresariales integrales',
    imagenDeLaRueda: 'rueda-sige-mype.webp',
    textoDelBoton: 'Consultar este servicio',
  },
  planes: {
    ancla: 'planes',
    titulo: 'Nuestros planes',
    bajada:
      'Outsourcing contable para pymes. Compara lo que incluye cada plan y consúltanos por el que necesitas.',
    encabezadoDeCaracteristicas: 'Qué incluye',
    textoDelBoton: 'Solicitar',
    notaAlPie: 'Precio de cada plan: consultar.',
  },
  porQueElegirnos: {
    ancla: '',
    titulo: '¿Por qué elegirnos?',
    bajada: 'Aquí tienes algunas de las razones para escoger nuestros servicios.',
  },
  clientes: { ancla: '', titulo: 'Nuestros clientes' },
  // «Contáctanos» de la v5 (elegida por el estudio): pestañas por sede y formulario.
  contacto: {
    ancla: 'contacto',
    titulo: 'Contáctanos',
    bajada: 'Visítanos en cualquiera de nuestras sedes o escríbenos por WhatsApp.',
    formulario: {
      titulo: 'Escríbenos',
      texto: 'Completa tus datos y te llevamos a WhatsApp con el mensaje listo para enviar.',
      textoDelBoton: 'Enviar por WhatsApp',
      opcionesDeServicio: [
        { texto: 'Outsourcing contable (planes)' },
        { texto: 'Asesoría tributaria' },
        { texto: 'Planilla y asesoría laboral' },
        { texto: 'Asesoría legal' },
        { texto: 'Constitución de empresa' },
        { texto: 'Otro servicio' },
      ],
    },
    canales: {
      comoLlegar: 'Cómo llegar',
      botonDelMapa: 'Ver mapa',
      fotoDelMapa: 'hero-equipo.webp',
    },
  },
}
