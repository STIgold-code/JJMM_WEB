/* Página de inicio del Estudio Contable JJMM. */
(function () {
  var reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function todos(sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); }

  /* Cabecera compacta, botón de volver arriba y sección activa en el menú */
  var cabecera = document.getElementById('cabecera');
  var subir = document.getElementById('subir');
  function alHacerScroll() {
    var y = window.scrollY;
    cabecera.classList.toggle('compacta', y > 60);
    subir.classList.toggle('visible', y > 700);
  }
  window.addEventListener('scroll', alHacerScroll, { passive: true });
  alHacerScroll();
  subir.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reducir ? 'auto' : 'smooth' }); });

  var enlacesMenu = todos('a[href^="#"]', document.querySelector('.navegacion')).concat(todos('a[href^="#"]', document.getElementById('panel-menu')));
  if ('IntersectionObserver' in window) {
    var espia = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        enlacesMenu.forEach(function (a) { a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + e.target.id)); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['inicio', 'quienes-somos', 'servicios', 'planes', 'contacto'].forEach(function (id) { espia.observe(document.getElementById(id)); });
  }

  /* Menú móvil en panel lateral */
  var panel = document.getElementById('panel-menu');
  var abrirMenu = document.querySelector('.menu-boton');
  function cambiarMenu(abrir) {
    panel.classList.toggle('abierto', abrir);
    panel.setAttribute('aria-hidden', String(!abrir));
    abrirMenu.setAttribute('aria-expanded', String(abrir));
    document.body.classList.toggle('menu-abierto', abrir);
    if (abrir) panel.querySelector('.panel-cerrar').focus(); else abrirMenu.focus({ preventScroll: true });
  }
  abrirMenu.addEventListener('click', function () { cambiarMenu(true); });
  panel.addEventListener('click', function (e) {
    if (e.target.closest('[data-cerrar]')) cambiarMenu(false);
    else if (e.target.closest('a')) cambiarMenu(false);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('abierto')) cambiarMenu(false); });

  /* Hero: el avance lo marca la barra de progreso; se pausa al pasar el cursor, al enfocar o con el botón */
  var hero = document.querySelector('.hero');
  var slides = todos('.hero-slide');
  var progresos = todos('.progresos button');
  var pausa = document.querySelector('.hero-pausa');
  var actual = 0;
  var pausadoPorUsuario = reducir;
  if (reducir) hero.classList.add('sin-auto', 'pausado');
  function mostrar(n) {
    actual = (n + slides.length) % slides.length;
    slides.forEach(function (s, i) { s.classList.toggle('actual', i === actual); s.setAttribute('aria-hidden', String(i !== actual)); });
    progresos.forEach(function (p, i) {
      p.classList.toggle('hecho', i < actual);
      p.removeAttribute('aria-current');
      var barra = p.querySelector('i');
      barra.style.animation = 'none'; void barra.offsetWidth; barra.style.animation = '';
    });
    progresos[actual].setAttribute('aria-current', 'true');
  }
  progresos.forEach(function (p, i) {
    p.addEventListener('click', function () { mostrar(i); });
    p.querySelector('i').addEventListener('animationend', function () { if (i === actual) mostrar(actual + 1); });
  });
  todos('.hero-boton[data-paso]').forEach(function (b) { b.addEventListener('click', function () { mostrar(actual + Number(b.dataset.paso)); }); });
  function marcarPausa() {
    pausa.setAttribute('aria-pressed', String(pausadoPorUsuario));
    pausa.querySelector('use').setAttribute('href', pausadoPorUsuario ? '#i-play' : '#i-pausa');
    pausa.querySelector('.oculto').textContent = pausadoPorUsuario ? 'Reanudar las portadas' : 'Pausar las portadas';
    hero.classList.toggle('pausado', pausadoPorUsuario);
    hero.classList.toggle('sin-auto', reducir && pausadoPorUsuario);
  }
  pausa.addEventListener('click', function () { pausadoPorUsuario = !pausadoPorUsuario; marcarPausa(); });
  marcarPausa();
  hero.addEventListener('mouseenter', function () { hero.classList.add('pausado'); });
  hero.addEventListener('mouseleave', function () { if (!pausadoPorUsuario) hero.classList.remove('pausado'); });
  hero.addEventListener('focusin', function () { hero.classList.add('pausado'); });
  hero.addEventListener('focusout', function (e) { if (!hero.contains(e.relatedTarget) && !pausadoPorUsuario) hero.classList.remove('pausado'); });
  hero.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') mostrar(actual + 1);
    if (e.key === 'ArrowLeft') mostrar(actual - 1);
  });
  var inicioX = null;
  hero.addEventListener('pointerdown', function (e) { inicioX = e.clientX; });
  hero.addEventListener('pointerup', function (e) {
    if (inicioX === null) return;
    var dx = e.clientX - inicioX; inicioX = null;
    if (Math.abs(dx) > 50) mostrar(actual + (dx < 0 ? 1 : -1));
  });

  /* Aparición al hacer scroll y cifras que cuentan hacia arriba */
  function contar(el) {
    var meta = Number(el.dataset.contar);
    if (reducir || !meta) return;
    var inicio = null;
    function paso(t) {
      if (!inicio) inicio = t;
      var avance = Math.min((t - inicio) / 1400, 1);
      el.textContent = Math.round(meta * (1 - Math.pow(1 - avance, 3)));
      if (avance < 1) requestAnimationFrame(paso); else el.textContent = meta;
    }
    requestAnimationFrame(paso);
  }
  if ('IntersectionObserver' in window && !reducir) {
    var revelador = new IntersectionObserver(function (entradas, obs) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('visible');
        todos('[data-contar]', e.target).forEach(contar);
        obs.unobserve(e.target);
      });
    }, { threshold: .15 });
    todos('.revelar').forEach(function (el) { revelador.observe(el); });
  } else {
    todos('.revelar').forEach(function (el) { el.classList.add('visible'); });
  }

  /* Servicios: la rueda y la lista se sincronizan */
  var pestanas = todos('[role="tab"]');
  var gajos = todos('.rueda polygon');
  function activar(n, enfocar) {
    pestanas.forEach(function (p, i) {
      var activa = i === n;
      p.setAttribute('aria-selected', String(activa));
      p.tabIndex = activa ? 0 : -1;
      var panelArea = document.getElementById(p.getAttribute('aria-controls'));
      panelArea.hidden = !activa;
      if (activa) { panelArea.classList.remove('entra'); void panelArea.offsetWidth; panelArea.classList.add('entra'); }
    });
    gajos.forEach(function (g) { g.classList.toggle('activo', Number(g.dataset.area) === n + 1); });
    if (enfocar) pestanas[n].focus();
  }
  pestanas.forEach(function (p, i) {
    p.addEventListener('click', function () { activar(i, false); });
    p.addEventListener('keydown', function (e) {
      var destino = null;
      if (e.key === 'ArrowRight') destino = (i + 1) % pestanas.length;
      if (e.key === 'ArrowLeft') destino = (i - 1 + pestanas.length) % pestanas.length;
      if (e.key === 'ArrowDown') destino = (i + 3) % pestanas.length;
      if (e.key === 'ArrowUp') destino = (i - 3 + pestanas.length) % pestanas.length;
      if (e.key === 'Home') destino = 0;
      if (e.key === 'End') destino = pestanas.length - 1;
      if (destino !== null) { e.preventDefault(); activar(destino, true); }
    });
  });
  gajos.forEach(function (g) { g.addEventListener('click', function () { activar(Number(g.dataset.area) - 1, false); }); });
  activar(0, false);

  /* Planes: filas generadas desde un solo listado; en el celular se ve un plan a la vez */
  var S = 's', N = 'n';
  var FILAS = [
    ['Para empresas con ventas anuales hasta de', 'Consultar', 'Consultar', 'Consultar', 'Consultar'],
    ['Gestión integral de planilla hasta', '2 trabajadores', '4 trabajadores', '6 trabajadores', '12 trabajadores'],
    ['Registro contable mensual de compras y ventas', S, S, S, S],
    ['Cálculo mensual del Impuesto a la Renta', S, S, S, S],
    ['Cálculo mensual del IGV', S, S, S, S],
    ['Cálculo y declaración mensual de la planilla electrónica', S, S, S, S],
    ['Declaración del PDT 621 (IGV y Renta)', S, S, S, S],
    ['Registro de Compras y Ventas en formato SUNAT', S, S, S, S],
    ['Libro Diario Simplificado mensual', S, S, S, S],
    ['Libro Diario y Libro Mayor mensual', N, S, S, S],
    ['Libro Bancos mensual', N, S, S, S],
    ['Otros libros obligatorios', N, N, S, S],
    ['Manejo de Kardex', N, N, N, S],
    ['Asesoría tributaria según tu régimen y sector', S, S, S, S],
    ['Asesoría tributaria y financiera en tu empresa', N, N, N, S],
    ['Elaboración y presentación de la DAOT', S, S, S, S],
    ['Impuesto a la Renta anual', N, N, N, S],
    ['Estados financieros intermedios', N, N, N, N],
    ['Una visita al mes para recoger y enviar documentación', N, N, S, S],
    ['Costo por trabajador adicional en planilla', 'Consultar', 'Consultar', 'Consultar', 'Consultar'],
    ['Límite de registro de comprobantes de pago', 'Consultar', 'Consultar', 'Consultar', 'Consultar'],
    ['Libros electrónicos', S, S, S, S]
  ];
  function celda(v) {
    if (v === S) return '<td><span class="marca-si"><svg class="icono" aria-hidden="true"><use href="#i-check"/></svg><span class="oculto">Incluido</span></span></td>';
    if (v === N) return '<td><span class="marca-no"><svg class="icono" aria-hidden="true"><use href="#i-x"/></svg><span class="oculto">No incluido</span></span></td>';
    return '<td>' + v + '</td>';
  }
  document.getElementById('filas-planes').innerHTML = FILAS.map(function (f) {
    return '<tr><th scope="row">' + f[0] + '</th>' + f.slice(1).map(celda).join('') + '</tr>';
  }).join('');
  var tabla = document.querySelector('.planes-tabla');
  var selector = todos('.selector-plan button');
  selector.forEach(function (b) {
    b.addEventListener('click', function () {
      selector.forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
      tabla.dataset.ver = b.dataset.ver;
    });
  });
  tabla.addEventListener('mouseover', function (e) {
    var c = e.target.closest('td, th');
    if (!c || c.cellIndex < 1) { delete tabla.dataset.col; return; }
    tabla.dataset.col = String(c.cellIndex + 1);
  });
  tabla.addEventListener('mouseleave', function () { delete tabla.dataset.col; });

  /* Clientes: flechas y arrastre */
  var pista = document.getElementById('pista');
  var flechas = todos('[data-mover]');
  function actualizarFlechas() {
    flechas[0].disabled = pista.scrollLeft < 8;
    flechas[1].disabled = pista.scrollLeft + pista.clientWidth > pista.scrollWidth - 8;
  }
  flechas.forEach(function (b) { b.addEventListener('click', function () { pista.scrollBy({ left: Number(b.dataset.mover) * pista.clientWidth * .8, behavior: reducir ? 'auto' : 'smooth' }); }); });
  pista.addEventListener('scroll', actualizarFlechas, { passive: true });
  actualizarFlechas();
  var arrastre = null;
  pista.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; arrastre = { x: e.clientX, s: pista.scrollLeft }; pista.classList.add('arrastrando'); });
  window.addEventListener('pointermove', function (e) { if (arrastre) pista.scrollLeft = arrastre.s - (e.clientX - arrastre.x); });
  window.addEventListener('pointerup', function () { if (arrastre) { arrastre = null; pista.classList.remove('arrastrando'); } });

  /* Formulario: valida y abre WhatsApp con el mensaje armado */
  var formulario = document.getElementById('formulario');
  function marcarError(campo, texto) {
    campo.setAttribute('aria-invalid', String(Boolean(texto)));
    document.getElementById('error-' + campo.id).textContent = texto;
  }
  formulario.addEventListener('submit', function (e) {
    e.preventDefault();
    var nombre = formulario.nombre, mensaje = formulario.mensaje;
    marcarError(nombre, nombre.value.trim() ? '' : 'Escribe tu nombre para saber cómo dirigirnos a ti.');
    marcarError(mensaje, mensaje.value.trim() ? '' : 'Cuéntanos en una línea qué necesitas.');
    var invalido = formulario.querySelector('[aria-invalid="true"]');
    if (invalido) { invalido.focus(); return; }
    var texto = 'Hola, soy ' + nombre.value.trim() + '. Necesito: ' + formulario.servicio.value + '. ' + mensaje.value.trim();
    window.open('https://wa.me/51951965242?text=' + encodeURIComponent(texto), '_blank', 'noopener');
  });

  /* Mapa: se carga solo cuando se pide, para que la página sea liviana */
  document.getElementById('ver-mapa').addEventListener('click', function () {
    var mapa = document.getElementById('mapa');
    var iframe = document.createElement('iframe');
    iframe.title = 'Mapa de ubicación del Estudio Contable JJMM en San Martín de Porres';
    iframe.src = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15608.707509981834!2d-77.08950189118585!3d-12.03134101480463!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105ceb0a5b6860b%3A0xb62bd9617941db!2sESTUDIO+CONTABLE+JJMM+SAC!5e0!3m2!1ses!2spe!4v1520698936292';
    iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    mapa.appendChild(iframe);
    iframe.focus();
  });
})();
