# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Principal (confirmado por el responsable del proyecto):** dueños y administradores de micro y pequeñas empresas (MYPE) de Lima que buscan un estudio contable. Suelen llegar desde el celular, con una preocupación concreta: cumplir con SUNAT sin multas y dejar de ocuparse de la contabilidad.
- **Secundario:** clientes actuales del estudio, que entran a la guía de clientes, al blog y al portal de facturación SIGEFact (`https://sigefact.pse.pe/`).

## Product Purpose

Sitio web público del Estudio Contable JJMM S.A.C. Su función es captar MYPEs nuevas: explicar qué hace el estudio, mostrar sus planes de outsourcing contable y llevar al visitante a contactar a una sede. El éxito es que un visitante escriba o llame.

## Positioning

El estudio trabaja con un sistema de gestión de calidad propio, **SIGE Mype**, que organiza nueve áreas de servicio (P1 a P9) alrededor de la contabilidad bajo un ciclo de mejora continua. Los planes de outsourcing llevan su nombre (SIGEMype I, SIGEMype II, SIGEMype Business).

## Operating Context

- Dos sedes en Lima: San Martín de Porres (Jr. Iquitos 593) y San Isidro (Calle Gorriones 151).
- El contacto ocurre por celular y WhatsApp, y por correo (`contabilidad@jjmm.com.pe`).
- Los clientes facturan electrónicamente a través de SIGEFact.
- Vocabulario del rubro que el visitante reconoce a medias: SUNAT, IGV, Impuesto a la Renta, PDT 621, planilla electrónica, libros electrónicos, DAOT, Kardex.

## Capabilities and Constraints

- Aplicación Laravel 8 con blog (posts, categorías, etiquetas, comentarios) y panel de administración. **El backend no se modifica**; el trabajo de frontend se hace en este repositorio (`JJMM_WEB`), separado del proyecto Laravel.
- Alcance del rediseño: página de inicio, guía de clientes y blog (listado y detalle).
- **Teléfonos:** solo celulares, 951 965 242 y 952 249 102. Los fijos no se publican.
- **Precios:** los cuatro planes muestran "Consultar". No se publican montos.
- El formulario de contacto actual no tiene backend funcional; el contacto del rediseño se resuelve con enlaces de WhatsApp, llamada y correo.
- Sin decidir: qué celular corresponde a cada sede, y si AdSense debe permanecer en el sitio.

## Brand Commitments

- Nombre: Estudio Contable JJMM S.A.C. (Grupo JJMM).
- Marca del sistema: SIGE Mype, con su rueda de nueve áreas P1 a P9 y el lema "Mejora continua".
- Lema vigente: "Cada empresa guiada por nuestro sistema, llega a ser líder."
- Valores declarados: excelencia, compromiso, innovación, confidencialidad, equidad, trabajo en equipo.
- Activos existentes: logotipos en `public/web/images/` (`logo-lenin.png`, `logo-grupo-lenin.png`, `logo-footer.png`, `sigefact.png`).
- Idioma: español neutro con tuteo (público peruano).

## Evidence on Hand

- Cifras publicadas por el estudio: más de 100 clientes de outsourcing, más de 100 requerimientos de SUNAT atendidos, más de 10 años de experiencia, más de 20 empresas constituidas.
- Matriz real de planes (Emprende, SIGEMype I, SIGEMype II, SIGEMype Business) con 22 características, en `resources/views/web/index.blade.php:460-589`.
- Descripción y alcance de las nueve áreas de servicio, en `resources/views/web/index.blade.php:288-444`.
- 11 logotipos de clientes en `public/web/images/client-logo1.png` a `client-logo11.png`.
- No existen: testimonios, casos de éxito, fotografías del equipo o de las sedes, precios, número de colegiatura. No deben inventarse.

## Product Principles

1. El contacto primero: en cualquier punto de la página, escribir o llamar al estudio está a un toque.
2. SIGE Mype es el argumento, no un adorno: se explica en lenguaje de dueño de negocio.
3. Solo hechos del estudio: cifras, planes y servicios tal como los publica; nada inventado.
4. Lenguaje del cliente antes que jerga contable; cuando un término técnico es necesario, se explica.
5. Pensado para el celular: legible, liviano y utilizable con una mano.

## Accessibility & Inclusion

WCAG 2.1 nivel AA: contraste, navegación por teclado, foco visible, texto alternativo, formularios con etiquetas, zoom habilitado y respeto por `prefers-reduced-motion`.
