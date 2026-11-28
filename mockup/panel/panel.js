/* Panel JJMM · maqueta navegable.
   Un solo archivo sin dependencias: estructura (menú y barra), capas (Sheet, Dialog,
   AlertDialog) con foco atrapado, avisos breves, listados filtrables, interruptores,
   orden, estado «sin guardar» y la lógica propia de cada pantalla.
   En el panel real cada bloque es un componente de shadcn/ui; aquí solo se simula. */
;(function () {
  'use strict'

  // ---------------------------------------------------------------- Íconos (trazos de Lucide)
  const ICONOS = {
    casa: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    bandeja: '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    capas: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    maletin: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
    pin: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    diseno: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>',
    periodico: '<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/>',
    libro: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    imagen: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
    usuarios: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    usuario: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    salir: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
    buscar: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    menu: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
    cerrar: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    ojo: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
    'ojo-cerrado': '<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>',
    asa: '<circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/>',
    arriba: '<path d="m18 15-6-6-6 6"/>',
    abajo: '<path d="m6 9 6 6 6-6"/>',
    derecha: '<path d="m9 18 6-6-6-6"/>',
    volver: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    'check-circulo': '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    alerta: '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    telefono: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    whatsapp: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    correo: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    basura: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
    subir: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
    mas: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    lapiz: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>',
    reloj: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    calendario: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
    edificio: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
    tareas: '<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
    externo: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    ajustes: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    lista: '<path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/>',
    candado: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    deshacer: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    estrella: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
    // Íconos de la sección «¿Por qué elegirnos?» (lista cerrada de `valores.icono`).
    pulgar: '<path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>',
    trofeo: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
    foco: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
    balanza: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
    // Editor de texto enriquecido.
    negrita: '<path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/>',
    cursiva: '<line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/>',
    enlace: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    'lista-numerada': '<path d="M10 12h11"/><path d="M10 18h11"/><path d="M10 6h11"/><path d="M4 10h2"/><path d="M4 6h1v4"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>',
    cita: '<path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/>',
    rehacer: '<path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/>',
    'deshacer-texto': '<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>',
    etiqueta: '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
    web: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
    celular: '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
    rueda: '<path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z"/><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>',
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    x: '<path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768"/><path d="M20 4l-6.768 6.768"/>',
    youtube: '<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>',
    instagram: '<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>',
    tiktok: '<path d="M21 7.917v4.034a9.948 9.948 0 0 1 -5 -1.951v4.5a6.5 6.5 0 1 1 -8 -6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917z"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
  }

  const icono = (nombre, clase = '') =>
    `<svg class="icono ${clase}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONOS[nombre] || ''}</svg>`

  const pintarIconos = (raiz = document) => {
    raiz.querySelectorAll('[data-icono]').forEach((el) => {
      el.outerHTML = icono(el.dataset.icono, el.className)
    })
  }

  // ---------------------------------------------------------------- Estado de la maqueta
  // Solo para la maqueta: qué escenario se ve. Si el navegador no guarda, se usan los valores por defecto.
  const PREDETERMINADO = { rol: 'administrador', pendientes: 'si', mensajes: 'con', publicaciones: 'ejemplos', ingreso: 'normal' }
  const leer = (clave) => {
    try {
      return localStorage.getItem('maqueta-panel-' + clave) || PREDETERMINADO[clave]
    } catch (e) {
      return PREDETERMINADO[clave]
    }
  }
  const guardar = (clave, valor) => {
    try {
      localStorage.setItem('maqueta-panel-' + clave, valor)
    } catch (e) {
      /* sin almacenamiento: el cambio dura hasta recargar */
    }
  }

  const ESCENARIOS = {
    rol: {
      titulo: 'Quién entra',
      opciones: [
        ['administrador', 'Administrador'],
        ['editor', 'Editor'],
      ],
    },
    pendientes: {
      titulo: 'Inicio del panel',
      opciones: [
        ['si', 'Con pendientes'],
        ['no', 'Todo al día'],
      ],
    },
    mensajes: {
      titulo: 'Mensajes de contacto',
      opciones: [
        ['con', 'Con mensajes (ejemplo)'],
        ['sin', 'Sin mensajes todavía'],
      ],
    },
    publicaciones: {
      titulo: 'Publicaciones',
      opciones: [
        ['ejemplos', 'Con publicaciones (ejemplo)'],
        ['vacio', 'Sin publicaciones (estado real hoy)'],
      ],
    },
    ingreso: {
      titulo: 'Ingreso',
      opciones: [
        ['normal', 'Formulario limpio'],
        ['error', 'Con error de acceso'],
      ],
    },
  }

  // ---------------------------------------------------------------- Datos de ejemplo compartidos
  const hoy = new Date()
  const haceDias = (dias, horas, minutos) => {
    const f = new Date(hoy)
    f.setDate(f.getDate() - dias)
    f.setHours(horas, minutos, 0, 0)
    return f
  }
  const formatoFecha = (fecha) => {
    const dias = Math.round((new Date(hoy).setHours(0, 0, 0, 0) - new Date(fecha).setHours(0, 0, 0, 0)) / 864e5)
    const hora = fecha.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
    if (dias === 0) return 'Hoy, ' + hora
    if (dias === 1) return 'Ayer, ' + hora
    return fecha.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' }) + ', ' + hora
  }

  // Mensajes de ejemplo: no hay mensajes reales. Servicios = opciones reales del formulario.
  const MENSAJES = [
    { id: 'm1', nombre: 'Carmen Quispe', servicio: 'Outsourcing contable (planes)', fecha: haceDias(0, 10, 42), estado: 'nuevo', celular: '', correo: '', mensaje: 'Hola, tengo una bodega en San Martín de Porres y emito boletas y facturas. Quisiera saber qué plan me conviene y qué documentos tendría que llevarles cada mes.' },
    { id: 'm2', nombre: 'Jorge Salazar', servicio: 'Constitución de empresa', fecha: haceDias(0, 9, 15), estado: 'nuevo', celular: '', correo: '', mensaje: 'Buenos días. Queremos formar una S.A.C. con dos socios. ¿Cuánto demora el trámite y qué necesitamos presentar?' },
    { id: 'm3', nombre: 'Patricia Rojas', servicio: 'Planilla y asesoría laboral', fecha: haceDias(1, 18, 3), estado: 'nuevo', celular: '', correo: '', mensaje: 'Tengo cinco trabajadores y necesito ayuda con la PLAME y el cálculo de vacaciones.' },
    { id: 'm4', nombre: 'Miguel Torres', servicio: 'Asesoría tributaria', fecha: haceDias(3, 16, 20), estado: 'atendido', celular: '900 000 001', correo: '', mensaje: 'Me llegó una carta inductiva de SUNAT por diferencias en el IGV. ¿Pueden revisarla conmigo?' },
    { id: 'm5', nombre: 'Rosa Chávez', servicio: 'Otro servicio', fecha: haceDias(7, 11, 5), estado: 'atendido', celular: '900 000 002', correo: 'rosa.chavez@ejemplo.pe', mensaje: 'Quisiera saber si llevan la contabilidad de una asociación sin fines de lucro.' },
  ]

  const nuevosVisibles = () => {
    if (leer('mensajes') === 'sin') return 0
    if (leer('pendientes') === 'no') return 0
    return MENSAJES.filter((m) => m.estado === 'nuevo').length
  }

  // ---------------------------------------------------------------- Menú lateral
  const MENU = [
    { titulo: 'Atención diaria', items: [
      { id: 'inicio', texto: 'Inicio', url: 'inicio.html', icono: 'casa' },
      { id: 'mensajes', texto: 'Mensajes de contacto', url: 'mensajes.html', icono: 'bandeja', contador: nuevosVisibles },
    ] },
    { titulo: 'Lo que ofreces', items: [
      { id: 'planes', texto: 'Planes', url: 'planes.html', icono: 'capas' },
      { id: 'areas', texto: 'Áreas de servicio', url: 'areas.html', icono: 'maletin' },
    ] },
    { titulo: 'Sitio web', items: [
      { id: 'pagina-de-inicio', texto: 'Página de inicio', url: 'pagina-de-inicio.html', icono: 'diseno' },
      { id: 'sedes', texto: 'Sedes', url: 'sedes.html', icono: 'pin' },
      { id: 'clientes', texto: 'Clientes', url: 'clientes.html', icono: 'edificio' },
    ] },
    { titulo: 'Para tus clientes', items: [
      { id: 'guia', texto: 'Guía de clientes', url: 'guia-de-clientes.html', icono: 'libro' },
      { id: 'publicaciones', texto: 'Publicaciones', url: 'publicaciones.html', icono: 'periodico' },
      { id: 'medios', texto: 'Imágenes', url: 'medios.html', icono: 'imagen' },
    ] },
    { titulo: 'Administración', soloAdmin: true, items: [
      { id: 'usuarios', texto: 'Usuarios', url: 'usuarios.html', icono: 'usuarios' },
      { id: 'configuracion', texto: 'Datos del estudio', url: 'datos-del-estudio.html', icono: 'ajustes' },
      { id: 'navegacion', texto: 'Menú del sitio', url: 'menu-del-sitio.html', icono: 'lista' },
    ] },
  ]

  const htmlMenu = (actual) => {
    const grupos = MENU.map((g) => {
      const items = g.items.map((it) => {
        const actualAttr = it.id === actual ? ' aria-current="page"' : ''
        if (!it.url) {
          return `<li><a class="menu-enlace" role="link" aria-disabled="true" title="Esta sección no forma parte de la maqueta">${icono(it.icono)}<span>${it.texto}</span><span class="fuera">No incluida</span></a></li>`
        }
        const n = it.contador ? it.contador() : 0
        const contador = n ? `<span class="contador" aria-label="${n} sin atender">${n}</span>` : ''
        return `<li><a class="menu-enlace" href="${it.url}"${actualAttr}>${icono(it.icono)}<span>${it.texto}</span>${contador}</a></li>`
      }).join('')
      return `<div class="menu-grupo"${g.soloAdmin ? ' data-solo-admin' : ''}><p class="menu-grupo-titulo" id="grupo-${g.items[0].id}">${g.titulo}</p><ul class="menu-lista" aria-labelledby="grupo-${g.items[0].id}">${items}</ul></div>`
    }).join('')
    const rol = leer('rol') === 'editor' ? 'Editor' : 'Administrador'
    return `
      <a class="menu-marca" href="inicio.html">
        <img src="img/marca-jjmm.png" alt="" width="216" height="73">
        <span class="menu-marca-texto"><span class="nombre-marca">Estudio Contable JJMM</span><small>Panel del sitio web</small></span>
      </a>
      <nav class="menu-navegacion" aria-label="Secciones del panel">${grupos}</nav>
      <div class="menu-usuario">
        <span class="avatar avatar-sm" aria-hidden="true">CE</span>
        <span class="menu-usuario-datos"><a href="mi-cuenta.html">Cuenta del estudio</a><span>${rol} · <span class="ejemplo">Ejemplo</span></span></span>
        <a class="boton boton-fantasma boton-icono boton-sm" href="ingreso.html" aria-label="Cerrar sesión" title="Cerrar sesión">${icono('salir', 'icono-sm')}</a>
      </div>`
  }

  // Compara textos sin mayúsculas ni tildes (filtros de los listados).
  const normalizar = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

  // ---------------------------------------------------------------- Estructura de la página
  const montarEstructura = () => {
    const pagina = document.body.dataset.pagina
    if (!pagina) return
    const migas = (document.body.dataset.migas || '').split('>').filter(Boolean).map((m) => m.split('|'))
    const contenido = document.querySelector('main')
    const panel = document.createElement('div')
    panel.className = 'panel'
    const htmlMigas = migas.map(([texto, url], i) =>
      i === migas.length - 1 || !url ? `<li><span aria-current="page">${texto}</span></li>` : `<li><a href="${url}">${texto}</a></li>`
    ).join('')
    panel.innerHTML = `
      <a class="oculto-visual" href="#contenido">Ir al contenido</a>
      <aside class="menu" id="menu-lateral" aria-label="Menú del panel">${htmlMenu(pagina)}</aside>
      <div class="principal">
        <header class="barra">
          <button class="boton boton-fantasma boton-icono barra-menu" type="button" aria-label="Abrir el menú" aria-controls="menu-lateral" aria-expanded="false">${icono('menu')}</button>
          <nav class="ruta" aria-label="Ruta"><ol>${htmlMigas}</ol></nav>
        </header>
      </div>`
    contenido.id = 'contenido'
    contenido.classList.add('contenido')
    contenido.tabIndex = -1
    document.body.prepend(panel)
    panel.querySelector('.principal').append(contenido)
    iniciarCajon(panel)
  }

  // Menú como cajón en celulares.
  const iniciarCajon = (panel) => {
    const boton = panel.querySelector('.barra-menu')
    const menu = panel.querySelector('.menu')
    let fondo = null
    const cerrar = () => {
      menu.dataset.abierto = 'false'
      boton.setAttribute('aria-expanded', 'false')
      if (fondo) { fondo.remove(); fondo = null }
      document.removeEventListener('keydown', alTeclear)
      boton.focus()
    }
    const alTeclear = (e) => {
      if (e.key === 'Escape') cerrar()
      if (e.key === 'Tab') atraparFoco(e, menu)
    }
    boton.addEventListener('click', () => {
      menu.dataset.abierto = 'true'
      boton.setAttribute('aria-expanded', 'true')
      fondo = document.createElement('div')
      fondo.className = 'capa-fondo'
      fondo.style.zIndex = '51'
      fondo.addEventListener('click', cerrar)
      document.body.append(fondo)
      document.addEventListener('keydown', alTeclear)
      menu.querySelector('a[href]').focus()
    })
  }

  // ---------------------------------------------------------------- Capas: Sheet, Dialog, AlertDialog
  const ENFOCABLES = 'a[href], button:not([disabled]), input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  const pila = []

  const atraparFoco = (e, contenedor) => {
    const f = [...contenedor.querySelectorAll(ENFOCABLES)].filter((el) => el.offsetParent !== null)
    if (!f.length) return
    const primero = f[0]
    const ultimo = f[f.length - 1]
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus() }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus() }
  }

  const abrirCapa = (id, disparador) => {
    const capa = document.getElementById(id)
    if (!capa) return
    capa.hidden = false
    const panelCapa = capa.querySelector('[role=dialog], [role=alertdialog]')
    pila.push({ capa, disparador: disparador || document.activeElement })
    document.body.style.overflow = 'hidden'
    const inicial = capa.querySelector('[data-foco-inicial]') || panelCapa.querySelector(ENFOCABLES)
    if (inicial) inicial.focus()
    capa.dispatchEvent(new CustomEvent('capa:abierta'))
  }

  const cerrarCapa = (capa) => {
    const i = pila.findIndex((p) => p.capa === capa)
    if (i < 0) return
    const [{ disparador }] = pila.splice(i, 1)
    capa.hidden = true
    if (!pila.length) document.body.style.overflow = ''
    capa.dispatchEvent(new CustomEvent('capa:cerrada'))
    if (disparador && document.contains(disparador)) disparador.focus()
  }

  // Una capa puede pedir confirmación antes de cerrarse (panel lateral con cambios sin guardar).
  const pedirCierre = async (capa) => {
    if (capa._antesDeCerrar && !(await capa._antesDeCerrar())) return
    cerrarCapa(capa)
  }

  document.addEventListener('keydown', (e) => {
    const arriba = pila[pila.length - 1]
    if (!arriba) return
    if (e.key === 'Escape') { e.preventDefault(); pedirCierre(arriba.capa) }
    if (e.key === 'Tab') atraparFoco(e, arriba.capa)
  })

  document.addEventListener('click', (e) => {
    const abre = e.target.closest('[data-abre]')
    if (abre) { e.preventDefault(); abrirCapa(abre.dataset.abre, abre); return }
    const cierra = e.target.closest('[data-cierra]')
    if (cierra) { pedirCierre(cierra.closest('.capa')); return }
    if (e.target.classList.contains('capa-fondo') && e.target.closest('.capa') && !e.target.closest('.capa').querySelector('[role=alertdialog]')) {
      pedirCierre(e.target.closest('.capa'))
    }
  })

  // Diálogo de confirmación reutilizable (AlertDialog).
  const confirmar = ({ titulo, texto, accion, destructivo = true }) => new Promise((resolver) => {
    let capa = document.getElementById('dialogo-confirmar')
    if (!capa) {
      capa = document.createElement('div')
      capa.className = 'capa'
      capa.id = 'dialogo-confirmar'
      capa.hidden = true
      capa.innerHTML = `<div class="capa-fondo"></div>
        <div class="dialogo" role="alertdialog" aria-modal="true" aria-labelledby="confirmar-titulo" aria-describedby="confirmar-texto">
          <h2 id="confirmar-titulo"></h2>
          <p id="confirmar-texto" class="texto-suave"></p>
          <div class="dialogo-acciones">
            <button class="boton boton-secundario" type="button" data-respuesta="no" data-foco-inicial>Cancelar</button>
            <button class="boton" type="button" data-respuesta="si"></button>
          </div>
        </div>`
      document.body.append(capa)
    }
    capa.querySelector('#confirmar-titulo').textContent = titulo
    capa.querySelector('#confirmar-texto').textContent = texto
    const si = capa.querySelector('[data-respuesta=si]')
    si.textContent = accion
    si.className = 'boton ' + (destructivo ? 'boton-destructivo' : 'boton-principal')
    const responder = (valor) => () => {
      limpiar()
      cerrarCapa(capa)
      resolver(valor)
    }
    const alSi = responder(true)
    const alNo = responder(false)
    const alCerrar = () => { limpiar(); resolver(false) }
    const limpiar = () => {
      si.removeEventListener('click', alSi)
      capa.querySelector('[data-respuesta=no]').removeEventListener('click', alNo)
      capa.removeEventListener('capa:cerrada', alCerrar)
    }
    si.addEventListener('click', alSi)
    capa.querySelector('[data-respuesta=no]').addEventListener('click', alNo)
    abrirCapa('dialogo-confirmar')
    capa.addEventListener('capa:cerrada', alCerrar, { once: true })
  })

  // ---------------------------------------------------------------- Avisos breves (Sonner)
  let regionAvisos = null
  const avisoBreve = (titulo, detalle = '', tipo = 'exito') => {
    if (!regionAvisos) {
      regionAvisos = document.createElement('ol')
      regionAvisos.className = 'avisos-breves'
      regionAvisos.setAttribute('aria-live', 'polite')
      regionAvisos.setAttribute('aria-label', 'Avisos')
      document.body.append(regionAvisos)
    }
    const li = document.createElement('li')
    li.className = 'aviso-breve'
    li.dataset.tipo = tipo
    li.innerHTML = `${icono(tipo === 'error' ? 'alerta' : tipo === 'info' ? 'info' : 'check-circulo')}<div>${titulo}${detalle ? `<small>${detalle}</small>` : ''}</div>`
    regionAvisos.append(li)
    setTimeout(() => li.remove(), 4200)
  }

  // ---------------------------------------------------------------- Listados filtrables
  const iniciarListado = (raiz) => {
    const filtros = raiz.querySelectorAll('[data-filtros] button')
    const buscador = raiz.querySelector('[data-buscar]')
    const sinResultados = raiz.querySelector('[data-sin-resultados]')
    const total = raiz.querySelector('[data-total]')
    let filtro = raiz.querySelector('[data-filtros] [aria-pressed=true]')?.dataset.filtro || 'todos'

    const aplicar = () => {
      const filas = [...raiz.querySelectorAll('[data-fila]')]
      const q = buscador ? normalizar(buscador.value.trim()) : ''
      const coincide = (f) => !q || normalizar(f.textContent).includes(q)
      filtros.forEach((b) => {
        const n = filas.filter((f) => coincide(f) && (b.dataset.filtro === 'todos' || f.dataset.estado === b.dataset.filtro)).length
        const c = b.querySelector('.conteo')
        if (c) c.textContent = n
      })
      let visibles = 0
      filas.forEach((f) => {
        const ver = coincide(f) && (filtro === 'todos' || f.dataset.estado === filtro)
        f.hidden = !ver
        if (ver) visibles++
      })
      if (sinResultados) {
        sinResultados.hidden = visibles > 0
        const t = sinResultados.querySelector('[data-texto-vacio]')
        if (t) {
          const etiqueta = raiz.querySelector(`[data-filtro="${filtro}"]`)?.dataset.vacio || ''
          t.textContent = q ? `Nada coincide con «${buscador.value.trim()}». Prueba con otra palabra.` : etiqueta
        }
      }
      if (total) total.textContent = `${visibles} de ${filas.length}`
    }
    filtros.forEach((b) => b.addEventListener('click', () => {
      filtros.forEach((o) => o.setAttribute('aria-pressed', String(o === b)))
      filtro = b.dataset.filtro
      aplicar()
    }))
    if (buscador) buscador.addEventListener('input', aplicar)
    raiz.addEventListener('listado:cambio', aplicar)
    aplicar()
  }

  // ---------------------------------------------------------------- Interruptores (Switch)
  document.addEventListener('click', (e) => {
    const sw = e.target.closest('.interruptor')
    if (!sw) return
    const activo = sw.getAttribute('aria-checked') !== 'true'
    sw.setAttribute('aria-checked', String(activo))
    sw.dispatchEvent(new CustomEvent('cambio', { bubbles: true }))
    if (sw.hasAttribute('data-rapido')) {
      const fila = sw.closest('[data-fila], li, tr')
      const insignia = fila && fila.querySelector('[data-insignia-visible]')
      if (insignia) {
        insignia.dataset.estado = activo ? 'listo' : ''
        insignia.textContent = activo ? insignia.dataset.si || 'Visible' : insignia.dataset.no || 'Oculta'
      }
      if (fila && fila.dataset.estado !== undefined && fila.hasAttribute('data-fila')) {
        fila.dataset.estado = activo ? 'visible' : 'oculta'
        const listado = fila.closest('[data-listado]')
        if (listado) listado.dispatchEvent(new CustomEvent('listado:cambio'))
      }
      const nombre = sw.dataset.nombre || 'El elemento'
      avisoBreve(activo ? sw.dataset.textoSi || `${nombre} ya se ve en el sitio` : sw.dataset.textoNo || `${nombre} quedó oculto en el sitio`, 'Puedes cambiarlo cuando quieras.')
    }
  })

  // ---------------------------------------------------------------- Orden (botones y arrastre)
  const renumerar = (lista) => {
    const items = [...lista.children]
    items.forEach((li, i) => {
      const pos = li.querySelector('.posicion')
      if (pos) pos.textContent = i + 1
      const subir = li.querySelector('[data-mover="-1"]')
      const bajar = li.querySelector('[data-mover="1"]')
      if (subir) subir.disabled = i === 0
      if (bajar) bajar.disabled = i === items.length - 1
    })
  }

  const anunciar = (texto) => {
    let r = document.getElementById('anuncios')
    if (!r) {
      r = document.createElement('div')
      r.id = 'anuncios'
      r.className = 'oculto-visual'
      r.setAttribute('aria-live', 'assertive')
      document.body.append(r)
    }
    r.textContent = texto
  }

  const alMover = (lista, li) => {
    renumerar(lista)
    const pos = [...lista.children].indexOf(li) + 1
    const nombre = li.dataset.nombre || 'El elemento'
    anunciar(`${nombre}, posición ${pos} de ${lista.children.length}`)
    if (lista.hasAttribute('data-guardar-al-mover')) avisoBreve('Orden actualizado', `${nombre} quedó en la posición ${pos}.`)
    lista.dispatchEvent(new CustomEvent('cambio', { bubbles: true }))
  }

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-mover]')
    if (!b) return
    const li = b.closest('[data-ordenable] > *')
    const lista = li.parentElement
    const paso = Number(b.dataset.mover)
    if (paso < 0 && li.previousElementSibling) lista.insertBefore(li, li.previousElementSibling)
    else if (paso > 0 && li.nextElementSibling) lista.insertBefore(li.nextElementSibling, li)
    alMover(lista, li)
    const mismo = li.querySelector(`[data-mover="${paso}"]`)
    ;(mismo && !mismo.disabled ? mismo : li.querySelector('[data-mover]:not(:disabled)'))?.focus()
  })

  const iniciarArrastre = (lista) => {
    // Se puede volver a llamar tras agregar o redibujar filas: cada asa y cada fila se preparan una vez.
    lista.querySelectorAll('.asa').forEach((asa) => {
      if (asa._listo) return
      asa._listo = true
      const li = asa.closest('[data-ordenable] > *')
      asa.addEventListener('mousedown', () => { li.draggable = true })
      if (li._arrastre) return
      li._arrastre = true
      li.addEventListener('dragstart', (e) => { lista._arrastrado = li; e.dataTransfer.effectAllowed = 'move'; li.style.opacity = '0.5' })
      li.addEventListener('dragend', () => { li.draggable = false; li.style.opacity = ''; if (lista._arrastrado) alMover(lista, lista._arrastrado); lista._arrastrado = null })
      li.addEventListener('dragover', (e) => {
        const arrastrado = lista._arrastrado
        if (!arrastrado || arrastrado === li) return
        e.preventDefault()
        const caja = li.getBoundingClientRect()
        lista.insertBefore(arrastrado, e.clientY < caja.top + caja.height / 2 ? li : li.nextElementSibling)
      })
    })
    renumerar(lista)
  }

  // ---------------------------------------------------------------- Edición con cambios sin guardar
  let hayCambiosSinGuardar = false

  // `data-no-cuenta` marca controles que no son datos (barra de formato, modo de la vista previa).
  const cuenta = (el) => !el.closest('[data-no-cuenta]')
  const fotografia = (form) => {
    const valores = [...form.querySelectorAll('input, select, textarea')]
      .filter((el) => el.type !== 'file' && cuenta(el))
      .map((el) => (el.type === 'checkbox' || el.type === 'radio' ? el.checked : el.value))
    const interruptores = [...form.querySelectorAll('.interruptor, [aria-pressed]')].filter(cuenta).map((el) => el.getAttribute('aria-checked') || el.getAttribute('aria-pressed'))
    const ordenes = [...form.querySelectorAll('[data-ordenable] > *')].map((li) => li.dataset.id || li.dataset.nombre)
    const extras = [...form.querySelectorAll('[data-valor]')].filter(cuenta).map((el) => el.dataset.valor)
    return JSON.stringify([valores, interruptores, ordenes, extras])
  }

  const iniciarEdicion = (form) => {
    let base = fotografia(form)
    const boton = form.querySelector('[data-guardar]')
    const sinGuardar = form.querySelector('[data-sin-guardar]')
    const guardado = form.querySelector('[data-guardado]')
    const descartar = form.querySelector('[data-descartar]')
    const revisar = () => {
      hayCambiosSinGuardar = fotografia(form) !== base
      boton.disabled = !hayCambiosSinGuardar
      sinGuardar.hidden = !hayCambiosSinGuardar
      if (guardado) guardado.hidden = hayCambiosSinGuardar
      if (descartar) descartar.hidden = !hayCambiosSinGuardar
    }
    form.addEventListener('input', revisar)
    form.addEventListener('change', revisar)
    form.addEventListener('cambio', () => setTimeout(revisar))
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      if (!form.reportValidity()) return
      const texto = boton.innerHTML
      boton.disabled = true
      boton.innerHTML = '<span class="cargando" aria-hidden="true"></span>Guardando…'
      setTimeout(() => {
        boton.innerHTML = texto
        base = fotografia(form)
        revisar()
        if (guardado) guardado.textContent = 'Guardado hace un momento.'
        avisoBreve('Cambios guardados', form.dataset.avisoGuardado || 'Ya se ven en el sitio.')
      }, 700)
    })
    if (descartar) {
      descartar.addEventListener('click', async () => {
        const ok = await confirmar({ titulo: '¿Descartar los cambios?', texto: 'Se pierde todo lo que cambiaste desde la última vez que guardaste.', accion: 'Descartar cambios' })
        if (ok) { hayCambiosSinGuardar = false; location.reload() }
      })
    }
    revisar()
  }

  const navegar = async (url) => {
    if (hayCambiosSinGuardar) {
      const ok = await confirmar({ titulo: 'Tienes cambios sin guardar', texto: 'Si sales ahora, se pierden. Vuelve y pulsa «Guardar cambios» para conservarlos.', accion: 'Salir sin guardar' })
      if (!ok) return
      hayCambiosSinGuardar = false
    }
    location.href = url
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]')
    if (!a || !hayCambiosSinGuardar || a.target === '_blank' || a.getAttribute('href').startsWith('#')) return
    e.preventDefault()
    navegar(a.getAttribute('href'))
  })

  window.addEventListener('beforeunload', (e) => {
    if (hayCambiosSinGuardar) { e.preventDefault(); e.returnValue = '' }
  })

  // ---------------------------------------------------------------- Contraseñas con ojo
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-ver-contrasena]')
    if (!b) return
    const entrada = b.closest('.contrasena').querySelector('input')
    const ver = entrada.type === 'password'
    entrada.type = ver ? 'text' : 'password'
    b.setAttribute('aria-pressed', String(ver))
    b.setAttribute('aria-label', ver ? 'Ocultar la contraseña' : 'Mostrar la contraseña')
    b.innerHTML = icono(ver ? 'ojo-cerrado' : 'ojo')
  })

  // ---------------------------------------------------------------- Botones segmentados de un solo valor
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-grupo-unico] > button')
    if (!b) return
    const grupo = b.parentElement
    grupo.querySelectorAll('button').forEach((o) => o.setAttribute('aria-pressed', String(o === b)))
    grupo.dataset.valor = b.dataset.valor
    grupo.dispatchEvent(new CustomEvent('cambio', { bubbles: true, detail: b.dataset.valor }))
  })

  // ---------------------------------------------------------------- Eliminar con confirmación
  document.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-eliminar]')
    if (!b) return
    e.stopPropagation()
    const ok = await confirmar({ titulo: b.dataset.titulo || '¿Eliminar?', texto: b.dataset.texto || 'Esta acción no se puede deshacer.', accion: b.dataset.accion || 'Eliminar' })
    if (!ok) return
    const fila = b.closest('[data-fila], li')
    const listado = fila && fila.closest('[data-listado]')
    if (fila) fila.remove()
    if (listado) listado.dispatchEvent(new CustomEvent('listado:cambio'))
    avisoBreve(b.dataset.hecho || 'Eliminado')
    if (b.dataset.ir) {
      hayCambiosSinGuardar = false
      setTimeout(() => { location.href = b.dataset.ir }, 900)
    }
  })

  // ---------------------------------------------------------------- Control «Maqueta»
  const montarControlMaqueta = () => {
    const claves = ['rol', ...(document.body.dataset.maqueta || '').split(',').filter(Boolean)]
    const caja = document.createElement('div')
    caja.className = 'control-maqueta'
    const grupos = claves.map((clave) => {
      const e = ESCENARIOS[clave]
      const actual = leer(clave)
      return `<fieldset><legend>${e.titulo}</legend><div class="segmentado segmentado-sm" data-clave="${clave}">${e.opciones.map(([v, t]) => `<button type="button" data-v="${v}" aria-pressed="${v === actual}">${t}</button>`).join('')}</div></fieldset>`
    }).join('')
    caja.innerHTML = `
      <button class="boton boton-sm" type="button" aria-expanded="false" aria-controls="control-maqueta-panel" aria-label="Maqueta: cambiar el escenario">${icono('ajustes', 'icono-sm')}<span class="texto-maqueta">Maqueta</span></button>
      <div class="control-maqueta-panel" id="control-maqueta-panel" hidden>
        <p><strong>Solo en la maqueta.</strong> Cambia el escenario para ver los estados de esta pantalla. No existe en el panel real.</p>
        ${grupos}
        <a href="index.html">Ver todas las pantallas</a>
      </div>`
    // En las pantallas con barra superior va en la barra, para no tapar la barra de guardado.
    const barra = document.querySelector('.barra')
    if (barra) barra.append(caja)
    else document.body.append(caja)
    const boton = caja.querySelector('.boton')
    const panelCaja = caja.querySelector('.control-maqueta-panel')
    const alternar = (abrir) => {
      panelCaja.hidden = !abrir
      boton.setAttribute('aria-expanded', String(abrir))
    }
    boton.addEventListener('click', () => alternar(panelCaja.hidden))
    document.addEventListener('click', (e) => { if (!caja.contains(e.target)) alternar(false) })
    caja.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panelCaja.hidden) { e.stopPropagation(); alternar(false); boton.focus() } })
    caja.querySelectorAll('[data-clave] button').forEach((b) => b.addEventListener('click', () => {
      guardar(b.parentElement.dataset.clave, b.dataset.v)
      hayCambiosSinGuardar = false
      location.reload()
    }))
  }

  // ---------------------------------------------------------------- Pantallas
  const PANTALLAS = {}

  PANTALLAS.ingreso = () => {
    const form = document.querySelector('#form-ingreso')
    const alerta = document.querySelector('#alerta-ingreso')
    const mostrarError = () => {
      alerta.hidden = false
      form.querySelectorAll('.entrada').forEach((i) => i.setAttribute('aria-invalid', 'true'))
    }
    if (leer('ingreso') === 'error') mostrarError()
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const correo = form.querySelector('#correo').value.trim()
      const clave = form.querySelector('#clave').value
      if (!correo || !clave || leer('ingreso') === 'error') { mostrarError(); alerta.focus(); return }
      const b = form.querySelector('[type=submit]')
      b.disabled = true
      b.innerHTML = '<span class="cargando" aria-hidden="true"></span>Ingresando…'
      setTimeout(() => { location.href = 'inicio.html' }, 600)
    })
  }

  PANTALLAS.inicio = () => {
    const h = hoy.getHours()
    document.querySelector('#saludo').textContent = h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches'
    const fecha = document.querySelector('#fecha')
    fecha.dateTime = hoy.toISOString().slice(0, 10)
    const textoFecha = hoy.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    fecha.textContent = textoFecha.charAt(0).toUpperCase() + textoFecha.slice(1)
    const conPendientes = leer('pendientes') === 'si'
    document.querySelectorAll('[data-escenario]').forEach((el) => {
      el.hidden = el.dataset.escenario !== (conPendientes ? 'pendientes' : 'al-dia')
    })
    const nuevos = nuevosVisibles()
    const borradores = conPendientes && leer('publicaciones') === 'ejemplos' ? 1 : 0
    const tarjetas = { mensajes: nuevos, borradores, datos: 6 }
    Object.entries(tarjetas).forEach(([clave, n]) => {
      const t = document.querySelector(`[data-atencion="${clave}"]`)
      if (!t) return
      t.dataset.pendiente = String(n > 0)
      t.querySelector('strong').textContent = n
      t.querySelector('em').textContent = n > 0 ? t.dataset.conPendiente : t.dataset.sinPendiente
    })
    const cuerpo = document.querySelector('#tabla-pendientes tbody')
    const pendientes = MENSAJES.filter((m) => m.estado === 'nuevo').slice(0, nuevos)
    cuerpo.innerHTML = pendientes.map((m) => `
      <tr>
        <td class="principal-movil"><div class="celda-principal-texto"><strong>${m.nombre} <span class="ejemplo">Ejemplo</span></strong><span>${m.servicio}</span></div></td>
        <td class="ocultar-movil">Mensaje de contacto</td>
        <td class="debajo-movil texto-suave fecha">${formatoFecha(m.fecha)}</td>
        <td class="lado-movil derecha"><a class="boton boton-secundario boton-sm" href="mensajes.html#${m.id}" aria-label="Ver el mensaje de ${m.nombre}">Ver</a></td>
      </tr>`).join('') + (borradores ? `
      <tr>
        <td class="principal-movil"><div class="celda-principal-texto"><strong>Cronograma de obligaciones de diciembre <span class="ejemplo">Ejemplo</span></strong><span>Borrador sin publicar</span></div></td>
        <td class="ocultar-movil">Publicación</td>
        <td class="debajo-movil texto-suave fecha">${formatoFecha(haceDias(2, 12, 30))}</td>
        <td class="lado-movil derecha"><a class="boton boton-secundario boton-sm" href="publicacion-editar.html?id=cronograma" aria-label="Ver el borrador">Ver</a></td>
      </tr>` : '')
    document.querySelector('#pendientes-vacio').hidden = pendientes.length + borradores > 0
    document.querySelector('#tabla-pendientes').hidden = pendientes.length + borradores === 0
  }

  PANTALLAS.mensajes = () => {
    const vacio = leer('mensajes') === 'sin'
    const alDia = leer('pendientes') === 'no'
    const mensajes = vacio ? [] : MENSAJES.map((m) => ({ ...m, estado: alDia ? 'atendido' : m.estado }))
    const esAdmin = leer('rol') !== 'editor'
    document.querySelector('#mensajes-con').hidden = vacio
    document.querySelector('#mensajes-sin').hidden = !vacio
    if (vacio) return
    const cuerpo = document.querySelector('#tabla-mensajes tbody')
    const insignia = (estado) => estado === 'nuevo' ? '<span class="insignia" data-estado="pendiente">Nuevo</span>' : '<span class="insignia" data-estado="listo">Atendido</span>'
    const extracto = (t) => (t.length > 70 ? t.slice(0, 70).trimEnd() + '…' : t)
    const fila = (m) => `
      <tr class="fila-accion" data-fila data-id="${m.id}" data-estado="${m.estado}">
        <td class="principal-movil"><div class="celda-principal">
          <span class="avatar avatar-sm" aria-hidden="true">${m.nombre.split(' ').map((p) => p[0]).join('').slice(0, 2)}</span>
          <div class="celda-principal-texto"><button class="enlace-fila" type="button" data-abrir-mensaje="${m.id}">${m.nombre}</button><span>${extracto(m.mensaje)}</span></div>
        </div></td>
        <td class="ocultar-movil">${m.servicio}</td>
        <td class="lado-movil" data-celda-estado>${insignia(m.estado)}</td>
        <td class="debajo-movil texto-suave fecha">${formatoFecha(m.fecha)}</td>
      </tr>`
    cuerpo.innerHTML = mensajes.map(fila).join('') + cuerpo.innerHTML
    const listado = document.querySelector('[data-listado]')
    iniciarListado(listado)

    const hoja = document.querySelector('#hoja-mensaje')
    let actual = null
    const pintarHoja = (m) => {
      actual = m
      hoja.querySelector('#hoja-titulo').textContent = m.nombre
      hoja.querySelector('#hoja-fecha').textContent = 'Recibido: ' + formatoFecha(m.fecha)
      hoja.querySelector('#hoja-estado').innerHTML = insignia(m.estado)
      hoja.querySelector('#hoja-servicio').textContent = m.servicio
      hoja.querySelector('#hoja-mensaje-texto').textContent = m.mensaje
      hoja.querySelector('#nota-celular').value = m.celular
      hoja.querySelector('#nota-correo').value = m.correo
      hoja.querySelector('#nota-celular').removeAttribute('aria-invalid')
      hoja.querySelector('#error-celular').hidden = true
      const conCelular = Boolean(m.celular)
      hoja.querySelector('#responder-con').hidden = !conCelular
      hoja.querySelector('#responder-sin').hidden = conCelular
      hoja.querySelectorAll('[data-celular-texto]').forEach((s) => { s.textContent = m.celular })
      const marcar = hoja.querySelector('#marcar-estado')
      marcar.innerHTML = m.estado === 'nuevo' ? icono('check') + 'Marcar como atendido' : icono('deshacer') + 'Volver a «Nuevo»'
      marcar.className = 'boton ' + (m.estado === 'nuevo' ? 'boton-principal' : 'boton-secundario')
      hoja.querySelector('#eliminar-mensaje').hidden = !esAdmin
    }
    const abrir = (id, disparador) => {
      const m = mensajes.find((x) => x.id === id)
      if (!m) return
      pintarHoja(m)
      abrirCapa('hoja-mensaje', disparador)
      history.replaceState(null, '', '#' + id)
    }
    hoja.addEventListener('capa:cerrada', () => history.replaceState(null, '', location.pathname))
    cuerpo.addEventListener('click', (e) => {
      const tr = e.target.closest('tr[data-id]')
      if (!tr) return
      abrir(tr.dataset.id, tr.querySelector('[data-abrir-mensaje]'))
    })
    const actualizarFila = (m) => {
      const tr = cuerpo.querySelector(`tr[data-id="${m.id}"]`)
      tr.dataset.estado = m.estado
      tr.querySelector('[data-celda-estado]').innerHTML = insignia(m.estado)
      recontar()
    }
    // Recalcula los filtros y el contador del menú lateral.
    const recontar = () => {
      listado.dispatchEvent(new CustomEvent('listado:cambio'))
      const n = mensajes.filter((x) => x.estado === 'nuevo').length
      const c = document.querySelector('.menu-enlace[href="mensajes.html"] .contador')
      if (c) { c.textContent = n; c.hidden = n === 0 }
    }
    hoja.querySelector('#marcar-estado').addEventListener('click', () => {
      actual.estado = actual.estado === 'nuevo' ? 'atendido' : 'nuevo'
      actualizarFila(actual)
      pintarHoja(actual)
      avisoBreve(actual.estado === 'atendido' ? `Mensaje de ${actual.nombre} atendido` : `Mensaje de ${actual.nombre} vuelve a «Nuevo»`, actual.estado === 'atendido' ? 'Ya no cuenta como pendiente en el inicio.' : 'Vuelve a contar como pendiente.')
    })
    hoja.querySelector('#form-nota').addEventListener('submit', (e) => {
      e.preventDefault()
      const cel = hoja.querySelector('#nota-celular')
      const limpio = cel.value.replace(/\s/g, '')
      if (limpio && !/^9\d{8}$/.test(limpio)) {
        cel.setAttribute('aria-invalid', 'true')
        hoja.querySelector('#error-celular').hidden = false
        cel.focus()
        return
      }
      cel.removeAttribute('aria-invalid')
      hoja.querySelector('#error-celular').hidden = true
      actual.celular = limpio ? limpio.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3') : ''
      actual.correo = hoja.querySelector('#nota-correo').value.trim()
      pintarHoja(actual)
      avisoBreve('Datos de contacto guardados')
    })
    hoja.querySelectorAll('[data-simular]').forEach((b) => b.addEventListener('click', () => {
      avisoBreve(b.dataset.simular, 'En la maqueta no se abre ninguna aplicación.', 'info')
    }))
    hoja.querySelector('#eliminar-mensaje').addEventListener('click', async () => {
      const ok = await confirmar({ titulo: `¿Eliminar el mensaje de ${actual.nombre}?`, texto: 'Se borra para siempre y no se puede recuperar. Si solo ya lo respondiste, márcalo como atendido.', accion: 'Eliminar mensaje' })
      if (!ok) return
      const i = mensajes.indexOf(actual)
      mensajes.splice(i, 1)
      cuerpo.querySelector(`tr[data-id="${actual.id}"]`).remove()
      cerrarCapa(hoja)
      recontar()
      avisoBreve('Mensaje eliminado')
    })
    const desdeEnlace = location.hash.slice(1)
    if (desdeEnlace) setTimeout(() => abrir(desdeEnlace, cuerpo.querySelector(`tr[data-id="${desdeEnlace}"] [data-abrir-mensaje]`)), 50)
  }

  PANTALLAS.plan = () => {
    // Matriz de lo que incluye el plan y vista previa en vivo de «Nuestros planes».
    const controles = document.querySelectorAll('[data-inclusion]')
    controles.forEach((grupo) => {
      const fila = grupo.closest('li')
      const texto = fila.querySelector('.entrada')
      const pintar = () => {
        const v = grupo.dataset.valor
        texto.hidden = v !== 'texto'
        const celda = document.querySelector(`[data-vista-celda="${grupo.dataset.inclusion}"]`)
        if (!celda) return
        celda.innerHTML = v === 'incluido'
          ? `<span class="publica-si" role="img" aria-label="Incluido">${icono('check')}</span>`
          : v === 'no-incluido'
            ? '<span class="publica-no" role="img" aria-label="No incluido">—</span>'
            : (texto.value || '…').replace(/</g, '&lt;')
      }
      grupo.addEventListener('cambio', pintar)
      texto.addEventListener('input', pintar)
      pintar()
    })
    const nombre = document.querySelector('#plan-nombre')
    nombre.addEventListener('input', () => {
      document.querySelectorAll('[data-reflejo=nombre]').forEach((el) => { el.textContent = nombre.value || 'Sin nombre' })
    })
    const sinMontos = (campo, error) => campo.addEventListener('input', () => {
      const hayMonto = /(s\/\.?|\bpen\b|\$)\s*\d|\d+([.,]\d{2})\s*(soles|pen)/i.test(campo.value)
      campo.setAttribute('aria-invalid', String(hayMonto))
      document.querySelector(error).hidden = !hayMonto
      campo.setCustomValidity(hayMonto ? 'No se publican montos.' : '')
    })
    sinMontos(nombre, '#error-nombre')
    document.querySelectorAll('[data-sin-montos]').forEach((c) => sinMontos(c, c.dataset.sinMontos))
  }

  PANTALLAS.sede = () => {
    const lista = document.querySelector('#lista-celulares')
    const plantilla = document.querySelector('#plantilla-celular')
    const vista = () => {
      const nombre = document.querySelector('#sede-nombre').value
      const dir = document.querySelector('#sede-direccion').value
      const distrito = document.querySelector('#sede-distrito').value
      const ciudad = document.querySelector('#sede-ciudad').value
      document.querySelectorAll('[data-reflejo=sede]').forEach((el) => { el.textContent = nombre.replace(/^Sede\s+/i, '') || 'Sede' })
      document.querySelector('[data-reflejo=direccion]').textContent = [dir, distrito, ciudad].filter(Boolean).join(', ')
      const celulares = [...lista.children].map((li) => ({ n: li.querySelector('input').value, wa: li.querySelector('.interruptor').getAttribute('aria-checked') === 'true' }))
      const wa = celulares.find((c) => c.wa && c.n)
      const llamar = celulares.find((c) => !c.wa && c.n) || celulares.find((c) => c.n)
      document.querySelector('#vista-botones').innerHTML =
        (wa ? `<span class="publica-wa">${icono('whatsapp', 'icono-sm')}WhatsApp ${wa.n}</span>` : '') +
        (llamar ? `<span class="publica-llamar">${icono('telefono', 'icono-sm')}Llamar ${llamar.n}</span>` : '') +
        `<span class="publica-linea">${icono('pin', 'icono-sm')}Cómo llegar</span>`
      document.querySelector('#vista-sin-whatsapp').hidden = Boolean(wa)
    }
    const form = document.querySelector('form[data-edicion]')
    form.addEventListener('input', vista)
    form.addEventListener('cambio', () => setTimeout(vista))
    const ajustarQuitar = () => {
      const unico = lista.children.length === 1
      lista.querySelectorAll('[data-quitar-celular]').forEach((b) => { b.disabled = unico; b.title = unico ? 'Cada sede necesita al menos un celular' : '' })
    }
    document.querySelector('#agregar-celular').addEventListener('click', () => {
      const li = plantilla.content.firstElementChild.cloneNode(true)
      const n = Date.now()
      li.querySelector('input').id = 'cel-' + n
      li.querySelector('label').htmlFor = 'cel-' + n
      lista.append(li)
      ajustarQuitar()
      li.querySelector('input').focus()
      form.dispatchEvent(new Event('input'))
    })
    lista.addEventListener('click', (e) => {
      const b = e.target.closest('[data-quitar-celular]')
      if (!b) return
      b.closest('li').remove()
      ajustarQuitar()
      form.dispatchEvent(new Event('input'))
      document.querySelector('#agregar-celular').focus()
    })
    lista.addEventListener('input', (e) => {
      if (!e.target.matches('input')) return
      const limpio = e.target.value.replace(/\s/g, '')
      const mal = limpio !== '' && !/^9\d{8}$/.test(limpio)
      e.target.setAttribute('aria-invalid', String(mal))
      e.target.closest('li').querySelector('.error-campo').hidden = !mal
      e.target.setCustomValidity(mal ? 'Solo celulares de 9 dígitos que empiezan con 9.' : '')
    })
    const mapa = document.querySelector('#sede-mapa')
    mapa.addEventListener('input', () => {
      const v = mapa.value.trim()
      const mal = v !== '' && !v.startsWith('https://www.google.com/maps/embed')
      mapa.setAttribute('aria-invalid', String(mal))
      document.querySelector('#error-mapa').hidden = !mal
      mapa.setCustomValidity(mal ? 'Pega la dirección del mapa insertado.' : '')
    })
    ajustarQuitar()
    vista()
  }

  PANTALLAS.portadas = () => {
    const form = document.querySelector('form[data-edicion]')
    const portada = document.querySelector('#vista-portada')
    const titulo = document.querySelector('#portada-titulo')
    const subtitulo = document.querySelector('#portada-subtitulo')
    const pintarTitulo = () => {
      const seguro = titulo.value.replace(/&/g, '&amp;').replace(/</g, '&lt;')
      document.querySelector('#vista-titulo').innerHTML = seguro.replace(/\[([^\]]+)\]/g, '<mark>$1</mark>')
      document.querySelector('#vista-subtitulo').textContent = subtitulo.value
    }
    titulo.addEventListener('input', pintarTitulo)
    subtitulo.addEventListener('input', pintarTitulo)
    document.querySelector('#disposicion').addEventListener('cambio', (e) => { portada.dataset.disposicion = e.detail })
    const imagenActual = document.querySelector('#imagen-actual')
    const nombreImagen = document.querySelector('#imagen-nombre')
    const zona = document.querySelector('.zona-imagen')
    const usarImagen = (src, nombre) => {
      imagenActual.src = src
      nombreImagen.textContent = nombre
      zona.dataset.valor = nombre
      portada.style.backgroundImage = `url('${src}')`
      form.dispatchEvent(new Event('input'))
    }
    const archivo = document.querySelector('#subir-imagen')
    archivo.addEventListener('change', () => {
      const f = archivo.files[0]
      if (!f) return
      if (!f.type.startsWith('image/')) { avisoBreve('Ese archivo no es una imagen', 'Usa JPG, PNG o WebP.', 'error'); return }
      const lector = new FileReader()
      lector.onload = () => { usarImagen(lector.result, f.name); avisoBreve('Imagen lista', 'Se sube a Imágenes cuando guardes.') }
      lector.readAsDataURL(f)
    })
    ;['dragenter', 'dragover'].forEach((t) => zona.addEventListener(t, (e) => { e.preventDefault(); zona.dataset.arrastrando = 'true' }))
    ;['dragleave', 'drop'].forEach((t) => zona.addEventListener(t, () => { zona.dataset.arrastrando = 'false' }))
    zona.addEventListener('drop', (e) => {
      e.preventDefault()
      const f = e.dataTransfer.files[0]
      if (!f) return
      const dt = new DataTransfer()
      dt.items.add(f)
      archivo.files = dt.files
      archivo.dispatchEvent(new Event('change'))
    })
    const biblioteca = document.querySelector('#dialogo-biblioteca')
    let elegida = null
    biblioteca.querySelectorAll('.biblioteca button').forEach((b) => b.addEventListener('click', () => {
      biblioteca.querySelectorAll('.biblioteca button').forEach((o) => o.setAttribute('aria-pressed', String(o === b)))
      elegida = b
      biblioteca.querySelector('#usar-elegida').disabled = false
    }))
    biblioteca.querySelector('#usar-elegida').addEventListener('click', () => {
      if (!elegida) return
      usarImagen(elegida.querySelector('img').getAttribute('src'), elegida.querySelector('span').textContent)
      cerrarCapa(biblioteca)
    })
    const encuadre = document.querySelector('#encuadre')
    encuadre.addEventListener('input', () => {
      document.querySelector('#encuadre-valor').textContent = encuadre.value + ' %'
      portada.style.backgroundPosition = `${encuadre.value}% center`
    })
    pintarTitulo()
  }

  PANTALLAS.medios = () => {
    const hoja = document.querySelector('#hoja-medio')
    document.querySelectorAll('[data-medio]').forEach((b) => b.addEventListener('click', () => {
      const img = b.querySelector('img')
      hoja.querySelector('#medio-imagen').src = img.getAttribute('src')
      hoja.querySelector('#medio-imagen').classList.toggle('logo', b.parentElement.classList.contains('logo'))
      hoja.querySelector('#medio-titulo').textContent = b.querySelector('strong').textContent
      hoja.querySelector('#medio-alt').value = b.dataset.alt
      hoja.querySelector('#medio-uso').textContent = b.dataset.uso
      abrirCapa('hoja-medio', b)
    }))
    hoja.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault()
      cerrarCapa(hoja)
      avisoBreve('Texto alternativo guardado')
    })
    document.querySelector('#subir-medio').addEventListener('change', (e) => {
      const n = e.target.files.length
      if (n) avisoBreve(n === 1 ? 'Imagen lista para subir' : `${n} imágenes listas para subir`, 'En el panel real se suben a la biblioteca.', 'info')
    })
  }

  PANTALLAS.usuarios = () => {
    const form = document.querySelector('#form-usuario')
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      if (!form.reportValidity()) return
      const nombre = form.querySelector('#u-nombre').value.trim()
      const correo = form.querySelector('#u-correo').value.trim()
      const rol = form.querySelector('#u-rol').value
      const tr = document.createElement('tr')
      tr.dataset.fila = ''
      tr.dataset.estado = rol
      tr.innerHTML = `
        <td class="principal-movil"><div class="celda-principal"><span class="avatar avatar-sm" aria-hidden="true">${nombre.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()}</span><div class="celda-principal-texto"><strong>${nombre.replace(/</g, '&lt;')} <span class="ejemplo">Ejemplo</span></strong><span>${correo.replace(/</g, '&lt;')}</span></div></div></td>
        <td class="lado-movil"><span class="insignia insignia-sin-punto">${rol === 'administrador' ? 'Administrador' : 'Editor'}</span></td>
        <td class="debajo-movil texto-suave">Todavía no ingresa</td>
        <td class="derecha ocultar-movil"><button class="boton boton-fantasma boton-icono boton-sm" type="button" aria-label="Eliminar la cuenta de ${nombre.replace(/"/g, '')}" data-eliminar data-titulo="¿Eliminar la cuenta de ${nombre.replace(/"/g, '')}?" data-texto="La persona ya no podrá entrar al panel. Lo que publicó se conserva." data-accion="Eliminar cuenta" data-hecho="Cuenta eliminada">${icono('basura', 'icono-sm')}</button></td>`
      document.querySelector('#tabla-usuarios tbody').append(tr)
      document.querySelector('[data-listado]').dispatchEvent(new CustomEvent('listado:cambio'))
      form.reset()
      cerrarCapa(document.querySelector('#dialogo-usuario'))
      avisoBreve('Cuenta creada', `Comparte con ${nombre} su correo y la contraseña temporal.`)
    })
  }

  PANTALLAS.cuenta = () => {
    const form = document.querySelector('#form-contrasena')
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const nueva = form.querySelector('#clave-nueva')
      const repetir = form.querySelector('#clave-repetir')
      const errorLargo = form.querySelector('#error-largo')
      const errorIgual = form.querySelector('#error-igual')
      const corta = nueva.value.length < 10
      const distinta = nueva.value !== repetir.value
      nueva.setAttribute('aria-invalid', String(corta))
      repetir.setAttribute('aria-invalid', String(!corta && distinta))
      errorLargo.hidden = !corta
      errorIgual.hidden = corta || !distinta
      if (!form.querySelector('#clave-actual').value) { form.querySelector('#clave-actual').focus(); form.querySelector('#clave-actual').setAttribute('aria-invalid', 'true'); form.querySelector('#error-actual').hidden = false; return }
      form.querySelector('#clave-actual').setAttribute('aria-invalid', 'false')
      form.querySelector('#error-actual').hidden = true
      if (corta) { nueva.focus(); return }
      if (distinta) { repetir.focus(); return }
      form.reset()
      form.querySelectorAll('.entrada').forEach((i) => { i.type = 'password'; i.removeAttribute('aria-invalid') })
      form.querySelectorAll('[data-ver-contrasena]').forEach((b) => { b.setAttribute('aria-pressed', 'false'); b.setAttribute('aria-label', 'Mostrar la contraseña'); b.innerHTML = icono('ojo') })
      avisoBreve('Contraseña cambiada', 'Úsala la próxima vez que ingreses.')
    })
    form.querySelector('#clave-nueva').addEventListener('input', (e) => {
      const n = e.target.value.length
      const req = form.querySelector('#requisito-largo')
      req.dataset.cumple = String(n >= 10)
      req.querySelector('span').textContent = n >= 10 ? 'Tiene 10 caracteres o más' : `Al menos 10 caracteres (llevas ${n})`
    })
  }

  PANTALLAS.guia = () => {
    const avisos = JSON.parse(document.querySelector('#datos-avisos').textContent)
    const hojaAviso = document.querySelector('#hoja-aviso')
    let avisoActual = null
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-editar-aviso]')
      if (!b) return
      const a = avisos.find((x) => x.id === b.dataset.editarAviso) || { titulo: '', cuando: '', documentos: [], correo: 'contabilidad@jjmm.com.pe' }
      avisoActual = b.dataset.editarAviso
      hojaAviso.querySelector('#aviso-hoja-titulo').textContent = avisoActual === 'nuevo' ? 'Nuevo aviso' : 'Editar aviso'
      hojaAviso.querySelector('#aviso-titulo').value = a.titulo
      hojaAviso.querySelector('#aviso-cuando').value = a.cuando
      hojaAviso.querySelector('#aviso-documentos').value = a.documentos.join('\n')
      hojaAviso.querySelector('#aviso-correo').value = a.correo
      abrirCapa('hoja-aviso', b)
    })
    hojaAviso.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault()
      if (!e.target.reportValidity()) return
      const titulo = hojaAviso.querySelector('#aviso-titulo').value.trim()
      const a = avisos.find((x) => x.id === avisoActual)
      if (a) {
        a.titulo = titulo
        const boton = document.querySelector(`tr[data-id="${a.id}"] .enlace-fila`)
        if (boton) boton.textContent = titulo
      }
      cerrarCapa(hojaAviso)
      avisoBreve(a ? 'Aviso guardado' : 'Aviso creado', a ? 'La guía ya muestra los cambios.' : 'En el panel real se agrega al final de la lista.')
    })

    const hojaVenc = document.querySelector('#hoja-vencimiento')
    let filaActual = null
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-editar-vencimiento]')
      if (!b) return
      filaActual = b.closest('tr')
      hojaVenc.querySelector('#venc-hoja-titulo').textContent = filaActual ? 'Editar vencimiento' : 'Nuevo vencimiento'
      hojaVenc.querySelector('#venc-obligacion').value = b.dataset.obligacion
      hojaVenc.querySelector('#venc-cuando').value = b.dataset.cuando
      hojaVenc.querySelectorAll('#venc-periodo button').forEach((o) => o.setAttribute('aria-pressed', String(o.dataset.valor === b.dataset.periodo)))
      abrirCapa('hoja-vencimiento', b)
    })
    hojaVenc.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault()
      if (!e.target.reportValidity()) return
      if (filaActual) {
        const b = filaActual.querySelector('.enlace-fila')
        b.textContent = hojaVenc.querySelector('#venc-obligacion').value.trim()
        b.dataset.obligacion = b.textContent
        b.dataset.cuando = hojaVenc.querySelector('#venc-cuando').value.trim()
        filaActual.querySelector('.celda-principal-texto span').textContent = b.dataset.cuando
      }
      cerrarCapa(hojaVenc)
      avisoBreve(filaActual ? 'Vencimiento guardado' : 'Vencimiento creado', 'La guía ya muestra los cambios.')
    })
  }

  PANTALLAS.publicaciones = () => {
    const vacio = leer('publicaciones') === 'vacio'
    document.querySelector('#publicaciones-con').hidden = vacio
    document.querySelector('#publicaciones-sin').hidden = !vacio
    if (!vacio) iniciarListado(document.querySelector('[data-listado]'))
  }

  // ================================================================ Pantallas nuevas por aprobar (P6b)
  // Lo que sigue solo lo usan las pantallas nuevas. Los datos son los de la semilla
  // (`sitio/src/semilla/datos/`) salvo lo marcado «Ejemplo».

  const escapar = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  const parametro = (clave) => new URLSearchParams(location.search).get(clave)
  const conCorchetes = (t) => escapar(t).replace(/\[([^\]]+)\]/g, '<mark>$1</mark>')
  const generarSlug = (t) => normalizar(t).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  const disparar = (el, tipo, detail) => el.dispatchEvent(new CustomEvent(tipo, { bubbles: true, detail }))
  const cambiarMiga = (texto) => { const m = document.querySelector('.ruta [aria-current=page]'); if (m) m.textContent = texto }

  // ---------------------------------------------------------------- Datos reales de la semilla
  const NOMBRES_DE_CLIENTES = ['Cadex', 'Cliente del estudio (nombre por confirmar)', 'Insutec', 'Interfreeze', 'Líneas Perú Travel', 'Cliente del estudio (nombre por confirmar)', 'Lineaz Tour Operador', 'Empresa Pesquera Yabafish S.A.C.', 'Faser Rent a Car', 'Samari S.A.C.', 'STI Gold']
  const POR_CONFIRMAR = /por confirmar/i
  const ALT_BANNER = 'Contamos con Sistema de Gestión Empresarial SIGE Mype. Somos más que un estudio contable. Asesoría gratuita.'
  const MEDIOS = [
    { archivo: 'hero-plan.webp', uso: 'inicio', alt: 'Profesional con camisa del Grupo JJMM toca una pantalla digital con un mapamundi de fondo.' },
    { archivo: 'banner-sige-mype.webp', uso: 'inicio', alt: ALT_BANNER },
    { archivo: 'hero-sige-movil.webp', uso: 'inicio', alt: ALT_BANNER },
    { archivo: 'hero-taza.webp', uso: 'inicio', alt: 'Manos que señalan gráficos de barras en un informe, junto a una taza del Grupo JJMM.' },
    { archivo: 'hero-equipo.webp', uso: 'inicio', alt: 'Equipo de trabajo que revisa gráficos financieros sobre una mesa con computadoras portátiles.' },
    { archivo: 'rueda-sige-mype.webp', uso: 'inicio', alt: 'Rueda SIGE Mype: la contabilidad al centro, rodeada por nueve áreas de servicio en un ciclo de mejora continua.' },
    { archivo: 'logo-jjmm.png', uso: 'marca', alt: 'JJMM, Mariñas & Asociados, Estudio Contable' },
    { archivo: 'logo-grupo-lenin.png', uso: 'marca', alt: 'Sello SIGE Mype del Grupo JJMM' },
    { archivo: 'sige-312.png', uso: 'marca', alt: 'Sello SIGE Mype del Grupo JJMM' },
    { archivo: 'sigefact.png', uso: 'marca', alt: 'SIGEFact, facturación electrónica' },
    ...NOMBRES_DE_CLIENTES.map((n, i) => ({ archivo: `client-logo${i + 1}.png`, ruta: `img/clientes/client-logo${i + 1}.png`, uso: 'clientes', alt: n })),
  ].map((m) => ({ ...m, src: m.ruta || 'img/' + m.archivo }))
  const medioPorArchivo = (a) => MEDIOS.find((m) => m.archivo === a) || null

  const CONSULTA = (s) => `Hola, quiero información del servicio ${s}.`
  const AREAS = [
    { codigo: 'P1', nombre: 'Legal', corto: 'Legal', descripcion: 'Un equipo de abogados y contadores especializados en diversos campos para el sector empresarial peruano y la inversión extranjera. Damos información precisa en aplicación de las normas comerciales vigentes, en asuntos societarios y contractuales, para resolver tus necesidades legales de manera oportuna.', puntos: ['Asesoría legal', 'Servicios legales', 'Asesoría contable legal'], mensaje: CONSULTA('Legal'), poligono: '72.8,155.8 174.1,78.7 216.5,191.5 203.1,197.6 190.8,205.7 179.8,215.4 170.3,226.6' },
    { codigo: 'P2', nombre: 'Tributaria', corto: 'Tributaria', descripcion: 'Un equipo de contadores especialistas para el sector empresarial peruano y la inversión extranjera. Damos solución ante las contingencias que generan los cambios en las normas tributarias, con atención personalizada, cualquiera sea tu régimen tributario.', puntos: ['Consultas tributarias', 'Problemática fiscal', 'Cumplimiento de las normas tributarias', 'Asesoría contable tributaria'], mensaje: CONSULTA('Tributario'), poligono: '183.5,77.6 322.0,78.1 284.2,190.3 268.5,186.4 252.4,185.0 236.2,186.2 220.5,190.1' },
    { codigo: 'P3', nombre: 'Laboral', corto: 'Laboral', descripcion: 'Contadores y abogados laboralistas trabajamos en equipo, con gran experiencia en derecho laboral y de la seguridad social. Asesoramos a personas naturales y empresas, cualquiera sea su régimen laboral.', puntos: ['Manejo de nóminas', 'Indemnizaciones', 'Informes sobre consultas específicas', 'Asesoría contable laboral'], mensaje: CONSULTA('Laboral'), poligono: '331.0,80.3 438.3,168.3 337.4,232.0 327.7,219.1 316.0,207.9 302.8,198.7 288.2,191.7' },
    { codigo: 'P4', nombre: 'Administración', corto: 'Administración', descripcion: 'Administradores especialistas evaluamos y asesoramos a empresas que buscan más eficiencia en el uso de sus recursos, con una organización simple, dinámica y actual que cubre todas las etapas de la administración.', puntos: ['Reducción de procesos inútiles y repetidos', 'Optimización de procedimientos administrativos', 'Herramientas de gestión para decidir mejor', 'Políticas, normas y procedimientos', 'Formatos de control administrativo', 'Asesoría contable administrativa'], mensaje: CONSULTA('de Administración'), poligono: '443.0,176.2 471.4,305.2 352.6,294.8 352.8,279.4 350.6,264.2 346.2,249.5 339.6,235.7' },
    { codigo: 'P5', nombre: 'Financiera', corto: 'Financiera', descripcion: 'Las finanzas son una de las áreas más importantes para que un negocio siga en marcha, aunque muchos emprendedores las dejan para después. Te ayudamos a ordenarlas y a planificar.', puntos: ['Registro de operaciones contables y financieras', 'Análisis y evaluación de la información', 'Fuentes de financiamiento', 'Opciones de inversión', 'Flujos proyectados', 'Asesoría contable financiera'], mensaje: CONSULTA('Financiero'), poligono: '465.8,313.8 408.9,433.9 325.5,355.3 335.4,343.0 343.3,329.2 348.9,314.5 352.2,299.0' },
    { codigo: 'P6', nombre: 'Sistema de calidad', corto: 'Calidad', descripcion: 'Un sistema de gestión de calidad permite planear, ejecutar y controlar las actividades de tu organización con altos estándares, medidos con indicadores de satisfacción de tus clientes.', puntos: ['Sistema de calidad SIGE Mype', 'Sistemas de calidad ISO', 'Seguridad y salud en el trabajo (SUNAFIL)', 'Homologaciones'], mensaje: CONSULTA('de Sistema de calidad'), poligono: '398.0,435.6 260.4,494.9 256.1,386.9 274.4,384.5 292.0,378.8 308.2,369.9 322.5,358.3' },
    { codigo: 'P7', nombre: 'Tecnología de la información', corto: 'Tecnología', descripcion: 'Prevenimos incidencias en tus equipos y, si ocurren, las resolvemos rápido, para que tus datos estén siempre a salvo y tu negocio no se detenga.', puntos: ['Soporte remoto', 'Configuración de redes', 'Copias de respaldo de datos', 'Cableado estructurado', 'Diagnóstico'], mensaje: CONSULTA('de Tecnología'), poligono: '251.6,494.2 107.9,436.2 182.1,358.9 197.2,370.8 214.2,379.7 232.7,385.1 251.8,387.0' },
    { codigo: 'P8', nombre: 'Comercio exterior', corto: 'Comercio exterior', descripcion: 'Especialistas en comercio internacional para acompañar a las pequeñas y medianas empresas que importan y exportan.', puntos: ['Asesoría en importaciones y exportaciones', 'Devolución de impuestos a exportadores y por pagos en exceso', 'Drawback y devolución de IGV ante SUNAT'], mensaje: CONSULTA('de Comercio exterior'), poligono: '96.0,435.6 36.3,300.7 151.2,292.9 153.9,310.2 159.6,326.8 168.1,342.2 179.1,355.9' },
    { codigo: 'P9', nombre: 'Auditorías y precios de transferencia', corto: 'Auditoría', descripcion: 'Profesionales con amplia experiencia en auditoría y consultoría en firmas internacionales, para un servicio de alta calidad cuando lo necesitas.', puntos: ['Auditoría de estados financieros', 'Evaluación de control interno', 'Auditoría financiera y tributaria', 'Exámenes especiales y peritajes'], mensaje: CONSULTA('de Auditoría'), poligono: '30.6,291.8 67.6,163.5 167.9,230.1 160.3,243.6 154.9,258.1 151.8,273.2 151.0,288.6' },
  ]

  const PLANES = ['Emprende', 'SIGEMype I', 'SIGEMype II', 'SIGEMype Business']
  const S = 'si'
  const N = 'no'
  const C = 'Consultar'
  const MATRIZ = [
    ['Para empresas con ventas anuales hasta de', [C, C, C, C]],
    ['Gestión integral de planilla hasta', ['2 trabajadores', '4 trabajadores', '6 trabajadores', '12 trabajadores']],
    ['Registro contable mensual de compras y ventas', [S, S, S, S]],
    ['Cálculo mensual del Impuesto a la Renta', [S, S, S, S]],
    ['Cálculo mensual del IGV', [S, S, S, S]],
    ['Cálculo y declaración mensual de la planilla electrónica', [S, S, S, S]],
    ['Declaración del PDT 621 (IGV y Renta)', [S, S, S, S]],
    ['Registro de Compras y Ventas en formato SUNAT', [S, S, S, S]],
    ['Libro Diario Simplificado mensual', [S, S, S, S]],
    ['Libro Diario y Libro Mayor mensual', [N, S, S, S]],
    ['Libro Bancos mensual', [N, S, S, S]],
    ['Otros libros obligatorios', [N, N, S, S]],
    ['Manejo de Kardex', [N, N, N, S]],
    ['Asesoría tributaria según tu régimen y sector', [S, S, S, S]],
    ['Asesoría tributaria y financiera en tu empresa', [N, N, N, S]],
    ['Elaboración y presentación de la DAOT', [S, S, S, S]],
    ['Impuesto a la Renta anual', [N, N, N, S]],
    ['Estados financieros intermedios', [N, N, N, N]],
    ['Una visita al mes para recoger y enviar documentación', [N, N, S, S]],
    ['Costo por trabajador adicional en planilla', [C, C, C, C]],
    ['Límite de registro de comprobantes de pago', [C, C, C, C]],
    ['Libros electrónicos', [S, S, S, S]],
  ]
  const celdaPublica = (v) => v === S
    ? `<span class="publica-si" role="img" aria-label="Incluido">${icono('check')}</span>`
    : v === N ? '<span class="publica-no" role="img" aria-label="No incluido">—</span>' : escapar(v)
  const textoDeCelda = (v) => (v === S ? 'Incluido' : v === N ? 'No incluido' : `«${v}»`)

  const ICONOS_DE_VALOR = [['pulgar', 'Pulgar arriba'], ['trofeo', 'Trofeo'], ['foco', 'Foco'], ['candado', 'Candado'], ['balanza', 'Balanza'], ['equipo', 'Equipo']]
  const iconoDeValor = (v) => icono(v === 'equipo' ? 'usuarios' : v)
  const VALORES = [['Excelencia', 'pulgar'], ['Compromiso', 'trofeo'], ['Innovación', 'foco'], ['Confidencialidad', 'candado'], ['Equidad', 'balanza'], ['Trabajo en equipo', 'equipo']]

  // Anclas que hoy tienen las secciones del inicio (las de «¿Por qué elegirnos?» y «Clientes» están vacías).
  const ANCLAS = [['quienes-somos', 'Quiénes somos'], ['servicios', 'Nuestros servicios empresariales integrales'], ['planes', 'Nuestros planes'], ['contacto', 'Contáctanos']]
  const NAVEGACION = [
    { etiqueta: 'Inicio', tipo: 'interna', destino: '/' },
    { etiqueta: 'Quiénes somos', tipo: 'seccion', destino: '#quienes-somos' },
    { etiqueta: 'Servicios', tipo: 'seccion', destino: '#servicios' },
    { etiqueta: 'Planes', tipo: 'seccion', destino: '#planes' },
    { etiqueta: 'Blog', tipo: 'interna', destino: '/blog' },
    { etiqueta: 'Contacto', tipo: 'seccion', destino: '#contacto' },
    { etiqueta: 'Guía de clientes', tipo: 'interna', destino: '/guia' },
    { etiqueta: 'SIGEFact', tipo: 'externa', destino: 'https://sigefact.pse.pe/', nueva: true, imagen: 'sigefact.png' },
  ]
  const TIPOS_DE_DESTINO = { seccion: 'Sección del inicio', interna: 'Página del sitio', externa: 'Sitio externo' }

  // ---------------------------------------------------------------- Validaciones de campo (`data-validar`)
  const MONTO = /(s\/\.?|\bpen\b|\$)\s*\d|\d+([.,]\d{2})\s*(soles|pen)/i
  const ANCLA = /^[a-z0-9]+(-[a-z0-9]+)*$/
  const REGLAS = {
    'sin-montos': (v) => (MONTO.test(v) ? 'No se publican montos. Quita el precio; el sitio muestra «Consultar».' : ''),
    celular: (v) => (/^9\d{8}$/.test(v.replace(/\s/g, '')) ? '' : 'Escribe un celular de 9 dígitos que empiece con 9. Los teléfonos fijos no se publican.'),
    https: (v) => (/^https:\/\/[^\s.]+\.[^\s]+$/i.test(v) ? '' : 'Escribe la dirección completa, empezando con https://'),
    ancla: (v) => (ANCLA.test(v) ? '' : 'Usa minúsculas, números y guiones, sin #. Por ejemplo «planes».'),
    slug: (v) => (ANCLA.test(v) ? '' : 'Usa solo minúsculas, números y guiones. Por ejemplo «cierre-del-mes».'),
    correo: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Escribe un correo válido, por ejemplo contabilidad@jjmm.com.pe.'),
    poligono: (v) => {
      const p = v.trim().split(/\s+/)
      return p.length >= 3 && p.every((x) => /^\d+(\.\d+)?,\d+(\.\d+)?$/.test(x)) ? '' : 'Escribe al menos tres puntos «x,y» separados por espacios, por ejemplo «72.8,155.8 174.1,78.7 216.5,191.5».'
    },
    destino: (v, el) => {
      const tipo = el.closest('[data-con-destino]')?.querySelector('[data-tipo-destino]')?.value
      if (tipo === 'seccion') return /^#[a-z0-9]+(-[a-z0-9]+)*$/.test(v) ? '' : 'Una sección se escribe con #, por ejemplo #planes.'
      if (tipo === 'interna') return /^\/[a-z0-9\-/]*$/.test(v) ? '' : 'Una página del sitio empieza con /, por ejemplo /guia.'
      if (tipo === 'externa') return REGLAS.https(v)
      return ''
    },
  }

  const mostrarError = (el, texto) => {
    let error = document.getElementById(el.id + '-error')
    if (!error && texto) {
      error = document.createElement('p')
      error.className = 'error-campo'
      error.id = el.id + '-error'
      error.innerHTML = `${icono('alerta', 'icono-sm')}<span></span>`
      el.insertAdjacentElement('afterend', error)
      el.setAttribute('aria-describedby', [el.getAttribute('aria-describedby'), error.id].filter(Boolean).join(' '))
    }
    if (error) { error.hidden = !texto; error.querySelector('span').textContent = texto }
    el.setAttribute('aria-invalid', String(Boolean(texto)))
    el.setCustomValidity(texto)
  }

  const validarCampo = (el) => {
    const v = el.value.trim()
    const regla = REGLAS[el.dataset.validar]
    mostrarError(el, v && regla ? regla(v, el) : '')
    return !el.validationMessage
  }

  // Valida al salir del campo y, si ya mostró un error, mientras se corrige.
  document.addEventListener('change', (e) => { if (e.target.matches?.('[data-validar]')) validarCampo(e.target) })
  document.addEventListener('input', (e) => {
    const el = e.target
    if (!el.matches?.('[data-validar]')) return
    if (el.getAttribute('aria-invalid') === 'true' || el.dataset.validar === 'sin-montos') validarCampo(el)
  })
  const validarTodo = (raiz) => [...raiz.querySelectorAll('[data-validar]')].map(validarCampo).every(Boolean)

  // ---------------------------------------------------------------- Reflejos en las vistas previas
  // `data-refleja="id"` copia el valor del campo; `data-respaldo` es lo que se ve si está vacío.
  const reflejar = (campo) => {
    document.querySelectorAll(`[data-refleja="${campo.id}"]`).forEach((el) => {
      const v = campo.value.trim() || el.dataset.respaldo || ''
      if (el.hasAttribute('data-corchetes')) el.innerHTML = conCorchetes(v)
      else el.textContent = v
      if (el.hasAttribute('data-ocultar-vacio')) el.hidden = !v
    })
  }
  document.addEventListener('input', (e) => { if (e.target.id) reflejar(e.target) })
  const iniciarReflejos = () => {
    const ids = new Set([...document.querySelectorAll('[data-refleja]')].map((el) => el.dataset.refleja))
    ids.forEach((id) => { const c = document.getElementById(id); if (c) reflejar(c) })
  }

  // ---------------------------------------------------------------- Contador de caracteres
  const iniciarContadores = () => {
    document.querySelectorAll('[data-contar]').forEach((campo) => {
      const salida = document.getElementById(campo.id + '-contador')
      const max = Number(campo.getAttribute('maxlength'))
      const pintar = () => {
        const n = campo.value.length
        salida.textContent = `${n} / ${max}`
        salida.dataset.cerca = String(n > max * 0.9)
      }
      campo.addEventListener('input', pintar)
      pintar()
    })
  }

  // ---------------------------------------------------------------- Filas repetibles (`data-lista-campos`)
  let siguienteFila = 1
  const estadoDeLista = (lista) => {
    const n = lista.children.length
    const min = Number(lista.dataset.minimo || 0)
    const max = Number(lista.dataset.maximo || Infinity)
    lista.querySelectorAll('[data-quitar-fila]').forEach((b) => {
      b.disabled = n <= min
      b.title = n <= min ? `Debe quedar al menos ${min === 1 ? 'una' : min}` : ''
    })
    const agregar = document.querySelector(`[data-agregar="${lista.id}"]`)
    if (agregar) {
      agregar.disabled = n >= max
      agregar.title = n >= max ? `Como máximo ${max}` : ''
    }
    const vacio = document.querySelector(`[data-vacio-de="${lista.id}"]`)
    if (vacio) vacio.hidden = n > 0
    lista.hidden = n === 0
    renumerar(lista)
  }
  const agregarFila = (lista, valores = null) => {
    const plantilla = document.getElementById(lista.id + '-plantilla')
    const html = plantilla.innerHTML.replace(/__n__/g, String(siguienteFila++))
    const caja = document.createElement('template')
    caja.innerHTML = html.trim()
    const li = caja.content.firstElementChild
    pintarIconos(li)
    lista.append(li)
    if (valores) Object.entries(valores).forEach(([clave, v]) => {
      const campo = li.querySelector(`[data-clave="${clave}"]`)
      if (!campo) return
      if (campo.matches('.interruptor')) campo.setAttribute('aria-checked', String(Boolean(v)))
      else campo.value = v ?? ''
    })
    li.querySelectorAll('[data-al-elegir]').forEach((s) => s.dispatchEvent(new Event('change', { bubbles: true })))
    estadoDeLista(lista)
    return li
  }
  const llenarLista = (lista, filas) => {
    lista.innerHTML = ''
    filas.forEach((f) => agregarFila(lista, f))
    estadoDeLista(lista)
  }
  document.addEventListener('click', (e) => {
    const agregar = e.target.closest('[data-agregar]')
    if (agregar) {
      const lista = document.getElementById(agregar.dataset.agregar)
      const li = agregarFila(lista, agregar._valores ? agregar._valores() : null)
      li.querySelector('input, select, textarea')?.focus()
      disparar(lista, 'cambio')
      disparar(lista, 'lista:cambio')
      return
    }
    const quitar = e.target.closest('[data-quitar-fila]')
    if (quitar) {
      const lista = quitar.closest('[data-lista-campos]')
      const li = quitar.closest('li')
      const siguiente = li.nextElementSibling || li.previousElementSibling
      li.remove()
      estadoDeLista(lista)
      ;(siguiente?.querySelector('[data-quitar-fila]:not(:disabled)') || document.querySelector(`[data-agregar="${lista.id}"]`))?.focus()
      anunciar('Fila quitada')
      disparar(lista, 'cambio')
      disparar(lista, 'lista:cambio')
    }
  })

  // ---------------------------------------------------------------- Imágenes: elegir de la biblioteca y subir
  const crearCapa = (id, html) => {
    let capa = document.getElementById(id)
    if (capa) return capa
    capa = document.createElement('div')
    capa.className = 'capa'
    capa.id = id
    capa.hidden = true
    capa.innerHTML = `<div class="capa-fondo"></div>${html}`
    document.body.append(capa)
    return capa
  }

  const USOS = [['todas', 'Todas'], ['inicio', 'Inicio'], ['clientes', 'Clientes'], ['marca', 'Marca'], ['subida', 'Recién subidas']]
  const esLogo = (m) => m.uso === 'clientes' || m.uso === 'marca'

  const elegirImagen = ({ actual = '', uso = 'todas' } = {}) => new Promise((resolver) => {
    const capa = crearCapa('dialogo-elegir-imagen', `
      <section class="dialogo dialogo-ancho" role="dialog" aria-modal="true" aria-labelledby="elegir-titulo" aria-describedby="elegir-ayuda">
        <div class="fila-interruptor" style="justify-content: space-between">
          <div><h2 id="elegir-titulo">Elegir de Imágenes</h2><p class="ayuda" id="elegir-ayuda">Imágenes que ya están en el sitio. Para una nueva, usa «Subir imagen».</p></div>
          <button class="boton boton-fantasma boton-icono" type="button" data-cierra aria-label="Cerrar">${icono('cerrar')}</button>
        </div>
        <div class="segmentado segmentado-sm biblioteca-filtros" role="group" aria-label="Mostrar imágenes de"></div>
        <div class="biblioteca-scroll"><ul class="biblioteca"></ul></div>
        <div class="dialogo-acciones">
          <button class="boton boton-secundario" type="button" data-cierra>Cancelar</button>
          <button class="boton boton-principal" type="button" data-usar>Usar esta imagen</button>
        </div>
      </section>`)
    const filtros = capa.querySelector('.biblioteca-filtros')
    const lista = capa.querySelector('.biblioteca')
    const usar = capa.querySelector('[data-usar]')
    let elegida = actual
    let filtro = uso
    let resultado = null
    const pintar = () => {
      filtros.innerHTML = USOS.filter(([v]) => v !== 'subida' || MEDIOS.some((m) => m.uso === 'subida'))
        .map(([v, t]) => `<button type="button" data-v="${v}" aria-pressed="${v === filtro}">${t}</button>`).join('')
      lista.innerHTML = MEDIOS.filter((m) => filtro === 'todas' || m.uso === filtro).map((m) => `
        <li class="${esLogo(m) ? 'logo' : ''}"><button type="button" data-archivo="${escapar(m.archivo)}" aria-pressed="${m.archivo === elegida}">
          <img src="${m.src}" alt=""><span>${escapar(m.archivo)}</span><span class="oculto-visual">: ${escapar(m.alt)}</span>
        </button></li>`).join('')
      usar.disabled = !elegida || elegida === actual
    }
    filtros.onclick = (e) => {
      const b = e.target.closest('button')
      if (!b) return
      filtro = b.dataset.v
      pintar()
      filtros.querySelector('[aria-pressed=true]').focus()
    }
    lista.onclick = (e) => {
      const b = e.target.closest('button')
      if (!b) return
      elegida = b.dataset.archivo
      lista.querySelectorAll('button').forEach((o) => o.setAttribute('aria-pressed', String(o === b)))
      usar.disabled = elegida === actual
    }
    usar.onclick = () => { resultado = elegida; cerrarCapa(capa) }
    capa.addEventListener('capa:cerrada', () => resolver(resultado), { once: true })
    pintar()
    abrirCapa(capa.id)
  })

  const TIPOS_ADMITIDOS = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif' }
  const subirImagen = (archivo) => new Promise((resolver) => {
    if (!TIPOS_ADMITIDOS[archivo.type]) { avisoBreve('Ese archivo no se puede subir', 'Usa una imagen JPG, PNG, WebP o AVIF.', 'error'); resolver(null); return }
    if (archivo.size > 10 * 1024 * 1024) { avisoBreve('La imagen pesa más de 10 MB', 'Redúcela antes de subirla.', 'error'); resolver(null); return }
    const capa = crearCapa('dialogo-subir-imagen', `
      <form class="dialogo" role="dialog" aria-modal="true" aria-labelledby="subir-titulo" novalidate>
        <h2 id="subir-titulo">Subir imagen</h2>
        <img class="subida-vista" alt="Vista previa de la imagen elegida">
        <div class="campo">
          <label for="subir-alt">Texto alternativo</label>
          <input class="entrada" id="subir-alt" required maxlength="300" data-foco-inicial aria-describedby="subir-alt-ayuda">
          <p class="ayuda" id="subir-alt-ayuda">Describe lo que se ve, para quien no puede ver la imagen. Por ejemplo, «Logotipo de Cadex».</p>
        </div>
        <div class="dialogo-acciones">
          <button class="boton boton-secundario" type="button" data-cierra>Cancelar</button>
          <button class="boton boton-principal" type="submit">Subir y usar</button>
        </div>
      </form>`)
    const form = capa.querySelector('form')
    const alt = form.querySelector('#subir-alt')
    let resultado = null
    const lector = new FileReader()
    lector.onload = () => {
      form.querySelector('.subida-vista').src = lector.result
      alt.value = ''
      abrirCapa(capa.id)
    }
    form.onsubmit = (e) => {
      e.preventDefault()
      if (!form.reportValidity()) return
      const boton = form.querySelector('[type=submit]')
      boton.disabled = true
      boton.innerHTML = '<span class="cargando" aria-hidden="true"></span>Subiendo…'
      setTimeout(() => {
        boton.disabled = false
        boton.textContent = 'Subir y usar'
        const nombre = `${generarSlug(archivo.name.replace(/\.[^.]+$/, '')) || 'imagen'}.${TIPOS_ADMITIDOS[archivo.type]}`
        MEDIOS.unshift({ archivo: nombre, src: lector.result, alt: alt.value.trim(), uso: 'subida' })
        resultado = nombre
        cerrarCapa(capa)
        avisoBreve('Imagen subida', 'Ya está en Imágenes y en este campo.')
      }, 600)
    }
    capa.addEventListener('capa:cerrada', () => resolver(resultado), { once: true })
    lector.readAsDataURL(archivo)
  })

  // Campo de imagen (`SelectorDeImagen` del panel real): miniatura, subir, elegir y, si es opcional, quitar.
  const iniciarSelectorDeImagen = (sel) => {
    if (sel._pintar) return
    const id = sel.dataset.id
    const opcional = sel.hasAttribute('data-opcional')
    if (!sel.id) sel.id = id
    sel.setAttribute('role', 'group')
    sel.setAttribute('aria-labelledby', id + '-etq')
    sel.setAttribute('aria-describedby', id + '-ayuda')
    sel.innerHTML = `
      <span class="etiqueta" id="${id}-etq">${sel.dataset.etiqueta}</span>
      <div class="zona-imagen">
        <span data-miniatura></span>
        <div class="zona-imagen-texto">
          <strong data-nombre></strong>
          <p class="ayuda" id="${id}-ayuda">${sel.dataset.ayuda || 'Arrastra una imagen aquí o elige una.'}</p>
          <div class="zona-imagen-acciones">
            <label class="boton boton-secundario boton-sm" for="${id}-archivo">${icono('subir', 'icono-sm')}Subir imagen</label>
            <input class="oculto-visual" id="${id}-archivo" type="file" accept="image/jpeg,image/png,image/webp,image/avif">
            <button class="boton boton-secundario boton-sm" type="button" data-elegir>${icono('imagen', 'icono-sm')}Elegir de Imágenes</button>
            ${opcional ? `<button class="boton boton-fantasma boton-sm" type="button" data-quitar>${icono('cerrar', 'icono-sm')}Quitar</button>` : ''}
          </div>
        </div>
      </div>`
    const pintar = () => {
      const m = medioPorArchivo(sel.dataset.valor)
      sel.querySelector('[data-miniatura]').innerHTML = m
        ? `<img src="${m.src}" alt="${escapar('Imagen actual: ' + m.alt)}">`
        : `<span class="miniatura-vacia">${icono('imagen', 'icono-lg')}</span>`
      sel.querySelector('[data-nombre]').textContent = m ? m.archivo : opcional ? 'Sin imagen (opcional)' : 'Sin imagen'
      const quitar = sel.querySelector('[data-quitar]')
      if (quitar) quitar.hidden = !m
    }
    const poner = (archivo) => {
      sel.dataset.valor = archivo || ''
      pintar()
      disparar(sel, 'cambio')
      disparar(sel, 'imagen:cambio', medioPorArchivo(archivo))
    }
    sel._pintar = pintar
    sel._fijar = (archivo) => { sel.dataset.valor = archivo || ''; pintar() }
    const archivo = sel.querySelector('input[type=file]')
    const usarArchivo = async (f) => { if (!f) return; const a = await subirImagen(f); if (a) poner(a) }
    archivo.addEventListener('change', () => { usarArchivo(archivo.files[0]); archivo.value = '' })
    sel.querySelector('[data-elegir]').addEventListener('click', async () => {
      const a = await elegirImagen({ actual: sel.dataset.valor, uso: sel.dataset.uso || 'todas' })
      if (a) poner(a)
    })
    sel.querySelector('[data-quitar]')?.addEventListener('click', () => {
      poner('')
      sel.querySelector('[data-elegir]').focus()
      anunciar('Imagen quitada')
    })
    const zona = sel.querySelector('.zona-imagen')
    ;['dragenter', 'dragover'].forEach((t) => zona.addEventListener(t, (e) => { e.preventDefault(); zona.dataset.arrastrando = 'true' }))
    ;['dragleave', 'drop'].forEach((t) => zona.addEventListener(t, () => { zona.dataset.arrastrando = 'false' }))
    zona.addEventListener('drop', (e) => { e.preventDefault(); usarArchivo(e.dataTransfer.files[0]) })
    if (sel.dataset.valor === undefined) sel.dataset.valor = ''
    pintar()
  }

  // ---------------------------------------------------------------- Editor de texto enriquecido
  // Simulación con `contenteditable`: en el panel real es el editor Lexical de Payload con las
  // mismas funciones (párrafo, títulos, negrita, cursiva, enlace, listas, cita, imagen).
  const elementoDe = (n) => n && (n.nodeType === 1 ? n : n.parentElement)
  const pedirEnlace = () => new Promise((resolver) => {
    const capa = crearCapa('dialogo-enlace', `
      <form class="dialogo" role="dialog" aria-modal="true" aria-labelledby="enlace-titulo" novalidate>
        <h2 id="enlace-titulo">Agregar enlace</h2>
        <div class="campo">
          <label for="enlace-url">Dirección</label>
          <input class="entrada" id="enlace-url" required data-foco-inicial aria-describedby="enlace-ayuda" placeholder="https://www.sunat.gob.pe/">
          <p class="ayuda" id="enlace-ayuda">Una página de otro sitio (https://…) o de este sitio (/guia).</p>
        </div>
        <div class="dialogo-acciones">
          <button class="boton boton-secundario" type="button" data-cierra>Cancelar</button>
          <button class="boton boton-principal" type="submit">Agregar enlace</button>
        </div>
      </form>`)
    const form = capa.querySelector('form')
    const url = form.querySelector('#enlace-url')
    url.value = ''
    mostrarError(url, '')
    let resultado = null
    form.onsubmit = (e) => {
      e.preventDefault()
      const v = url.value.trim()
      const mal = !v ? 'Escribe la dirección del enlace.' : /^\/[^\s]*$/.test(v) ? '' : REGLAS.https(v)
      mostrarError(url, mal)
      if (mal) { url.focus(); return }
      resultado = v
      cerrarCapa(capa)
    }
    capa.addEventListener('capa:cerrada', () => resolver(resultado), { once: true })
    abrirCapa(capa.id)
  })

  const iniciarEditorDeTexto = (raiz) => {
    const area = raiz.querySelector('.area-editable')
    const barra = raiz.querySelector('.barra-formato')
    const bloque = barra.querySelector('[data-bloque]')
    let rango = null
    const guardarRango = () => {
      const s = getSelection()
      if (s.rangeCount && area.contains(s.anchorNode)) rango = s.getRangeAt(0).cloneRange()
    }
    const restaurar = () => {
      area.focus()
      if (!rango) return
      const s = getSelection()
      s.removeAllRanges()
      s.addRange(rango)
    }
    const estado = () => {
      const s = getSelection()
      if (!s.rangeCount || !area.contains(s.anchorNode)) return
      guardarRango()
      const nodo = elementoDe(s.anchorNode)
      barra.querySelectorAll('[data-formato][aria-pressed]').forEach((b) => {
        const f = b.dataset.formato
        let activo = false
        if (f === 'blockquote') activo = Boolean(nodo.closest('blockquote'))
        else if (f === 'createLink') activo = Boolean(nodo.closest('a'))
        else { try { activo = document.queryCommandState(f) } catch (e) { activo = false } }
        b.setAttribute('aria-pressed', String(activo))
      })
      if (bloque) {
        const h = nodo.closest('h2, h3')
        bloque.value = h && area.contains(h) ? h.tagName.toLowerCase() : 'p'
      }
    }
    document.addEventListener('selectionchange', estado)
    area.addEventListener('input', () => { area.dataset.valor = area.innerHTML })
    barra.addEventListener('mousedown', (e) => { if (e.target.closest('button')) e.preventDefault() })
    barra.addEventListener('click', async (e) => {
      const b = e.target.closest('button[data-formato]')
      if (!b) return
      const f = b.dataset.formato
      if (f === 'createLink') {
        if (!rango || rango.collapsed) { avisoBreve('Primero selecciona el texto del enlace', 'Después pulsa «Enlace».', 'info'); return }
        const guardado = rango
        const url = await pedirEnlace()
        if (!url) return
        rango = guardado
        restaurar()
        document.execCommand('createLink', false, url)
      } else if (f === 'insertImage') {
        const guardado = rango
        const a = await elegirImagen()
        if (!a) return
        const m = medioPorArchivo(a)
        rango = guardado
        restaurar()
        document.execCommand('insertHTML', false, `<figure><img src="${m.src}" alt="${escapar(m.alt)}"></figure><p><br></p>`)
      } else if (f === 'blockquote') {
        restaurar()
        const dentro = elementoDe(getSelection().anchorNode)?.closest('blockquote')
        document.execCommand('formatBlock', false, dentro ? 'p' : 'blockquote')
      } else {
        restaurar()
        document.execCommand(f)
      }
      estado()
    })
    bloque?.addEventListener('change', () => { restaurar(); document.execCommand('formatBlock', false, bloque.value); estado() })
    area.dataset.valor = area.innerHTML
  }

  // ---------------------------------------------------------------- Panel lateral con aviso al cerrar con cambios
  const protegerHoja = (capa) => {
    const form = capa.querySelector('form')
    let base = null
    capa.addEventListener('capa:abierta', () => { base = fotografia(form) })
    capa._antesDeCerrar = async () => {
      if (base === null || fotografia(form) === base) return true
      return confirmar({ titulo: '¿Cerrar sin guardar?', texto: 'Se pierden los cambios que hiciste en este panel.', accion: 'Cerrar sin guardar' })
    }
    // Llamar antes de cerrar tras guardar, para que no pregunte.
    return () => { base = fotografia(form) }
  }

  // Paneles de «Textos de la página» (globales sin listas): guardar, avisar y cerrar.
  const iniciarHojasDeGuardado = () => {
    document.querySelectorAll('form.hoja[data-hoja-guardar]').forEach((form) => {
      const capa = form.closest('.capa')
      const guardada = protegerHoja(capa)
      form.addEventListener('submit', (e) => {
        e.preventDefault()
        if (!validarTodo(form) || !form.reportValidity()) return
        const boton = form.querySelector('[type=submit]')
        const texto = boton.innerHTML
        boton.disabled = true
        boton.innerHTML = '<span class="cargando" aria-hidden="true"></span>Guardando…'
        setTimeout(() => {
          boton.disabled = false
          boton.innerHTML = texto
          guardada()
          cerrarCapa(capa)
          avisoBreve('Cambios guardados', form.dataset.hojaGuardar)
        }, 600)
      })
    })
  }

  // Interruptor dentro de un formulario: su texto de estado acompaña al valor.
  const valorDeInterruptor = (sw) => sw.getAttribute('aria-checked') === 'true'

  // ---------------------------------------------------------------- Áreas de servicio
  const filaOrdenable = (nombre) => `
    <td class="estrecha ocultar-movil"><div class="orden-botones"><span class="asa" title="Arrastra para cambiar el orden">${icono('asa', 'icono-sm')}</span><span class="posicion"></span></div></td>`
  const botonesDeOrden = (nombre) => `
    <button class="boton boton-fantasma boton-icono boton-sm" type="button" data-mover="-1" aria-label="Subir ${escapar(nombre)}">${icono('arriba', 'icono-sm')}</button>
    <button class="boton boton-fantasma boton-icono boton-sm" type="button" data-mover="1" aria-label="Bajar ${escapar(nombre)}">${icono('abajo', 'icono-sm')}</button>`

  PANTALLAS.areas = () => {
    document.querySelector('#tabla-areas tbody').innerHTML = AREAS.map((a) => `
      <tr data-nombre="${escapar(a.nombre)}" data-id="${a.codigo}">
        ${filaOrdenable(a.nombre)}
        <td class="principal-movil"><div class="celda-principal">
          <span class="codigo-area" aria-hidden="true">${a.codigo}</span>
          <div class="celda-principal-texto"><a class="enlace-fila" href="area-editar.html?codigo=${a.codigo}"><span class="oculto-visual">${a.codigo}, </span>${escapar(a.nombre)}</a><span>Pestaña «${escapar(a.corto)}» · ${a.puntos.length} puntos en «Qué incluye»</span></div>
        </div></td>
        <td class="debajo-movil">${a.poligono ? '<span class="insignia" data-estado="listo">Marcada en la rueda</span>' : '<span class="insignia" data-estado="pendiente">Solo en las pestañas</span>'}</td>
        <td class="derecha debajo-movil"><div class="orden-botones">${botonesDeOrden(a.nombre)}
          <a class="boton boton-secundario boton-sm" href="area-editar.html?codigo=${a.codigo}" aria-label="Editar ${escapar(a.nombre)}">Editar</a>
        </div></td>
      </tr>`).join('')
  }

  PANTALLAS.area = () => {
    const codigo = (parametro('codigo') || 'P1').toUpperCase()
    const area = AREAS.find((a) => a.codigo === codigo) || AREAS[0]
    const $ = (s) => document.querySelector(s)
    document.title = `${area.nombre} · Áreas de servicio · Panel JJMM`
    cambiarMiga(area.nombre)
    $('#area-codigo').textContent = area.codigo
    $('#area-nombre').value = area.nombre
    $('#area-corto').value = area.corto
    $('#area-descripcion').value = area.descripcion
    $('#area-mensaje').value = area.mensaje
    $('#area-poligono').value = area.poligono
    llenarLista($('#lista-puntos'), area.puntos.map((texto) => ({ texto })))
    const eliminar = $('[data-eliminar]')
    eliminar.dataset.titulo = `¿Eliminar el área ${area.codigo}, ${area.nombre}?`
    eliminar.dataset.texto = `Deja de verse en la rueda y en las pestañas de «Nuestros servicios», y se borran sus ${area.puntos.length} puntos. No se puede deshacer.`

    const svg = $('#vista-rueda')
    svg.innerHTML = '<image href="img/rueda-sige-mype.webp" width="500" height="550"/>' +
      AREAS.map((a) => `<polygon points="${a.poligono}" data-codigo="${a.codigo}"${a.codigo === area.codigo ? ' data-actual="true"' : ''}/>`).join('')
    const pintar = () => {
      const nombre = $('#area-nombre').value.trim() || 'Sin nombre'
      const corto = $('#area-corto').value.trim() || '…'
      $('[data-titulo-area]').textContent = nombre
      $('#vista-pestanas').innerHTML = AREAS.map((a) => a.codigo === area.codigo
        ? `<span class="activa"><b>${a.codigo}</b>${escapar(corto)}</span>`
        : `<span><b>${a.codigo}</b>${escapar(a.corto)}</span>`).join('')
      $('#vista-nombre').textContent = nombre
      $('#vista-descripcion').textContent = $('#area-descripcion').value.trim()
      const puntos = [...$('#lista-puntos').querySelectorAll('input')].map((i) => i.value.trim()).filter(Boolean)
      $('#vista-puntos').innerHTML = puntos.map((p) => `<li>${icono('check')}<span>${escapar(p)}</span></li>`).join('')
      $('#vista-mensaje').textContent = $('#area-mensaje').value.trim() || 'Hola, quiero información sobre sus servicios contables.'
      const poligono = $('#area-poligono')
      const actual = svg.querySelector(`[data-codigo="${area.codigo}"]`)
      const valido = poligono.value.trim() && !REGLAS.poligono(poligono.value)
      if (valido) actual.setAttribute('points', poligono.value.trim())
      actual.dataset.actual = String(Boolean(valido))
      $('#vista-sin-gajo').hidden = Boolean(poligono.value.trim())
      $('#estado-gajo').innerHTML = poligono.value.trim()
        ? '<span class="insignia" data-estado="listo">Marcada en la rueda</span>'
        : '<span class="insignia" data-estado="pendiente">Solo en las pestañas</span>'
    }
    const form = $('form[data-edicion]')
    form.addEventListener('input', pintar)
    form.addEventListener('cambio', () => setTimeout(pintar))
    pintar()
  }

  // ---------------------------------------------------------------- Filas de la tabla de planes
  PANTALLAS.caracteristicas = () => {
    const lista = document.querySelector('#lista-filas')
    const form = document.querySelector('form[data-edicion]')
    const resumen = (celdas) => {
      const incluidas = celdas.filter((c) => c === S).length
      const textos = celdas.filter((c) => c !== S && c !== N).length
      if (textos) return `Con texto en ${textos} de ${PLANES.length} planes`
      if (incluidas === PLANES.length) return `Incluida en los ${PLANES.length} planes`
      if (!incluidas) return 'No incluida en ningún plan'
      return `Incluida en ${incluidas} de ${PLANES.length} planes`
    }
    const fila = (id, nombre, celdas, nueva = false) => {
      const li = document.createElement('li')
      li.dataset.id = id
      li._celdas = celdas
      li.innerHTML = `
        <span class="asa" title="Arrastra para cambiar el orden">${icono('asa', 'icono-sm')}</span>
        <span class="posicion"></span>
        <div class="campo" style="flex: 1; min-width: 0">
          <label class="oculto-visual" for="fila-${id}">Nombre de la fila</label>
          <input class="entrada" id="fila-${id}" value="${escapar(nombre)}" required aria-describedby="fila-${id}-resumen" data-nombre-fila>
          <span class="ayuda" id="fila-${id}-resumen">${nueva ? `Nueva: en los ${PLANES.length} planes empieza como «No incluido». Márcala en cada plan.` : resumen(celdas)}</span>
        </div>
        <div class="ordenable-acciones">
          ${botonesDeOrden('la fila')}
          <button class="boton boton-fantasma boton-icono boton-sm" type="button" data-quitar-caracteristica aria-label="Eliminar la fila">${icono('basura', 'icono-sm')}</button>
        </div>`
      return li
    }
    MATRIZ.forEach(([nombre, celdas], i) => lista.append(fila('f' + i, nombre, celdas)))

    const nombreDe = (li) => li.querySelector('input').value.trim()
    const validarNombres = () => {
      const vistos = new Map()
      ;[...lista.children].forEach((li) => {
        const input = li.querySelector('input')
        const clave = normalizar(nombreDe(li))
        let error = MONTO.test(input.value) ? 'No se publican montos en la tabla. Usa «Consultar».' : ''
        if (!error && clave && vistos.has(clave)) error = `Ya hay una fila con ese nombre (posición ${vistos.get(clave)}).`
        if (clave && !vistos.has(clave)) vistos.set(clave, [...lista.children].indexOf(li) + 1)
        mostrarError(input, error)
      })
    }
    const pintarVista = () => {
      document.querySelector('#vista-filas').innerHTML = [...lista.children].map((li) =>
        `<tr><td>${escapar(nombreDe(li) || '…')}</td>${li._celdas.map((c, i) => `<td${i === 2 ? ' class="resaltada"' : ''}>${celdaPublica(c)}</td>`).join('')}</tr>`).join('')
      document.querySelector('#total-filas').textContent = `${lista.children.length} filas`
      lista.querySelectorAll('li').forEach((li) => {
        const n = nombreDe(li) || 'sin nombre'
        li.querySelector('[data-mover="-1"]').setAttribute('aria-label', `Subir «${n}»`)
        li.querySelector('[data-mover="1"]').setAttribute('aria-label', `Bajar «${n}»`)
        li.querySelector('[data-quitar-caracteristica]').setAttribute('aria-label', `Eliminar la fila «${n}»`)
        li.dataset.nombre = n
      })
    }
    form.addEventListener('input', () => { validarNombres(); pintarVista() })
    form.addEventListener('cambio', () => setTimeout(pintarVista))
    lista.addEventListener('click', async (e) => {
      const b = e.target.closest('[data-quitar-caracteristica]')
      if (!b) return
      const li = b.closest('li')
      const nombre = nombreDe(li) || 'sin nombre'
      const celdas = PLANES.map((p, i) => `${p}: ${textoDeCelda(li._celdas[i])}`).join(' · ')
      const ok = await confirmar({
        titulo: `¿Eliminar la fila «${nombre}»?`,
        texto: `Se quita de la tabla y se borran sus ${PLANES.length} celdas (${celdas}). Si solo un plan no la incluye, márcala «No incluido» en ese plan. Se aplica al guardar.`,
        accion: 'Eliminar fila',
      })
      if (!ok) return
      const vecina = li.nextElementSibling || li.previousElementSibling
      li.remove()
      renumerar(lista)
      validarNombres()
      pintarVista()
      disparar(lista, 'cambio')
      ;(vecina?.querySelector('[data-quitar-caracteristica]') || document.querySelector('#agregar-fila')).focus()
      anunciar(`Fila «${nombre}» quitada. Guarda para aplicar.`)
    })
    document.querySelector('#agregar-fila').addEventListener('click', () => {
      const li = fila('n' + Date.now(), '', PLANES.map(() => N), true)
      pintarIconos(li)
      lista.append(li)
      renumerar(lista)
      iniciarArrastre(lista)
      pintarVista()
      disparar(lista, 'cambio')
      li.querySelector('input').focus()
    })
    pintarVista()
  }

  // ---------------------------------------------------------------- Clientes
  PANTALLAS.clientes = () => {
    const esAdmin = leer('rol') !== 'editor'
    const cuerpo = document.querySelector('#tabla-clientes tbody')
    const hoja = document.querySelector('#hoja-cliente')
    const guardada = protegerHoja(hoja)
    const logo = hoja.querySelector('[data-selector-imagen]')
    const visible = hoja.querySelector('#cliente-visible')
    let actual = null
    const htmlFila = (c) => {
      const pendiente = POR_CONFIRMAR.test(c.nombre)
      const m = medioPorArchivo(c.logo)
      return `
        ${filaOrdenable(c.nombre)}
        <td class="principal-movil"><div class="celda-principal">
          <img class="miniatura miniatura-logo" src="${m ? m.src : ''}" alt="">
          <div class="celda-principal-texto"><button class="enlace-fila" type="button" data-editar-cliente>${escapar(c.nombre)}</button><span>${c.enlace ? escapar(c.enlace) : 'Sin sitio web'}${pendiente ? ' · <span class="insignia" data-estado="pendiente">Nombre por confirmar</span>' : ''}</span></div>
        </div></td>
        <td class="debajo-movil"><span class="insignia" data-estado="${c.visible ? 'listo' : ''}" data-insignia-visible data-no="Oculto">${c.visible ? 'Visible' : 'Oculto'}</span></td>
        <td class="lado-movil"><button class="interruptor" type="button" role="switch" aria-checked="${c.visible}" aria-label="${escapar(c.nombre)} visible en el sitio" data-rapido data-nombre="El logotipo de ${escapar(c.nombre)}"></button></td>
        <td class="derecha debajo-movil"><div class="orden-botones">${botonesDeOrden(c.nombre)}
          <button class="boton boton-secundario boton-sm" type="button" data-editar-cliente aria-label="Editar ${escapar(c.nombre)}">Editar</button>
        </div></td>`
    }
    const pintarFila = (tr) => {
      tr.innerHTML = htmlFila(tr._cliente)
      tr.dataset.nombre = tr._cliente.nombre
      tr.dataset.estado = tr._cliente.visible ? 'visible' : 'oculta'
    }
    const filaNueva = (c, id) => {
      const tr = document.createElement('tr')
      tr.dataset.fila = ''
      tr.dataset.id = id
      tr._cliente = c
      pintarFila(tr)
      return tr
    }
    NOMBRES_DE_CLIENTES.forEach((nombre, i) => cuerpo.append(filaNueva({ nombre, logo: `client-logo${i + 1}.png`, enlace: '', visible: true }, 'c' + i)))
    const avisar = () => {
      const filas = [...cuerpo.querySelectorAll('tr[data-id]')]
      const pendientes = filas.map((tr, i) => (POR_CONFIRMAR.test(tr._cliente.nombre) ? i + 1 : 0)).filter(Boolean)
      const nota = document.querySelector('#nota-por-confirmar')
      nota.hidden = !pendientes.length
      const posiciones = pendientes.length > 1 ? pendientes.slice(0, -1).join(', ') + ' y ' + pendientes.slice(-1) : pendientes[0]
      nota.querySelector('[data-texto]').textContent = pendientes.length === 1
        ? `Un logotipo no tiene nombre confirmado (posición ${posiciones}).`
        : `${pendientes.length} logotipos no tienen nombre confirmado (posiciones ${posiciones}).`
    }
    // El interruptor rápido actualiza el dato de la fila.
    cuerpo.addEventListener('cambio', (e) => {
      const tr = e.target.closest('tr[data-id]')
      if (tr && e.target.matches('.interruptor')) tr._cliente.visible = valorDeInterruptor(e.target)
    })
    cuerpo.addEventListener('cambio', () => setTimeout(avisar))
    const abrir = (tr, disparador) => {
      actual = tr
      const c = tr ? tr._cliente : { nombre: '', logo: '', enlace: '', visible: false }
      hoja.querySelector('#cliente-hoja-titulo').textContent = tr ? 'Editar cliente' : 'Nuevo cliente'
      hoja.querySelector('#cliente-nombre').value = c.nombre
      hoja.querySelector('#cliente-enlace').value = c.enlace
      mostrarError(hoja.querySelector('#cliente-enlace'), '')
      logo._fijar(c.logo)
      hoja.querySelector('#error-logo').hidden = true
      visible.setAttribute('aria-checked', String(c.visible))
      hoja.querySelector('#cliente-pendiente').hidden = !POR_CONFIRMAR.test(c.nombre)
      hoja.querySelector('#cliente-nuevo-nota').hidden = Boolean(tr)
      hoja.querySelector('#eliminar-cliente').hidden = !tr || !esAdmin
      abrirCapa('hoja-cliente', disparador)
    }
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-editar-cliente]')
      if (b) abrir(b.closest('tr'), b)
      if (e.target.closest('#nuevo-cliente')) abrir(null, e.target.closest('#nuevo-cliente'))
    })
    hoja.querySelector('#cliente-nombre').addEventListener('input', (e) => {
      hoja.querySelector('#cliente-pendiente').hidden = !POR_CONFIRMAR.test(e.target.value)
    })
    hoja.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault()
      const sinLogo = !logo.dataset.valor
      hoja.querySelector('#error-logo').hidden = !sinLogo
      if (!validarTodo(e.target) || !e.target.reportValidity()) return
      if (sinLogo) { logo.querySelector('[data-elegir]').focus(); return }
      const datos = {
        nombre: hoja.querySelector('#cliente-nombre').value.trim(),
        logo: logo.dataset.valor,
        enlace: hoja.querySelector('#cliente-enlace').value.trim(),
        visible: valorDeInterruptor(visible),
      }
      const editado = actual
      const tr = actual || filaNueva(datos, 'c' + Date.now())
      if (actual) { actual._cliente = datos; pintarFila(actual) } else cuerpo.append(tr)
      iniciarArrastre(cuerpo)
      guardada()
      cerrarCapa(hoja)
      // La fila se volvió a dibujar: el foco vuelve a su botón «Editar».
      tr.querySelector('.orden-botones [data-editar-cliente]')?.focus()
      actual = editado
      cuerpo.closest('[data-listado]').dispatchEvent(new CustomEvent('listado:cambio'))
      avisar()
      avisoBreve(actual ? 'Cliente guardado' : 'Cliente creado', datos.visible ? 'El carrusel «Nuestros clientes» ya lo muestra.' : 'Quedó oculto y al final. Actívalo cuando quieras mostrarlo.')
    })
    hoja.querySelector('#eliminar-cliente').addEventListener('click', async () => {
      const nombre = actual._cliente.nombre
      const ok = await confirmar({ titulo: `¿Eliminar a ${nombre}?`, texto: 'Su logotipo deja de verse en «Nuestros clientes». La imagen sigue en Imágenes. Si solo quieres dejar de mostrarlo, apaga «Visible en el sitio».', accion: 'Eliminar cliente' })
      if (!ok) return
      actual.remove()
      guardada()
      cerrarCapa(hoja)
      cuerpo.closest('[data-listado]').dispatchEvent(new CustomEvent('listado:cambio'))
      renumerar(cuerpo)
      avisar()
      avisoBreve('Cliente eliminado')
    })
    avisar()
  }

  // ---------------------------------------------------------------- Valores («¿Por qué elegirnos?»)
  PANTALLAS.valores = () => {
    const esAdmin = leer('rol') !== 'editor'
    const cuerpo = document.querySelector('#tabla-valores tbody')
    const hoja = document.querySelector('#hoja-valor')
    const guardada = protegerHoja(hoja)
    let actual = null
    const nombreDeIcono = (v) => ICONOS_DE_VALOR.find(([k]) => k === v)?.[1] || v
    const pintarFila = (tr) => {
      const [nombre, ic] = tr._valor
      tr.dataset.nombre = nombre
      tr.innerHTML = `
        ${filaOrdenable(nombre)}
        <td class="principal-movil"><div class="celda-principal">
          <span class="icono-caja icono-caja-marca" aria-hidden="true">${iconoDeValor(ic)}</span>
          <div class="celda-principal-texto"><button class="enlace-fila" type="button" data-editar-valor>${escapar(nombre)}</button><span>Ícono: ${nombreDeIcono(ic)}</span></div>
        </div></td>
        <td class="derecha debajo-movil"><div class="orden-botones">${botonesDeOrden(nombre)}
          <button class="boton boton-secundario boton-sm" type="button" data-editar-valor aria-label="Editar ${escapar(nombre)}">Editar</button>
        </div></td>`
    }
    const filaNueva = (v, id) => {
      const tr = document.createElement('tr')
      tr.dataset.id = id
      tr._valor = v
      pintarFila(tr)
      return tr
    }
    VALORES.forEach((v, i) => cuerpo.append(filaNueva([...v], 'v' + i)))
    const pintarVista = () => {
      document.querySelector('#vista-valores').innerHTML = [...cuerpo.children].map((tr) =>
        `<li>${iconoDeValor(tr._valor[1])}<span>${escapar(tr._valor[0])}</span></li>`).join('')
      document.querySelector('#total-valores').textContent = `${cuerpo.children.length} valores`
    }
    cuerpo.addEventListener('cambio', () => setTimeout(pintarVista))
    hoja.querySelector('#opciones-icono').innerHTML = ICONOS_DE_VALOR.map(([v, t]) => `
      <div class="opcion-visual"><input type="radio" name="valor-icono" id="icono-${v}" value="${v}" required><label for="icono-${v}">${iconoDeValor(v)}${t}</label></div>`).join('')
    const abrir = (tr, disparador) => {
      actual = tr
      const [nombre, ic] = tr ? tr._valor : ['', '']
      hoja.querySelector('#valor-hoja-titulo').textContent = tr ? 'Editar valor' : 'Nuevo valor'
      hoja.querySelector('#valor-nombre').value = nombre
      hoja.querySelectorAll('[name=valor-icono]').forEach((r) => { r.checked = r.value === ic })
      hoja.querySelector('#eliminar-valor').hidden = !tr || !esAdmin
      hoja.querySelector('#valor-nuevo-nota').hidden = Boolean(tr)
      abrirCapa('hoja-valor', disparador)
    }
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-editar-valor]')
      if (b) abrir(b.closest('tr'), b)
      if (e.target.closest('#nuevo-valor')) abrir(null, e.target.closest('#nuevo-valor'))
    })
    hoja.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault()
      if (!e.target.reportValidity()) return
      const v = [hoja.querySelector('#valor-nombre').value.trim(), hoja.querySelector('[name=valor-icono]:checked').value]
      const tr = actual || filaNueva(v, 'v' + Date.now())
      if (actual) { actual._valor = v; pintarFila(actual) } else cuerpo.append(tr)
      iniciarArrastre(cuerpo)
      renumerar(cuerpo)
      guardada()
      cerrarCapa(hoja)
      tr.querySelector('.orden-botones [data-editar-valor]')?.focus()
      pintarVista()
      avisoBreve(actual ? 'Valor guardado' : 'Valor creado', actual ? '«¿Por qué elegirnos?» ya lo muestra.' : 'Se agregó al final de la sección.')
    })
    hoja.querySelector('#eliminar-valor').addEventListener('click', async () => {
      const ok = await confirmar({ titulo: `¿Eliminar «${actual._valor[0]}»?`, texto: 'Deja de verse en «¿Por qué elegirnos?». No se puede deshacer.', accion: 'Eliminar valor' })
      if (!ok) return
      actual.remove()
      guardada()
      cerrarCapa(hoja)
      renumerar(cuerpo)
      pintarVista()
      avisoBreve('Valor eliminado')
    })
    pintarVista()
  }

  // ---------------------------------------------------------------- Secciones del inicio
  const enlacesDelMenu = (ancla) => NAVEGACION.filter((i) => i.tipo === 'seccion' && i.destino === '#' + ancla).map((i) => i.etiqueta)
  const iniciarAncla = () => {
    const campo = document.querySelector('#seccion-ancla')
    if (!campo) return
    const original = campo.value.trim()
    const info = document.querySelector('#ancla-info')
    const pintar = () => {
      const v = campo.value.trim()
      const antes = enlacesDelMenu(original)
      const ahora = enlacesDelMenu(v)
      let html = ''
      let pendiente = false
      if (original && v !== original && antes.length) {
        pendiente = true
        html = `El ítem «${antes.join('», «')}» del menú lleva a #${original}. Si guardas este cambio, actualízalo en <a href="menu-del-sitio.html">Menú del sitio</a> o el enlace dejará de funcionar.`
      } else if (!v) html = 'Sin ancla: ningún enlace del menú puede llevar directo a esta sección.'
      else if (ahora.length) html = `El ítem «${ahora.join('», «')}» del menú lleva aquí (#${escapar(v)}).`
      else html = `Ningún ítem del menú lleva a #${escapar(v)}. Puedes agregar uno en <a href="menu-del-sitio.html">Menú del sitio</a>.`
      info.className = 'nota' + (pendiente ? ' nota-pendiente' : '')
      info.innerHTML = `${icono(pendiente ? 'alerta' : 'info')}<p>${html}</p>`
    }
    campo.addEventListener('input', pintar)
    pintar()
  }

  PANTALLAS.seccion = () => {
    iniciarAncla()
    const tipo = document.body.dataset.seccion
    const form = document.querySelector('form[data-edicion]')
    const alCambiar = (fn) => { form.addEventListener('input', fn); form.addEventListener('cambio', () => setTimeout(fn)); fn() }
    if (tipo === 'quienes-somos') {
      llenarLista(document.querySelector('#lista-cifras'), [
        { prefijo: 'Más de', valor: 100, sufijo: '', descripcion: 'clientes de outsourcing de una amplia variedad de sectores' },
        { prefijo: 'Más de', valor: 100, sufijo: '', descripcion: 'requerimientos de SUNAT atendidos satisfactoriamente' },
        { prefijo: 'Más de', valor: 10, sufijo: 'años', descripcion: 'de experiencia profesional brindando soluciones integrales' },
        { prefijo: 'Más de', valor: 20, sufijo: '', descripcion: 'empresas constituidas' },
      ])
      alCambiar(() => {
        document.querySelector('#vista-cifras').innerHTML = [...document.querySelectorAll('#lista-cifras > li')].map((li) => {
          const v = (k) => escapar(li.querySelector(`[data-clave="${k}"]`).value.trim())
          return `<li><span>${v('prefijo')}</span><b>${v('valor') || '0'}${v('sufijo') ? ' ' + v('sufijo') : ''}</b><span>${v('descripcion')}</span></li>`
        }).join('')
        const area = document.querySelector('#presentacion')
        document.querySelector('#vista-presentacion').innerHTML = [...area.querySelectorAll('p, div')].map((p) => `<p class="publica-parrafo">${p.innerHTML}</p>`).join('') || `<p class="publica-parrafo">${area.innerHTML}</p>`
      })
    }
    if (tipo === 'servicios') {
      const vista = document.querySelector('#vista-rueda-img')
      form.addEventListener('imagen:cambio', (e) => {
        vista.src = e.detail ? e.detail.src : ''
        vista.hidden = !e.detail
      })
      document.querySelector('#vista-areas').innerHTML = AREAS.map((a, i) => `<span${i === 0 ? ' class="activa"' : ''}><b>${a.codigo}</b>${escapar(a.corto)}</span>`).join('')
    }
    if (tipo === 'planes') {
      document.querySelector('#vista-tabla-planes').innerHTML = MATRIZ.slice(0, 5).map(([n, celdas]) =>
        `<tr><td>${escapar(n)}</td>${celdas.map((c, i) => `<td${i === 2 ? ' class="resaltada"' : ''}>${celdaPublica(c)}</td>`).join('')}</tr>`).join('') +
        `<tr><td colspan="5" style="text-align:center">… y ${MATRIZ.length - 5} filas más</td></tr>`
    }
    if (tipo === 'por-que-elegirnos') {
      document.querySelector('#vista-valores').innerHTML = VALORES.map(([n, ic]) => `<li>${iconoDeValor(ic)}<span>${escapar(n)}</span></li>`).join('')
    }
    if (tipo === 'clientes') {
      document.querySelector('#vista-logos').innerHTML = NOMBRES_DE_CLIENTES.slice(0, 8).map((n, i) => `<li><img src="img/clientes/client-logo${i + 1}.png" alt="${escapar(n)}"></li>`).join('')
    }
    if (tipo === 'contacto') {
      llenarLista(document.querySelector('#lista-opciones'), ['Outsourcing contable (planes)', 'Asesoría tributaria', 'Planilla y asesoría laboral', 'Asesoría legal', 'Constitución de empresa', 'Otro servicio'].map((texto) => ({ texto })))
      alCambiar(() => {
        const opciones = [...document.querySelectorAll('#lista-opciones input')].map((i) => i.value.trim()).filter(Boolean)
        document.querySelector('#vista-opciones').textContent = opciones.length ? `${opciones.length} opciones: ${opciones.join(', ')}` : 'Sin opciones'
      })
      const mapa = document.querySelector('#vista-mapa')
      form.addEventListener('imagen:cambio', (e) => {
        mapa.style.backgroundImage = e.detail ? `linear-gradient(rgb(15 51 84 / 0.55), rgb(15 51 84 / 0.55)), url('${e.detail.src}')` : 'none'
        mapa.style.backgroundColor = '#0f3354'
      })
    }
  }

  // ---------------------------------------------------------------- Portadas 2 a 4 (y la 1 con todos sus campos)
  const ASESORIA = 'Hola, quiero una asesoría gratuita para mi empresa.'
  const PORTADAS = [
    { imagen: 'hero-plan.webp', decorativa: true, encuadre: 22, disposicion: 'texto-derecha', transicion: 'fundido', titulo: 'Contamos con [Sistema de Calidad] Genuino', subtitulo: 'Cada empresa guiada por nuestro sistema, llega a ser líder.', botones: [{ etiqueta: 'Asesoría gratuita', tipo: 'whatsapp', mensaje: ASESORIA, estilo: 'principal' }, { etiqueta: 'Ver nuestros planes', tipo: 'seccion', destino: '#planes', estilo: 'secundario' }] },
    { imagen: 'banner-sige-mype.webp', decorativa: false, movil: 'hero-sige-movil.webp', disposicion: 'imagen-completa', transicion: 'izquierda', botones: [{ etiqueta: 'Pide tu asesoría gratuita', tipo: 'whatsapp', mensaje: ASESORIA, estilo: 'principal' }] },
    { imagen: 'hero-taza.webp', decorativa: true, encuadre: 38, disposicion: 'texto-derecha', transicion: 'bajar', sello: 'sige-312.png', titulo: 'Nuestro [plan de trabajo]', lista: ['Diagnóstico de tu empresa', 'Diagrama de flujo integral', 'Asesoramiento en tecnología', 'Outsourcing empresarial'], botones: [{ etiqueta: 'Pide tu diagnóstico', tipo: 'whatsapp', mensaje: 'Hola, quiero un diagnóstico de mi empresa.', estilo: 'principal' }] },
    { imagen: 'hero-equipo.webp', decorativa: true, encuadre: 56, disposicion: 'texto-izquierda', transicion: 'recorte', titulo: 'Somos más que un [estudio contable]', subtitulo: 'Contamos con el sistema de gestión empresarial SIGE Mype: nueve áreas de servicio alrededor de tu contabilidad.', botones: [{ etiqueta: 'Conoce SIGE Mype', tipo: 'seccion', destino: '#servicios', estilo: 'principal' }, { etiqueta: '952 249 102', tipo: 'llamada', estilo: 'secundario' }] },
  ]

  // Botón de llamada a la acción: muestra el campo que corresponde a la acción elegida.
  document.addEventListener('change', (e) => {
    const sel = e.target.closest?.('[data-tipo-destino]')
    if (!sel) return
    const caja = sel.closest('[data-con-destino]')
    const tipo = sel.value
    caja.querySelectorAll('[data-si-tipo]').forEach((el) => { el.hidden = !el.dataset.siTipo.split(' ').includes(tipo) })
    const destino = caja.querySelector('[data-validar=destino]')
    if (destino) {
      destino.required = ['seccion', 'interna', 'externa'].includes(tipo)
      destino.placeholder = { seccion: '#planes', interna: '/guia', externa: 'https://' }[tipo] || ''
      if (destino.value) validarCampo(destino)
    }
  })

  PANTALLAS.portada = () => {
    const n = Math.min(4, Math.max(1, Number(parametro('n')) || 2))
    const p = PORTADAS[n - 1]
    const $ = (s) => document.querySelector(s)
    const form = $('form[data-edicion]')
    document.title = `Portada ${n} · Carrusel de portadas · Panel JJMM`
    cambiarMiga(`Portada ${n}`)
    document.querySelectorAll('[data-numero]').forEach((el) => { el.textContent = n })
    $('#portada-imagen')._fijar(p.imagen)
    $('#portada-movil')._fijar(p.movil || '')
    $('#portada-sello')._fijar(p.sello || '')
    $('#decorativa').setAttribute('aria-checked', String(p.decorativa))
    $('#encuadre').value = p.encuadre ?? 50
    $('#disposicion').dataset.valor = p.disposicion
    $('#disposicion').querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.valor === p.disposicion)))
    $('#transicion').value = p.transicion
    $('#portada-titulo').value = p.titulo || ''
    $('#portada-subtitulo').value = p.subtitulo || ''
    llenarLista($('#lista-puntos'), (p.lista || []).map((texto) => ({ texto })))
    llenarLista($('#lista-botones'), p.botones)

    const vista = $('#vista-portada')
    let modo = 'escritorio'
    const pintar = () => {
      const disposicion = $('#disposicion').dataset.valor
      const sinTexto = disposicion === 'imagen-completa'
      document.querySelectorAll('[data-solo-con-texto]').forEach((el) => { el.hidden = sinTexto })
      $('#nota-sin-texto').hidden = !sinTexto
      const imagen = medioPorArchivo($('#portada-imagen').dataset.valor)
      const movil = medioPorArchivo($('#portada-movil').dataset.valor)
      const decorativa = valorDeInterruptor($('#decorativa'))
      $('#nota-alt').hidden = decorativa
      if (imagen) $('#nota-alt [data-alt]').textContent = (modo === 'celular' && movil ? movil : imagen).alt
      const enCelular = modo === 'celular'
      const fondo = enCelular && movil ? movil : imagen
      vista.style.backgroundImage = fondo ? `url('${fondo.src}')` : 'none'
      // «Sin texto» muestra la imagen entera (lleva su propio texto): la vista toma su proporción.
      vista.style.aspectRatio = ''
      if (sinTexto && fondo && !enCelular) {
        const img = new Image()
        img.onload = () => { if (vista.dataset.disposicion === 'imagen-completa') vista.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}` }
        img.src = fondo.src
      }
      vista.style.backgroundPosition = enCelular && !movil ? `${$('#encuadre').value}% center` : 'center'
      vista.dataset.disposicion = disposicion
      vista.dataset.modo = modo
      $('#encuadre-valor').textContent = $('#encuadre').value + ' %'
      $('#vista-titulo').innerHTML = conCorchetes($('#portada-titulo').value)
      $('#vista-subtitulo').textContent = $('#portada-subtitulo').value
      const sello = medioPorArchivo($('#portada-sello').dataset.valor)
      $('#vista-sello').hidden = !sello
      if (sello) $('#vista-sello').src = sello.src
      const puntos = [...$('#lista-puntos').querySelectorAll('input')].map((i) => i.value.trim()).filter(Boolean)
      $('#vista-lista').innerHTML = puntos.map((t) => `<li>${icono('check')}<span>${escapar(t)}</span></li>`).join('')
      const botones = [...$('#lista-botones').children].map((li) => {
        const v = (k) => li.querySelector(`[data-clave="${k}"]`).value.trim()
        return `<span class="${v('estilo') === 'principal' ? 'publica-boton' : 'publica-linea'}"${v('estilo') === 'principal' ? '' : ' style="border-color:#fff;color:#fff"'}>${escapar(v('etiqueta') || 'Botón')}</span>`
      }).join('')
      $('#vista-botones').innerHTML = sinTexto ? '' : botones
      $('#vista-botones-sueltos').innerHTML = sinTexto ? botones : ''
    }
    $('#modo-vista').addEventListener('cambio', (e) => { e.stopPropagation(); modo = e.detail; pintar() })
    form.addEventListener('input', pintar)
    form.addEventListener('cambio', () => setTimeout(pintar))
    pintar()
  }

  // ---------------------------------------------------------------- Publicaciones: editor
  const CATEGORIAS = [
    { nombre: 'Tributación', slug: 'tributacion', publicaciones: 2 },
    { nombre: 'Guías para tu empresa', slug: 'guias-para-tu-empresa', publicaciones: 1 },
  ]
  const ETIQUETAS = [
    { nombre: 'IGV', slug: 'igv', color: 'azul', publicaciones: 2 },
    { nombre: 'Cierre de mes', slug: 'cierre-de-mes', color: 'verde', publicaciones: 1 },
    { nombre: 'Libros electrónicos', slug: 'libros-electronicos', color: 'morado', publicaciones: 1 },
    { nombre: 'SUNAT', slug: 'sunat', color: 'amarillo', publicaciones: 2 },
  ]
  const PUBLICACIONES = {
    cronograma: {
      titulo: 'Cronograma de obligaciones de diciembre', estado: 'borrador', categoria: 'tributacion', etiquetas: ['sunat', 'igv'], imagen: 'hero-taza.webp',
      extracto: 'Qué revisar antes de cada vencimiento del mes y dónde consultar la fecha que te corresponde según tu RUC.',
      contenido: '<p>Cada mes, SUNAT fija la fecha de vencimiento de tus declaraciones según el <strong>último dígito de tu RUC</strong>. Esta guía te ayuda a llegar con todo listo.</p><h2>Antes del vencimiento</h2><ul><li>Envía tus comprobantes de compras y ventas.</li><li>Revisa tus estados de cuenta bancarios.</li><li>Confirma tus pagos de planilla.</li></ul><p>Consulta la fecha exacta en la <a href="/guia">Guía de clientes</a>.</p>',
    },
    cierre: {
      titulo: 'Cómo preparar tus documentos para el cierre del mes', estado: 'publicada', categoria: 'guias-para-tu-empresa', etiquetas: ['cierre-de-mes'], imagen: 'hero-equipo.webp', fecha: '2026-11-18T09:00',
      extracto: 'La lista de documentos que necesitamos del 1.º al 5.º día útil de cada mes para cerrar tu contabilidad a tiempo.',
      contenido: '<p>El cierre tributario inicia del 1.º al 5.º día útil de cada mes. Con estos documentos a tiempo, hacemos una liquidación preliminar en tres días hábiles.</p><h2>Qué enviar</h2><ul><li>Comprobantes de compras</li><li>Comprobantes de ventas</li><li>Estados de cuenta bancarios</li><li>Liquidaciones de caja chica</li></ul><blockquote>Si hay alguna observación, te avisamos con tiempo para que puedas subsanarla.</blockquote>',
    },
  }

  PANTALLAS.publicacion = () => {
    const $ = (s) => document.querySelector(s)
    const form = $('#form-publicacion')
    const nueva = parametro('nueva') !== null
    const datos = nueva ? { titulo: '', estado: 'borrador', categoria: '', etiquetas: [], imagen: '', extracto: '', contenido: '' } : PUBLICACIONES[parametro('id')] || PUBLICACIONES.cronograma
    let publicada = datos.estado === 'publicada'
    let borradorPendiente = false
    let slugManual = !nueva

    document.title = `${nueva ? 'Nueva publicación' : datos.titulo} · Publicaciones · Panel JJMM`
    cambiarMiga(nueva ? 'Nueva publicación' : datos.titulo)
    $('#aviso-ejemplo').hidden = nueva
    $('#pub-titulo').value = datos.titulo
    $('#pub-slug').value = generarSlug(datos.titulo)
    $('#pub-extracto').value = datos.extracto
    $('#pub-contenido').innerHTML = datos.contenido
    $('#pub-contenido').dataset.valor = $('#pub-contenido').innerHTML
    $('#pub-imagen')._fijar(datos.imagen)
    const ahora = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 6e4).toISOString().slice(0, 16)
    $('#pub-fecha').value = datos.fecha || ahora

    // Categoría (obligatoria) con alta en línea.
    const categoria = $('#pub-categoria')
    const pintarCategorias = (elegida) => {
      categoria.innerHTML = '<option value="">Elige una categoría</option>' + CATEGORIAS.map((c) => `<option value="${c.slug}"${c.slug === elegida ? ' selected' : ''}>${escapar(c.nombre)}</option>`).join('')
    }
    pintarCategorias(datos.categoria)
    $('#nueva-categoria-abrir').addEventListener('click', () => { $('#nueva-categoria').hidden = false; $('#nueva-categoria-nombre').focus() })
    const crearCategoria = () => {
      const campo = $('#nueva-categoria-nombre')
      const nombre = campo.value.trim()
      if (!nombre) { campo.focus(); return }
      const existe = CATEGORIAS.find((c) => normalizar(c.nombre) === normalizar(nombre))
      if (!existe) CATEGORIAS.push({ nombre, slug: generarSlug(nombre), publicaciones: 0 })
      pintarCategorias((existe || CATEGORIAS[CATEGORIAS.length - 1]).slug)
      campo.value = ''
      $('#nueva-categoria').hidden = true
      categoria.focus()
      categoria.dispatchEvent(new Event('change', { bubbles: true }))
      avisoBreve(existe ? `Ya existía «${existe.nombre}»` : `Categoría «${nombre}» creada`, existe ? 'Quedó elegida.' : 'Quedó elegida para esta publicación.')
    }
    $('#nueva-categoria-crear').addEventListener('click', crearCategoria)
    $('#nueva-categoria-nombre').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); crearCategoria() } })

    // Etiquetas: elegir de las existentes o crear una nueva al vuelo.
    const elegidas = $('#pub-etiquetas')
    let etiquetas = [...datos.etiquetas]
    const pintarEtiquetas = () => {
      elegidas.dataset.valor = etiquetas.join(',')
      elegidas.innerHTML = etiquetas.map((s) => {
        const et = ETIQUETAS.find((x) => x.slug === s)
        return `<li><span class="chip-color" data-color="${et.color}">${escapar(et.nombre)}<button type="button" data-quitar-etiqueta="${s}" aria-label="Quitar la etiqueta ${escapar(et.nombre)}">${icono('cerrar')}</button></span></li>`
      }).join('')
      $('#sin-etiquetas').hidden = etiquetas.length > 0
      $('#etiquetas-sugeridas').innerHTML = ETIQUETAS.filter((e) => !etiquetas.includes(e.slug)).map((e) => `<option value="${escapar(e.nombre)}"></option>`).join('')
    }
    const agregarEtiqueta = () => {
      const campo = $('#pub-etiqueta-nueva')
      const nombre = campo.value.trim()
      if (!nombre) { campo.focus(); return }
      let et = ETIQUETAS.find((x) => normalizar(x.nombre) === normalizar(nombre))
      if (!et) {
        et = { nombre, slug: generarSlug(nombre), color: 'azul', publicaciones: 0 }
        ETIQUETAS.push(et)
        avisoBreve(`Etiqueta «${nombre}» creada`, 'Su color se cambia en Categorías y etiquetas.')
      }
      if (!etiquetas.includes(et.slug)) etiquetas.push(et.slug)
      campo.value = ''
      pintarEtiquetas()
      revisar()
      campo.focus()
    }
    $('#pub-etiqueta-agregar').addEventListener('click', agregarEtiqueta)
    $('#pub-etiqueta-nueva').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); agregarEtiqueta() } })
    elegidas.addEventListener('click', (e) => {
      const b = e.target.closest('[data-quitar-etiqueta]')
      if (!b) return
      etiquetas = etiquetas.filter((s) => s !== b.dataset.quitarEtiqueta)
      pintarEtiquetas()
      revisar()
      $('#pub-etiqueta-nueva').focus()
    })
    pintarEtiquetas()

    // Dirección: sale del título hasta que la cambias a mano.
    const titulo = $('#pub-titulo')
    const slug = $('#pub-slug')
    const pintarSlug = () => { $('#slug-texto').textContent = slug.value || 'se-genera-del-titulo' }
    titulo.addEventListener('input', () => { if (!slugManual) { slug.value = generarSlug(titulo.value); pintarSlug() } })
    $('#slug-cambiar').addEventListener('click', () => {
      $('#slug-edicion').hidden = false
      $('#slug-vista').hidden = true
      $('#slug-aviso').hidden = !publicada
      slug.focus()
    })
    slug.addEventListener('input', () => { slugManual = true; pintarSlug() })
    $('#slug-listo').addEventListener('click', () => {
      if (!validarCampo(slug)) { slug.focus(); return }
      $('#slug-edicion').hidden = true
      $('#slug-vista').hidden = false
      $('#slug-cambiar').focus()
    })
    pintarSlug()

    // Estado de publicación y barra de guardado.
    let base = ''
    const insignia = $('#estado-insignia')
    const pintarEstado = () => {
      const sucia = fotografia(form) !== base
      hayCambiosSinGuardar = sucia
      insignia.dataset.estado = !publicada ? 'en-curso' : borradorPendiente ? 'pendiente' : 'listo'
      insignia.textContent = !publicada ? 'Borrador' : borradorPendiente ? 'Publicada, con cambios en borrador' : 'Publicada'
      $('#estado-texto').textContent = !publicada
        ? 'Solo la ve el equipo. Se muestra en el blog cuando pulsas «Publicar».'
        : borradorPendiente
          ? 'El blog muestra la versión publicada. Tus cambios guardados como borrador aún no se ven.'
          : 'Se ve en el blog. Lo que guardes como borrador no cambia lo publicado hasta que pulses «Publicar cambios».'
      $('#publicar').textContent = publicada ? 'Publicar cambios' : 'Publicar'
      $('#publicar').disabled = publicada && !sucia && !borradorPendiente
      $('#guardar-borrador').disabled = !sucia
      $('#despublicar').hidden = !publicada
      $('#despublicar').disabled = false
      $('[data-sin-guardar]').hidden = !sucia
      $('[data-guardado]').hidden = sucia
    }
    // Resultado de Google: lo vacío se toma del título y del extracto, como hace el sitio.
    const pintarGoogle = () => {
      $('#google-slug').textContent = slug.value
      $('#google-titulo').textContent = $('#seo-titulo').value.trim() || titulo.value.trim() || 'Sin título'
      $('#google-texto').textContent = $('#seo-descripcion').value.trim() || $('#pub-extracto').value.trim()
      $('#seo-titulo').placeholder = titulo.value.trim()
      $('#seo-descripcion').placeholder = $('#pub-extracto').value.trim()
    }
    const revisar = () => { pintarGoogle(); pintarEstado() }
    form.addEventListener('input', revisar)
    form.addEventListener('change', revisar)
    form.addEventListener('cambio', () => setTimeout(revisar))

    const errorContenido = $('#pub-contenido-error')
    const conTexto = () => $('#pub-contenido').textContent.trim().length > 0
    const trabajar = (boton, texto, fin) => {
      const original = boton.textContent
      ;[...form.querySelectorAll('.barra-guardado .boton')].forEach((b) => { b.disabled = true })
      boton.innerHTML = `<span class="cargando" aria-hidden="true"></span>${texto}`
      setTimeout(() => { boton.textContent = original; fin(); base = fotografia(form); pintarEstado() }, 700)
    }
    $('#guardar-borrador').addEventListener('click', () => {
      if (!titulo.value.trim()) { titulo.reportValidity(); return }
      trabajar($('#guardar-borrador'), 'Guardando…', () => {
        if (publicada) borradorPendiente = true
        $('[data-guardado]').textContent = 'Borrador guardado hace un momento.'
        avisoBreve('Borrador guardado', publicada ? 'El blog sigue mostrando la versión publicada.' : 'Nadie lo ve hasta que lo publiques.')
      })
    })
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      errorContenido.hidden = conTexto()
      const camposOk = validarTodo(form) && form.reportValidity()
      if (!camposOk) return
      if (!conTexto()) { $('#pub-contenido').focus(); return }
      const eraPublicada = publicada
      trabajar($('#publicar'), 'Publicando…', () => {
        publicada = true
        borradorPendiente = false
        $('[data-guardado]').textContent = 'Publicada hace un momento.'
        avisoBreve(eraPublicada ? 'Cambios publicados' : 'Publicación publicada', 'Ya se ve en el blog.')
      })
    })
    $('#despublicar').addEventListener('click', async () => {
      const ok = await confirmar({ titulo: `¿Despublicar «${titulo.value.trim() || 'esta publicación'}»?`, texto: 'Deja de verse en el blog y vuelve a borrador. No se borra: puedes publicarla de nuevo cuando quieras.', accion: 'Despublicar', destructivo: false })
      if (!ok) return
      trabajar($('#despublicar'), 'Despublicando…', () => {
        publicada = false
        borradorPendiente = false
        avisoBreve('Publicación despublicada', 'Ya no se ve en el blog; sigue aquí como borrador.')
      })
    })
    $('#pub-contenido').addEventListener('input', () => { if (conTexto()) errorContenido.hidden = true })

    // Vista previa del artículo y de su tarjeta en el listado.
    const hojaVista = $('#hoja-vista')
    const fechaLegible = () => {
      const f = new Date($('#pub-fecha').value)
      return isNaN(f) ? '' : f.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })
    }
    const pintarVista = (modo) => {
      const cat = CATEGORIAS.find((c) => c.slug === categoria.value)
      const img = medioPorArchivo($('#pub-imagen').dataset.valor)
      const chips = etiquetas.map((s) => { const et = ETIQUETAS.find((x) => x.slug === s); return `<span class="chip-color" data-color="${et.color}">${escapar(et.nombre)}</span>` }).join(' ')
      const t = escapar(titulo.value.trim() || 'Sin título')
      $('#vista-contenido').innerHTML = modo === 'listado'
        ? `<div style="padding:1.5rem;max-width:22rem;margin:0 auto"><article class="publica-tarjeta-blog">${img ? `<img src="${img.src}" alt="">` : `<span class="miniatura-vacia">${icono('imagen', 'icono-lg')}</span>`}<div><span class="publica-meta">${escapar(cat ? cat.nombre : 'Sin categoría')} · ${fechaLegible()}</span><h3>${t}</h3><p class="publica-meta" style="font-size:.75rem">${escapar($('#pub-extracto').value.trim())}</p></div></article></div>`
        : `<article class="publica-articulo"><span class="publica-meta">${escapar(cat ? cat.nombre : 'Sin categoría')} · ${fechaLegible()}</span><h1>${t}</h1>${img ? `<img src="${img.src}" alt="${escapar(img.alt)}">` : ''}<div class="publica-cuerpo">${$('#pub-contenido').innerHTML}</div><p>${chips}</p></article>`
    }
    $('#modo-vista-pub').addEventListener('cambio', (e) => { e.stopPropagation(); pintarVista(e.detail) })
    hojaVista.addEventListener('capa:abierta', () => {
      $('#modo-vista-pub').querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.valor === 'articulo')))
      pintarVista('articulo')
    })

    base = fotografia(form)
    revisar()
    $('[data-guardado]').textContent = nueva ? 'Todavía no se guarda.' : publicada ? 'Publicada el 18 nov. 2026.' : 'Borrador guardado hace 2 días.'
  }

  // ---------------------------------------------------------------- Categorías y etiquetas
  PANTALLAS.taxonomias = () => {
    const vacio = leer('publicaciones') === 'vacio'
    const esAdmin = leer('rol') !== 'editor'
    const hoja = document.querySelector('#hoja-taxonomia')
    const guardada = protegerHoja(hoja)
    const nombre = hoja.querySelector('#tax-nombre')
    const slug = hoja.querySelector('#tax-slug')
    let actual = null
    let tipo = 'categoria'
    let slugManual = false
    if (vacio) { CATEGORIAS.length = 0; ETIQUETAS.length = 0 }
    const pintar = () => {
      document.querySelector('#tabla-categorias tbody').innerHTML = CATEGORIAS.map((c, i) => `
        <tr>
          <td class="principal-movil"><div class="celda-principal-texto"><button class="enlace-fila" type="button" data-editar-tax="categoria" data-i="${i}">${escapar(c.nombre)}</button><span>/blog/categoria/${escapar(c.slug)} · <span class="ejemplo">Ejemplo</span></span></div></td>
          <td class="lado-movil texto-suave">${c.publicaciones === 1 ? '1 publicación' : `${c.publicaciones} publicaciones`}</td>
          <td class="derecha ocultar-movil"><button class="boton boton-secundario boton-sm" type="button" data-editar-tax="categoria" data-i="${i}" aria-label="Editar ${escapar(c.nombre)}">Editar</button></td>
        </tr>`).join('')
      document.querySelector('#tabla-etiquetas tbody').innerHTML = ETIQUETAS.map((e, i) => `
        <tr>
          <td class="principal-movil"><div class="celda-principal-texto"><span><span class="chip-color" data-color="${e.color}">${escapar(e.nombre)}</span></span><span>/blog/etiqueta/${escapar(e.slug)} · <span class="ejemplo">Ejemplo</span></span></div></td>
          <td class="lado-movil texto-suave">${e.publicaciones === 1 ? '1 publicación' : `${e.publicaciones} publicaciones`}</td>
          <td class="derecha debajo-movil"><button class="boton boton-secundario boton-sm" type="button" data-editar-tax="etiqueta" data-i="${i}" aria-label="Editar la etiqueta ${escapar(e.nombre)}">Editar</button></td>
        </tr>`).join('')
      document.querySelector('#categorias-vacio').hidden = CATEGORIAS.length > 0
      document.querySelector('#tabla-categorias').hidden = !CATEGORIAS.length
      document.querySelector('#etiquetas-vacio').hidden = ETIQUETAS.length > 0
      document.querySelector('#tabla-etiquetas').hidden = !ETIQUETAS.length
      document.querySelector('#aviso-ejemplo-tax').hidden = !CATEGORIAS.length && !ETIQUETAS.length
    }
    hoja.querySelector('#opciones-color').innerHTML = [['azul', 'Azul'], ['verde', 'Verde'], ['rojo', 'Rojo'], ['amarillo', 'Amarillo'], ['morado', 'Morado'], ['gris', 'Gris']].map(([v, t]) => `
      <div class="opcion-visual"><input type="radio" name="tax-color" id="color-${v}" value="${v}"><label for="color-${v}"><span class="chip-color" data-color="${v}">${t}</span></label></div>`).join('')
    const abrir = (t, i, disparador) => {
      tipo = t
      const lista = t === 'categoria' ? CATEGORIAS : ETIQUETAS
      actual = i === null ? null : lista[i]
      const d = actual || { nombre: '', slug: '', color: 'azul', publicaciones: 0 }
      slugManual = Boolean(actual)
      hoja.querySelector('#tax-titulo').textContent = actual ? (t === 'categoria' ? 'Editar categoría' : 'Editar etiqueta') : t === 'categoria' ? 'Nueva categoría' : 'Nueva etiqueta'
      nombre.value = d.nombre
      slug.value = d.slug
      mostrarError(slug, '')
      hoja.querySelector('#tax-ruta').textContent = t === 'categoria' ? '/blog/categoria/' : '/blog/etiqueta/'
      hoja.querySelector('#campo-color').hidden = t !== 'etiqueta'
      hoja.querySelectorAll('[name=tax-color]').forEach((r) => { r.checked = r.value === d.color })
      const borrar = hoja.querySelector('#tax-eliminar')
      const motivo = hoja.querySelector('#tax-eliminar-motivo')
      borrar.hidden = !actual || !esAdmin
      const bloqueada = t === 'categoria' && d.publicaciones > 0
      borrar.disabled = bloqueada
      motivo.hidden = !actual || !esAdmin || !bloqueada
      motivo.textContent = bloqueada ? `No se puede eliminar: ${d.publicaciones === 1 ? '1 publicación la usa' : `${d.publicaciones} publicaciones la usan`}. Cada publicación necesita una categoría; cámbialas antes.` : ''
      abrirCapa('hoja-taxonomia', disparador)
    }
    nombre.addEventListener('input', () => { if (!slugManual) slug.value = generarSlug(nombre.value) })
    slug.addEventListener('input', () => { slugManual = true })
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-editar-tax]')
      if (b) abrir(b.dataset.editarTax, b.dataset.i === undefined ? null : Number(b.dataset.i), b)
    })
    hoja.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault()
      if (!slug.value.trim()) slug.value = generarSlug(nombre.value)
      if (!validarTodo(e.target) || !e.target.reportValidity()) return
      const lista = tipo === 'categoria' ? CATEGORIAS : ETIQUETAS
      const repetida = lista.find((x) => x !== actual && (normalizar(x.nombre) === normalizar(nombre.value.trim()) || x.slug === slug.value.trim()))
      if (repetida) { mostrarError(nombre, `Ya existe «${repetida.nombre}» con ese nombre o dirección.`); nombre.focus(); return }
      mostrarError(nombre, '')
      const d = { nombre: nombre.value.trim(), slug: slug.value.trim(), color: hoja.querySelector('[name=tax-color]:checked')?.value || 'azul', publicaciones: actual ? actual.publicaciones : 0 }
      if (actual) Object.assign(actual, d)
      else lista.push(d)
      lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
      guardada()
      cerrarCapa(hoja)
      pintar()
      avisoBreve(actual ? 'Cambios guardados' : tipo === 'categoria' ? 'Categoría creada' : 'Etiqueta creada', actual && actual.publicaciones ? 'Sus publicaciones ya la muestran así.' : 'Ya puedes usarla al escribir una publicación.')
    })
    hoja.querySelector('#tax-eliminar').addEventListener('click', async () => {
      const lista = tipo === 'categoria' ? CATEGORIAS : ETIQUETAS
      const texto = tipo === 'etiqueta' && actual.publicaciones
        ? `Se quita de ${actual.publicaciones === 1 ? '1 publicación' : `${actual.publicaciones} publicaciones`}, que siguen publicadas, y su página /blog/etiqueta/${actual.slug} deja de existir.`
        : 'Su página del blog deja de existir. No se puede deshacer.'
      const ok = await confirmar({ titulo: `¿Eliminar «${actual.nombre}»?`, texto, accion: tipo === 'categoria' ? 'Eliminar categoría' : 'Eliminar etiqueta' })
      if (!ok) return
      lista.splice(lista.indexOf(actual), 1)
      guardada()
      cerrarCapa(hoja)
      pintar()
      avisoBreve(tipo === 'categoria' ? 'Categoría eliminada' : 'Etiqueta eliminada')
    })
    pintar()
  }

  // ---------------------------------------------------------------- Datos del estudio
  const REDES = [['facebook', 'Facebook'], ['x', 'X (Twitter)'], ['youtube', 'YouTube'], ['instagram', 'Instagram'], ['tiktok', 'TikTok'], ['linkedin', 'LinkedIn']]

  PANTALLAS.estudio = () => {
    const $ = (s) => document.querySelector(s)
    const form = $('form[data-edicion]')
    const lista = $('#lista-redes')
    llenarLista(lista, [
      { red: 'facebook', url: 'https://www.facebook.com/Grupo-Contable-JJMM-1375492852750200/' },
      { red: 'x', url: 'https://twitter.com/CONTABLEJJMMSAC' },
      { red: 'youtube', url: 'https://www.youtube.com/channel/UC_3EI0DpkhlLKGBGfvY2oXg' },
    ])
    // «Agregar red» propone la primera red que todavía no está.
    $('[data-agregar="lista-redes"]')._valores = () => {
      const usadas = [...lista.querySelectorAll('select')].map((s) => s.value)
      return { red: (REDES.find(([v]) => !usadas.includes(v)) || REDES[0])[0], url: '' }
    }
    const pintar = () => {
      const selects = [...lista.querySelectorAll('select')]
      selects.forEach((s) => {
        const repetida = selects.filter((o) => o.value === s.value).length > 1
        mostrarError(s, repetida ? 'Esta red ya está en la lista.' : '')
      })
      $('#vista-redes').innerHTML = selects.map((s) => `<span role="img" aria-label="${REDES.find(([v]) => v === s.value)[1]}">${icono(s.value, 'icono-sm')}</span>`).join('')
      $('#vista-celular').textContent = $('#celular-whatsapp').value.trim()
      $('#vista-correo').textContent = $('#correo').value.trim()
      const logo = medioPorArchivo($('#marca-logo').dataset.valor)
      const sello = medioPorArchivo($('#marca-sello').dataset.valor)
      $('#vista-logo').src = logo ? logo.src : ''
      $('#vista-logo').alt = logo ? logo.alt : ''
      $('#vista-sello').hidden = !sello
      if (sello) $('#vista-sello').src = sello.src
      const seo = medioPorArchivo($('#seo-imagen').dataset.valor)
      $('#vista-seo-imagen').hidden = !seo
      if (seo) $('#vista-seo-imagen').src = seo.src
    }
    form.addEventListener('input', pintar)
    form.addEventListener('change', pintar)
    form.addEventListener('cambio', () => setTimeout(pintar))
    pintar()
  }

  // ---------------------------------------------------------------- Menú del sitio
  PANTALLAS.menuSitio = () => {
    const $ = (s) => document.querySelector(s)
    const lista = $('#lista-menu')
    const hoja = $('#hoja-item')
    const guardada = protegerHoja(hoja)
    const logo = hoja.querySelector('[data-selector-imagen]')
    let actual = null
    let secuencia = 0
    const roto = (it) => it.tipo === 'seccion' && !ANCLAS.some(([a]) => '#' + a === it.destino)
    const pintarItem = (li) => {
      const it = li._item
      const m = medioPorArchivo(it.imagen)
      li.dataset.valor = JSON.stringify(it)
      li.dataset.nombre = it.etiqueta
      li.innerHTML = `
        <span class="asa" title="Arrastra para cambiar el orden">${icono('asa', 'icono-sm')}</span>
        <span class="posicion"></span>
        <div class="celda-principal">
          ${m ? `<img class="miniatura miniatura-logo" src="${m.src}" alt="">` : `<span class="icono-caja icono-caja-marca" aria-hidden="true">${icono(it.tipo === 'externa' ? 'externo' : it.tipo === 'seccion' ? 'diseno' : 'periodico', 'icono-sm')}</span>`}
          <div class="celda-principal-texto"><strong>${escapar(it.etiqueta)}</strong><span>${TIPOS_DE_DESTINO[it.tipo]} · ${escapar(it.destino)}${it.nueva ? ' · pestaña nueva' : ''}${m ? ' · con logo' : ''}</span>
          ${roto(it) ? `<span class="error-campo">${icono('alerta', 'icono-sm')}Ninguna sección del inicio tiene el ancla ${escapar(it.destino)}.</span>` : ''}</div>
        </div>
        <div class="ordenable-acciones">
          ${botonesDeOrden(it.etiqueta)}
          <button class="boton boton-secundario boton-sm" type="button" data-editar-item aria-label="Editar «${escapar(it.etiqueta)}»">Editar</button>
          <button class="boton boton-fantasma boton-icono boton-sm" type="button" data-quitar-item aria-label="Quitar «${escapar(it.etiqueta)}» del menú">${icono('basura', 'icono-sm')}</button>
        </div>`
    }
    const nuevoLi = (it) => {
      const li = document.createElement('li')
      li.dataset.id = 'i' + secuencia++
      li._item = it
      pintarItem(li)
      return li
    }
    NAVEGACION.forEach((it) => lista.append(nuevoLi({ ...it })))
    const pintarVista = () => {
      const items = [...lista.children].map((li) => li._item)
      $('#vista-nav').innerHTML = items.map((it) => {
        const m = medioPorArchivo(it.imagen)
        return `<li${roto(it) ? ' data-roto="true"' : ''}>${m ? `<img src="${m.src}" alt="${escapar(it.etiqueta)}">` : escapar(it.etiqueta)}${it.nueva ? icono('externo') : ''}</li>`
      }).join('')
      $('#total-items').textContent = `${items.length} ítems`
      const rotos = items.filter(roto).length
      $('#nota-rotos').hidden = !rotos
    }
    const form = $('form[data-edicion]')
    form.addEventListener('cambio', () => setTimeout(pintarVista))
    // Hoja de edición de un ítem.
    const tipoSel = hoja.querySelector('#item-tipo')
    const anclaSel = hoja.querySelector('#item-ancla')
    const destino = hoja.querySelector('#item-destino')
    anclaSel.innerHTML = ANCLAS.map(([a, t]) => `<option value="#${a}">${escapar(t)} (#${a})</option>`).join('')
    const pintarTipo = () => {
      const t = tipoSel.dataset.valor
      hoja.querySelector('#campo-ancla').hidden = t !== 'seccion'
      hoja.querySelector('#campo-destino').hidden = t === 'seccion'
      destino.required = t !== 'seccion'
      destino.dataset.validar = t === 'externa' ? 'https' : 'ruta'
      destino.placeholder = t === 'externa' ? 'https://sigefact.pse.pe/' : '/guia'
      hoja.querySelector('#item-destino-ayuda').textContent = t === 'externa'
        ? 'La dirección completa del otro sitio, empezando con https://'
        : 'Una página de este sitio, empezando con /. Por ejemplo /blog o /guia.'
      if (destino.value) validarCampo(destino)
    }
    REGLAS.ruta = (v) => (/^\/[a-z0-9\-/]*$/.test(v) ? '' : 'Una página del sitio empieza con /, por ejemplo /guia.')
    tipoSel.addEventListener('cambio', () => setTimeout(pintarTipo))
    const abrir = (li, disparador) => {
      actual = li
      const it = li ? li._item : { etiqueta: '', tipo: 'seccion', destino: '#' + ANCLAS[0][0], nueva: false, imagen: '' }
      hoja.querySelector('#item-hoja-titulo').textContent = li ? `Editar «${it.etiqueta}»` : 'Nuevo ítem del menú'
      hoja.querySelector('#item-etiqueta').value = it.etiqueta
      tipoSel.dataset.valor = it.tipo
      tipoSel.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.valor === it.tipo)))
      if (it.tipo === 'seccion') {
        if (!roto(it)) anclaSel.value = it.destino
        destino.value = ''
      } else destino.value = it.destino
      hoja.querySelector('#item-ancla-rota').hidden = !roto(it)
      if (roto(it)) hoja.querySelector('#item-ancla-rota span').textContent = `Hoy apunta a ${it.destino}, que no existe. Elige una sección.`
      hoja.querySelector('#item-nueva').setAttribute('aria-checked', String(Boolean(it.nueva)))
      logo._fijar(it.imagen || '')
      mostrarError(destino, '')
      pintarTipo()
      abrirCapa('hoja-item', disparador)
    }
    lista.addEventListener('click', async (e) => {
      const editar = e.target.closest('[data-editar-item]')
      if (editar) { abrir(editar.closest('li'), editar); return }
      const quitar = e.target.closest('[data-quitar-item]')
      if (!quitar) return
      const li = quitar.closest('li')
      const ok = await confirmar({ titulo: `¿Quitar «${li._item.etiqueta}» del menú?`, texto: 'Deja de verse en la cabecera y en el menú del celular cuando guardes. La página o sección a la que lleva no se borra.', accion: 'Quitar del menú' })
      if (!ok) return
      const vecino = li.nextElementSibling || li.previousElementSibling
      li.remove()
      renumerar(lista)
      disparar(lista, 'cambio')
      ;(vecino?.querySelector('[data-editar-item]') || $('#nuevo-item')).focus()
    })
    $('#nuevo-item').addEventListener('click', (e) => abrir(null, e.currentTarget))
    hoja.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault()
      if (!validarTodo(e.target) || !e.target.reportValidity()) return
      const t = tipoSel.dataset.valor
      const it = {
        etiqueta: hoja.querySelector('#item-etiqueta').value.trim(),
        tipo: t,
        destino: t === 'seccion' ? anclaSel.value : destino.value.trim(),
        nueva: valorDeInterruptor(hoja.querySelector('#item-nueva')),
        imagen: logo.dataset.valor,
      }
      if (actual) { actual._item = it; pintarItem(actual) } else {
        actual = nuevoLi(it)
        lista.append(actual)
      }
      iniciarArrastre(lista)
      renumerar(lista)
      guardada()
      cerrarCapa(hoja)
      actual.querySelector('[data-editar-item]').focus()
      disparar(lista, 'cambio')
      avisoBreve('Ítem listo', 'Pulsa «Guardar cambios» para publicarlo en el menú.', 'info')
    })
    pintarVista()
  }

  // ---------------------------------------------------------------- Arranque
  document.addEventListener('DOMContentLoaded', () => {
    document.body.dataset.rol = leer('rol')
    montarEstructura()
    pintarIconos()
    document.querySelectorAll('[data-selector-imagen]').forEach(iniciarSelectorDeImagen)
    const pantalla = document.body.dataset.pantalla
    if (pantalla && PANTALLAS[pantalla]) PANTALLAS[pantalla]()
    document.querySelectorAll('[data-lista-campos]').forEach(estadoDeLista)
    document.querySelectorAll('[data-editor-texto]').forEach(iniciarEditorDeTexto)
    document.querySelectorAll('[data-tipo-destino]').forEach((s) => s.dispatchEvent(new Event('change', { bubbles: true })))
    iniciarContadores()
    iniciarReflejos()
    iniciarHojasDeGuardado()
    document.querySelectorAll('[data-listado]:not([data-listado-manual])').forEach(iniciarListado)
    document.querySelectorAll('[data-ordenable]').forEach(iniciarArrastre)
    document.querySelectorAll('form[data-edicion]').forEach(iniciarEdicion)
    if (!document.body.hasAttribute('data-sin-control')) montarControlMaqueta()
    if (!document.body.dataset.pagina) document.body.classList.add('sin-menu')
    document.querySelectorAll('[data-simular-global]').forEach((b) => b.addEventListener('click', () => avisoBreve(b.dataset.simularGlobal, 'En la maqueta no se abre ninguna aplicación.', 'info')))
  })
})()
