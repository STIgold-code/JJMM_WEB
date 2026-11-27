import type { PortadaSemilla } from './tipos'

// Las cuatro portadas del hero v4 (S5: «conserva el hero siempre»), en su orden.
// Disposición, transición y encuadre reproducen las clases y estilos de cada `.hero-slide`.

const MENSAJE_ASESORIA = 'Hola, quiero una asesoría gratuita para mi empresa.'

export const PORTADAS: readonly PortadaSemilla[] = [
  {
    imagen: 'hero-plan.webp',
    imagenEsDecorativa: true,
    encuadreEnCelular: 22,
    disposicion: 'texto-derecha',
    transicion: 'fundido',
    titulo: 'Contamos con [Sistema de Calidad] Genuino',
    subtitulo: 'Cada empresa guiada por nuestro sistema, llega a ser líder.',
    acciones: [
      {
        etiqueta: 'Asesoría gratuita',
        tipo: 'whatsapp',
        mensaje: MENSAJE_ASESORIA,
        estilo: 'principal',
      },
      {
        etiqueta: 'Ver nuestros planes',
        tipo: 'seccion',
        destino: '#planes',
        estilo: 'secundario',
      },
    ],
  },
  {
    imagen: 'banner-sige-mype.webp',
    imagenEsDecorativa: false,
    imagenParaCelular: 'hero-sige-movil.webp',
    disposicion: 'imagen-completa',
    transicion: 'izquierda',
    acciones: [
      {
        etiqueta: 'Pide tu asesoría gratuita',
        tipo: 'whatsapp',
        mensaje: MENSAJE_ASESORIA,
        estilo: 'principal',
      },
    ],
  },
  {
    imagen: 'hero-taza.webp',
    imagenEsDecorativa: true,
    encuadreEnCelular: 38,
    disposicion: 'texto-derecha',
    transicion: 'bajar',
    sello: 'sige-312.png',
    titulo: 'Nuestro [plan de trabajo]',
    lista: [
      { texto: 'Diagnóstico de tu empresa' },
      { texto: 'Diagrama de flujo integral' },
      { texto: 'Asesoramiento en tecnología' },
      { texto: 'Outsourcing empresarial' },
    ],
    acciones: [
      {
        etiqueta: 'Pide tu diagnóstico',
        tipo: 'whatsapp',
        mensaje: 'Hola, quiero un diagnóstico de mi empresa.',
        estilo: 'principal',
      },
    ],
  },
  {
    imagen: 'hero-equipo.webp',
    imagenEsDecorativa: true,
    encuadreEnCelular: 56,
    disposicion: 'texto-izquierda',
    transicion: 'recorte',
    titulo: 'Somos más que un [estudio contable]',
    subtitulo:
      'Contamos con el sistema de gestión empresarial SIGE Mype: nueve áreas de servicio alrededor de tu contabilidad.',
    acciones: [
      { etiqueta: 'Conoce SIGE Mype', tipo: 'seccion', destino: '#servicios', estilo: 'principal' },
      // La v4 muestra el número como texto del botón; la llamada usa el celular de la configuración.
      { etiqueta: '952 249 102', tipo: 'llamada', estilo: 'secundario' },
    ],
  },
]
