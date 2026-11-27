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
      { id: 'areas', texto: 'Áreas de servicio', icono: 'maletin' },
    ] },
    { titulo: 'Sitio web', items: [
      { id: 'pagina-de-inicio', texto: 'Página de inicio', url: 'pagina-de-inicio.html', icono: 'diseno' },
      { id: 'sedes', texto: 'Sedes', url: 'sedes.html', icono: 'pin' },
      { id: 'clientes', texto: 'Clientes', icono: 'edificio' },
    ] },
    { titulo: 'Para tus clientes', items: [
      { id: 'guia', texto: 'Guía de clientes', url: 'guia-de-clientes.html', icono: 'libro' },
      { id: 'publicaciones', texto: 'Publicaciones', url: 'publicaciones.html', icono: 'periodico' },
      { id: 'medios', texto: 'Imágenes', url: 'medios.html', icono: 'imagen' },
    ] },
    { titulo: 'Administración', soloAdmin: true, items: [
      { id: 'usuarios', texto: 'Usuarios', url: 'usuarios.html', icono: 'usuarios' },
      { id: 'configuracion', texto: 'Datos del estudio', icono: 'ajustes' },
      { id: 'navegacion', texto: 'Menú del sitio', icono: 'lista' },
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

  // ---------------------------------------------------------------- Buscador global
  const INDICE = [
    ['Inicio', 'Pantalla', 'inicio.html'],
    ['Mensajes de contacto', 'Pantalla', 'mensajes.html'],
    ['Planes', 'Pantalla', 'planes.html'],
    ['Emprende', 'Plan', 'plan-editar.html'],
    ['SIGEMype I', 'Plan', 'plan-editar.html'],
    ['SIGEMype II', 'Plan', 'plan-editar.html'],
    ['SIGEMype Business', 'Plan', 'plan-editar.html'],
    ['Página de inicio', 'Pantalla', 'pagina-de-inicio.html'],
    ['Carrusel de portadas', 'Sección del inicio', 'portadas.html'],
    ['Sedes', 'Pantalla', 'sedes.html'],
    ['Sede San Martín de Porres', 'Sede', 'sede-editar.html'],
    ['Sede San Isidro', 'Sede', 'sede-editar.html'],
    ['Guía de clientes', 'Pantalla', 'guia-de-clientes.html'],
    ['Cierre tributario', 'Aviso', 'guia-de-clientes.html#avisos'],
    ['Cierre de planilla', 'Aviso', 'guia-de-clientes.html#avisos'],
    ['PDT 621 (IGV y Renta)', 'Vencimiento', 'guia-de-clientes.html#vencimientos'],
    ['PLAME', 'Vencimiento', 'guia-de-clientes.html#vencimientos'],
    ['DAOT', 'Vencimiento', 'guia-de-clientes.html#vencimientos'],
    ['Publicaciones', 'Pantalla', 'publicaciones.html'],
    ['Imágenes', 'Pantalla', 'medios.html'],
    ['Usuarios', 'Pantalla', 'usuarios.html'],
    ['Mi cuenta', 'Pantalla', 'mi-cuenta.html'],
  ]

  const normalizar = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

  const iniciarBuscadorGlobal = (raiz) => {
    const entrada = raiz.querySelector('input')
    const lista = raiz.querySelector('.resultados')
    let activo = -1
    const pintar = () => {
      const q = normalizar(entrada.value.trim())
      if (!q) {
        lista.hidden = true
        entrada.setAttribute('aria-expanded', 'false')
        return
      }
      const halla = INDICE.filter(([t, tipo]) => normalizar(t + ' ' + tipo).includes(q)).slice(0, 8)
      activo = halla.length ? 0 : -1
      lista.innerHTML = halla.length
        ? halla.map(([t, tipo, url], i) => `<li role="option" id="resultado-${i}" aria-selected="${i === 0}"><a href="${url}" tabindex="-1">${icono('buscar', 'icono-sm')}<span>${t}</span><small>${tipo}</small></a></li>`).join('')
        : `<li role="option" aria-disabled="true"><span>No hay resultados para «${entrada.value.trim().replace(/</g, '&lt;')}».</span></li>`
      lista.hidden = false
      entrada.setAttribute('aria-expanded', 'true')
      entrada.setAttribute('aria-activedescendant', activo >= 0 ? 'resultado-0' : '')
    }
    const marcar = (i) => {
      const opciones = [...lista.querySelectorAll('[role=option] a')]
      if (!opciones.length) return
      activo = (i + opciones.length) % opciones.length
      lista.querySelectorAll('[role=option]').forEach((li, j) => li.setAttribute('aria-selected', String(j === activo)))
      entrada.setAttribute('aria-activedescendant', 'resultado-' + activo)
    }
    entrada.addEventListener('input', pintar)
    entrada.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); marcar(activo + 1) }
      if (e.key === 'ArrowUp') { e.preventDefault(); marcar(activo - 1) }
      if (e.key === 'Enter' && activo >= 0) {
        e.preventDefault()
        const a = lista.querySelectorAll('[role=option] a')[activo]
        if (a) navegar(a.getAttribute('href'))
      }
      if (e.key === 'Escape') { entrada.value = ''; pintar() }
    })
    entrada.addEventListener('blur', () => setTimeout(() => { lista.hidden = true; entrada.setAttribute('aria-expanded', 'false') }, 150))
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); entrada.focus() }
    })
  }

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
          <div class="buscador-global" role="search">
            <div class="campo-con-icono">
              ${icono('buscar', 'icono-sm')}
              <label class="oculto-visual" for="buscar-en-el-panel">Buscar en el panel</label>
              <input class="entrada" id="buscar-en-el-panel" type="search" placeholder="Buscar en el panel" autocomplete="off" role="combobox" aria-expanded="false" aria-controls="resultados-globales" aria-autocomplete="list">
              <span class="atajo" aria-hidden="true">Ctrl K</span>
            </div>
            <ul class="resultados" id="resultados-globales" role="listbox" aria-label="Resultados" hidden></ul>
          </div>
        </header>
      </div>`
    contenido.id = 'contenido'
    contenido.classList.add('contenido')
    contenido.tabIndex = -1
    document.body.prepend(panel)
    panel.querySelector('.principal').append(contenido)
    iniciarBuscadorGlobal(panel.querySelector('.buscador-global'))
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

  document.addEventListener('keydown', (e) => {
    const arriba = pila[pila.length - 1]
    if (!arriba) return
    if (e.key === 'Escape') { e.preventDefault(); cerrarCapa(arriba.capa) }
    if (e.key === 'Tab') atraparFoco(e, arriba.capa)
  })

  document.addEventListener('click', (e) => {
    const abre = e.target.closest('[data-abre]')
    if (abre) { e.preventDefault(); abrirCapa(abre.dataset.abre, abre); return }
    const cierra = e.target.closest('[data-cierra]')
    if (cierra) { cerrarCapa(cierra.closest('.capa')); return }
    if (e.target.classList.contains('capa-fondo') && e.target.closest('.capa') && !e.target.closest('.capa').querySelector('[role=alertdialog]')) {
      cerrarCapa(e.target.closest('.capa'))
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
    let arrastrado = null
    lista.querySelectorAll('.asa').forEach((asa) => {
      const li = asa.closest('[data-ordenable] > *')
      asa.addEventListener('mousedown', () => { li.draggable = true })
      li.addEventListener('dragstart', (e) => { arrastrado = li; e.dataTransfer.effectAllowed = 'move'; li.style.opacity = '0.5' })
      li.addEventListener('dragend', () => { li.draggable = false; li.style.opacity = ''; if (arrastrado) alMover(lista, arrastrado); arrastrado = null })
      li.addEventListener('dragover', (e) => {
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

  const fotografia = (form) => {
    const valores = [...form.querySelectorAll('input, select, textarea')]
      .filter((el) => el.type !== 'file' && !el.hasAttribute('data-no-cuenta'))
      .map((el) => (el.type === 'checkbox' || el.type === 'radio' ? el.checked : el.value))
    const interruptores = [...form.querySelectorAll('.interruptor, [aria-pressed]')].map((el) => el.getAttribute('aria-checked') || el.getAttribute('aria-pressed'))
    const ordenes = [...form.querySelectorAll('[data-ordenable] > *')].map((li) => li.dataset.id || li.dataset.nombre)
    const extras = [...form.querySelectorAll('[data-valor]')].map((el) => el.dataset.valor)
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
        <td class="lado-movil derecha"><a class="boton boton-secundario boton-sm" href="publicaciones.html" aria-label="Ver el borrador">Ver</a></td>
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

  // ---------------------------------------------------------------- Arranque
  document.addEventListener('DOMContentLoaded', () => {
    document.body.dataset.rol = leer('rol')
    montarEstructura()
    pintarIconos()
    const pantalla = document.body.dataset.pantalla
    if (pantalla && PANTALLAS[pantalla]) PANTALLAS[pantalla]()
    document.querySelectorAll('[data-listado]:not([data-listado-manual])').forEach(iniciarListado)
    document.querySelectorAll('[data-ordenable]').forEach(iniciarArrastre)
    document.querySelectorAll('form[data-edicion]').forEach(iniciarEdicion)
    if (!document.body.hasAttribute('data-sin-control')) montarControlMaqueta()
    if (!document.body.dataset.pagina) document.body.classList.add('sin-menu')
    document.querySelectorAll('[data-simular-global]').forEach((b) => b.addEventListener('click', () => avisoBreve(b.dataset.simularGlobal, 'En la maqueta no se abre ninguna aplicación.', 'info')))
  })
})()
