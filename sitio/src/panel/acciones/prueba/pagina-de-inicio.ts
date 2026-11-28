// Datos de prueba de la página de inicio: la global como la guarda Payload (`depth: 0`), con un
// carrusel, otras secciones con campos que el panel no edita y un tipo de bloque que el panel no
// conoce, y un formulario del carrusel como lo manda el navegador.
export const VERSION = '2026-11-27T10:00:00.000Z'
export const NUEVA_VERSION = '2026-11-27T10:05:00.000Z'

export const CARRUSEL = {
  id: 'car1',
  blockType: 'carrusel-de-portadas',
  blockName: 'Portadas',
  segundosPorPortada: 9,
  portadas: [{ id: 'p1', imagen: 7, disposicion: 'texto-derecha', transicion: 'fundido' }],
}
export const QUIENES = {
  id: 'qui2',
  blockType: 'quienes-somos',
  titulo: 'Quiénes somos',
  presentacion: { root: { type: 'root', children: [{ type: 'paragraph', version: 1 }] } },
  cifras: [{ id: 'c1', prefijo: 'Más de', valor: 100, sufijo: null, descripcion: 'clientes' }],
}
export const SERVICIOS = {
  id: 'ser3',
  blockType: 'servicios',
  titulo: 'Servicios',
  imagenDeLaRueda: 6,
}
// Un tipo que el panel no conoce: se conserva tal cual.
export const DESCONOCIDA = { id: 'fut4', blockType: 'bloque-del-futuro', dato: { a: [1, 2] } }
export const PAGINA = {
  id: 1,
  updatedAt: VERSION,
  secciones: [CARRUSEL, QUIENES, SERVICIOS, DESCONOCIDA],
}

const IMAGEN = { id: 7, url: '/api/medios/file/a.webp', alt: 'A', nombre: 'a.webp' }

export const PORTADA = {
  clave: 1,
  imagen: IMAGEN,
  imagenEsDecorativa: true,
  imagenParaCelular: null,
  encuadreEnCelular: null,
  disposicion: 'texto-izquierda',
  transicion: 'recorte',
  titulo: 'Somos más que un [estudio contable]',
  subtitulo: '',
  sello: null,
  lista: '',
  botones: [],
}
export const FORMULARIO = {
  seccion: 'car1',
  actualizadoEn: VERSION,
  segundosPorPortada: '12',
  portadas: [PORTADA],
}
