# JJMM pierde clientes donde sus rivales captan

El sitio del Estudio Contable JJMM S.A.C. (sigemype.com) está por debajo del mínimo que hoy cumple casi toda su competencia en Lima, y la brecha está justo en el paso que convierte una visita en cliente: el contacto. De los 22 sitios revisados el 25 de noviembre de 2026 (8 estudios tradicionales, 7 servicios de contabilidad en línea y 7 firmas medianas de outsourcing), 14 llevan al visitante a WhatsApp con un toque (uno más quedó sin verificar) y varios precargan el mensaje con el plan elegido. JJMM tiene **cero enlaces de WhatsApp, cero enlaces `tel:` y un formulario que envía a una dirección que responde 404**, así que cada mensaje se pierde sin aviso ([CRITICA.md](../CRITICA.md)). También es el sitio más pesado de los diez medidos (**7,7 MB frente a un máximo de 3,7 MB** entre los competidores) y no apareció en ninguna búsqueda genérica observada, ni siquiera "estudio contable San Martín de Porres", donde tiene sede. La buena noticia es que el listón del mercado es bajo: casi todos los rivales usan plantillas con fotos de stock, sus pruebas sociales están rotas o incompletas, nadie ofrece un calendario de vencimientos SUNAT interactivo y solo un competidor convierte su método de trabajo en un argumento de venta, como podría hacerlo SIGE Mype. El rediseño puede llevar a JJMM del último tercio al primero si resuelve el contacto, explica SIGE Mype como lo hace Crececont con su "Ciclo Integral", publica solo hechos verificables y baja el peso de la página. Dos decisiones quedan en manos del estudio porque la evidencia del mercado choca con lo que establece `PRODUCT.md`: publicar o no un precio orientativo y cómo construir prueba social sin testimonios.

## El mercado se divide en tres segmentos con reglas distintas

La competencia de JJMM no es homogénea, y eso importa para decidir qué copiar. Los **estudios tradicionales** (Líderes Contables en San Martín de Porres, Carmanger, Netamente, Grupo JC, Lidercontab, Milian, Servicontal y Contadeus) son firmas de 1 a 3 oficinas con 10 a 30 años declarados; por ubicación y público, el rival más directo es Líderes Contables, también en SMP ([Líderes Contables](https://www.liderescontables.com/)). Los **servicios en línea** (Viringo, Tu Contador Mype, DeContador, TuEstudioContable, Red Económica, Contador Mype y Contatek) son equipos pequeños que venden con el precio por delante. Las **firmas medianas** (Crececont, S&M Contadores, Enfoque Contable, ACG, Consulting Perú, más GCF e Intelectta como casos límite) declaran de 100 a 700 clientes y de 20 a 150 profesionales, y ninguna publica precios. JJMM, con tres sedes, más de 100 clientes de outsourcing y más de 10 años ([PRODUCT.md](../PRODUCT.md)), está a medio camino entre el tradicional y el mediano, pero su público principal, el dueño de MYPE que llega desde el celular, es el mismo que persiguen los servicios en línea.

| Segmento | Sitios revisados | Publica precios | WhatsApp a un toque | Lighthouse móvil (rendimiento, medidos) |
|---|---|---|---|---|
| Estudios tradicionales | 8 | 3 de 8 | 5 de 8 | 36 a 60 |
| Contabilidad en línea | 7 | 7 de 7 | 4 de 7 (1 sin verificar) | 17 a 99 |
| Firmas medianas | 7 | 0 de 7 | 5 de 7 | 57 a 70 |
| **JJMM** | — | No (pero publica "S/ 10.00" por trabajador adicional, contra su propia regla) | **No: 0 enlaces** | **56** |

El mínimo común que surge de los tres segmentos es claro: WhatsApp con mensaje precargado, servicios visibles en texto con página propia, cifras de trayectoria en la portada, una oferta de entrada de bajo compromiso ("consulta" o "diagnóstico sin costo"), un proceso de trabajo explicado en pocos pasos y HTTPS. JJMM cumple solo las cifras (más de 100 clientes, más de 100 requerimientos de SUNAT, más de 10 años, más de 20 empresas constituidas) y el HTTPS; su "ASESORÍA GRATUITA", la promesa más fuerte del sitio, está dentro de una imagen y no tiene botón ([CRITICA.md](../CRITICA.md)).

## WhatsApp a un toque es la norma y JJMM tiene cero enlaces

El canal de captación del rubro en Lima es WhatsApp, y los mejores sitios lo usan con precisión. Líderes Contables pone un botón flotante y una CTA "QUIERO COTIZAR" por plan con texto prellenado distinto, por ejemplo "Hola, Líderes Contables, quiero más información del plan Pyme en Crecimiento" ([Líderes Contables](https://www.liderescontables.com/)); DeContador hace lo mismo y suma un chat con el contador "Sebastian Taya" y su horario ([DeContador](https://decontador.com/servicio-contable-online/)). **GCF Contadores tiene el camino más completo del mercado**: WhatsApp precargado en el hero, en los servicios, en el cierre y en el pie, un botón flotante, enlaces `tel:` en cuatro lugares y un formulario de seis campos que pide "Teléfono o WhatsApp" y deja el correo como opcional ([GCF](https://gcfcontadores.com/)). Esa última decisión encaja mejor con una MYPE peruana que el formulario clásico centrado en el correo.

| Sitio | WhatsApp | Prellenado por plan o servicio | Botón flotante | `tel:` tocable | Otra vía |
|---|---|---|---|---|---|
| **JJMM** | **No** | No | No | **No** | Formulario roto (404) y `mailto` en la barra superior |
| Líderes Contables | Sí | Sí, por plan | Sí | Sí | Formulario con reCAPTCHA |
| Netamente | Sí | — | Sí | Sí | Formulario que termina en WhatsApp |
| Grupo JC | Sí | Contextual ("Recibí un requerimiento") | — | No | Popup a pantalla completa en móvil |
| Lidercontab | No | — | No | No | Solo teléfonos en texto |
| Milian | No | — | No | No | Solo fijos en texto |
| DeContador | Sí | Sí, por plan | Chat | Sí | Formulario con selector de servicio |
| TuEstudioContable | Sí | Sí, desde una calculadora | — | No confirmado | Calculadora de honorarios de 3 preguntas |
| Viringo | No | — | No | No | Agenda embebida de 20 minutos (cal.com) |
| GCF Contadores | Sí | Sí | Sí | Sí | Formulario "Teléfono o WhatsApp" |
| Crececont | Sí | Sí | — | Sí | "Agenda un diagnóstico empresarial" |
| S&M Contadores | Sí | — | Sí | No | Chat con selector de servicio |
| ACG | Roto (enlace a "#") | — | — | No | Anclas "Agenda una cita" |

Fuentes: [Netamente](https://netamentecontable.com/), [Grupo JC](https://grupojc.com.pe/), [Lidercontab](https://lidercontab.com/), [Milian](https://www.estudiomilian.com.pe/), [TuEstudioContable](https://www.tuestudiocontable.com/), [Viringo](https://www.tuviringo.com/), [Crececont](https://crececont.pe/), [S&M](https://symcontadores.com/), [ACG](https://www.acg.com.pe/).

El patrón que separa a los mejores del resto es el **mensaje prellenado con el nombre del plan**: le dice al estudio qué le interesa al visitante sin obligarlo a llenar un formulario. Para JJMM, que ya tiene planes con nombre propio (Emprende, SIGEMype I, SIGEMype II, SIGEMype Business), esto es directo de implementar y cumple el principio "el contacto primero" de `PRODUCT.md`. Nadie en el segmento tradicional ni mediano ofrece agenda en línea real; "Agendar" casi siempre abre WhatsApp o un ancla ([S&M](https://symcontadores.com/), [ACG](https://www.acg.com.pe/)). Solo Viringo embebe un calendario, y lo paga con un efecto lateral: no ofrece WhatsApp ni teléfono antes de la venta ([Viringo](https://www.tuviringo.com/)). Un dato de mantenimiento también vale como advertencia: los fallos de contacto son comunes incluso en firmas grandes (ACG con el WhatsApp a "#", Consulting Perú con "Get A Quote" a "#", Servicontal con la codificación del mensaje rota), lo que confirma que basta con un contacto que funcione en todas las páginas para ponerse por delante ([Consulting Perú](https://consultingperu.com.pe/), [Servicontal](https://www.servicontalsac.com/)).

## La mitad del mercado publica precios, pero los medianos no

Los precios dividen a la competencia por segmento. Los servicios en línea publican todos (7 de 7), con planes de entrada entre **S/ 50 y S/ 300 al mes** y planes con planilla entre S/ 290 y S/ 600 ([TuEstudioContable](https://www.tuestudiocontable.com/), [Tu Contador Mype](https://tucontadormype.com/), [Viringo](https://www.tuviringo.com/)). Entre los tradicionales publican 3 de 8, en un rango de **S/ 150 a S/ 400**: Líderes Contables desde S/ 150, S/ 250 y S/ 400; Carmanger S/ 200, S/ 300 y S/ 400 "más IGV" con opción anual; Grupo JC "Desde S/ 390 + IGV al mes" ([Líderes Contables](https://www.liderescontables.com/), [Carmanger](https://carmanger.pe/), [Grupo JC](https://grupojc.com.pe/)). Las firmas medianas no publican ninguno y en su lugar explican qué determina el honorario: régimen tributario, volumen mensual de comprobantes, trabajadores en planilla y meses atrasados ([S&M](https://symcontadores.com/), [GCF](https://gcfcontadores.com/), [Consulting Perú](https://consultingperu.com.pe/)).

Más importante que el monto es la forma. **Ningún competidor usa una tabla comparativa ancha como la de JJMM** (4 planes por 22 filas, texto de 10 px en el celular y botones "Solicitar" que miden 0×0 ([CRITICA.md](../CRITICA.md))). El patrón dominante son 3 o 4 tarjetas, cada una con un dato ancla que el dueño reconoce sin saber de regímenes (ventas mensuales o anuales, número de comprobantes, trabajadores) y una CTA de WhatsApp propia. Red Económica traduce los tramos en UIT a soles mensuales ([Red Económica](https://redeconomica.pe/assets/contabilidad/index.html)) y Viringo publica hasta los cargos extra ("El precio que ves es el que pagas"), incluido el costo de poner al día meses atrasados ([Viringo](https://www.tuviringo.com/)). El precio también trabaja para la búsqueda: el dominio que más se repitió en las búsquedas comerciales, tuestudiocontable.com, lleva "desde S/ 50" en el `<title>` y tiene una página "¿Cuánto Cobra un Contador en Perú? Precios 2026" ([TuEstudioContable precios](https://www.tuestudiocontable.com/precios-contador/)).

| | JJMM | Líderes Contables | Carmanger | Grupo JC | Viringo | Tu Contador Mype | Crececont / S&M / GCF |
|---|---|---|---|---|---|---|---|
| Formato | Tabla de 22 filas | 3 tarjetas | 3 tarjetas, mensual/anual | Selector por perfil | 3 tarjetas, mensual/trimestral/anual | 4 tarjetas | Cotización a medida |
| Precio | "Consultar" (y "S/ 10.00" por trabajador) | Desde S/ 150 | S/ 200 + IGV | Desde S/ 390 + IGV | S/ 219 + IGV (anual) | S/ 190, IGV incluido | No publicado |
| Criterio para elegir | Lista de características | Tope de ventas anuales | Tope de ventas mensuales | Tamaño de empresa | Ventas, comprobantes, trabajadores | Ventas, comprobantes, régimen | Variables del honorario explicadas |
| CTA por plan | "Solicitar" invisible en móvil | WhatsApp prellenado | "Más información" | "Ver planes" | Agenda | "Elegir mi plan" | "Cotizar servicio" |

**Esto es una decisión para el estudio, no algo que el rediseño deba cambiar por su cuenta.** `PRODUCT.md` fija que los planes muestran "Consultar" y que no se publican montos. La evidencia admite dos caminos legítimos. El primero mantiene la regla y sigue el modelo de las firmas medianas, que son el segmento al que JJMM se parece por tamaño: tarjetas con dato ancla, "Consultar" y una lista explícita de qué determina el honorario, como hacen S&M y GCF. El segundo publica un "desde S/ X + IGV" por plan, como Líderes Contables y Carmanger, lo que alinea a JJMM con el segmento que persigue a su mismo cliente y abre la puerta a una página de precios con valor para la búsqueda. En cualquiera de los dos casos, el "S/ 10.00" por trabajador adicional que hoy figura en los cuatro planes contradice la regla vigente y debe retirarse o convertirse en una decisión explícita.

## SIGE Mype puede ser el argumento que casi nadie tiene

Casi todos los competidores titulan con la categoría ("Estudio Contable", "Servicios de contabilidad") en lugar de hablarle al miedo concreto del dueño. Los que mejor lo hacen convierten a SUNAT en el antagonista: Grupo JC abre con "Estudio contable en Lima que da la cara por ti" y promete responder "cuando SUNAT o SUNAFIL fiscalizan" ([Grupo JC](https://grupojc.com.pe/)); Viringo pregunta "Si vives peleando con SUNAT, ¿quién está haciendo crecer tu empresa?" ([Viringo](https://www.tuviringo.com/)); GCF arranca con "¿Te preocupa una multa de SUNAT, no saber cuánto vas a pagar o que tu contador no te responda?" ([GCF](https://gcfcontadores.com/)). JJMM, en cambio, le habla a ese mismo dueño de un "Sistema de Calidad Genuino", y su lema está dentro de una imagen ([CRITICA.md](../CRITICA.md)). Grupo JC suma un recurso que encaja con el problema de JJMM: un **selector por perfil** en el hero ("Tengo una MYPE / Dirijo una mediana o gran empresa / Aún no decido") que resuelve en una pantalla lo que la tabla de 22 filas no logra.

El referente más útil para SIGE Mype es Crececont. Su **"Ciclo Integral Crececont"** nombra el método, lo divide en seis etapas con verbos que el dueño reconoce (Crear, Instalarse, Ordenar, Operar, Recuperar, Crecer), da una frase de beneficio por etapa ("Información oportuna, responsables definidos y obligaciones controladas") y argumenta por qué conviene un solo proveedor: "Cuando cada necesidad es atendida por un proveedor diferente aumentan la descoordinación, las demoras y los riesgos" ([Crececont](https://crececont.pe/)). Es exactamente lo que le falta a la rueda de nueve áreas de JJMM, que hoy esconde ocho áreas detrás de clics sin pista y cuyos nueve "Ver Servicio" terminan en 404 ([CRITICA.md](../CRITICA.md)). Enfoque Contable muestra el otro lado: tiene logos de ISO 9001, 22301, 27001 y 37001, pero no explica qué ganan sus clientes con ellos ([Enfoque Contable](https://www.enfoquecontableperu.com/)). Nadie en el mercado convierte un sistema de calidad en un argumento comprensible, y ese es el espacio que SIGE Mype puede ocupar, siempre que el sistema funcione como capa narrativa y no reemplace la navegación: el patrón probado es una página por servicio (Líderes, S&M, GCF, Lidercontab) con las áreas visibles en texto ([S&M](https://symcontadores.com/), [Lidercontab](https://lidercontab.com/)). Para que la explicación sea creíble basta con el "proceso en cuatro pasos" que ya es estándar del segmento, con dos agregados que diferencian: plazos concretos, como el "diagnóstico sin costo en 24 a 48 horas" de Intelectta, y el caso de quien "viene de otro contador", que Crececont atiende de forma explícita ([Intelectta](https://intelectta.pe/), [Crececont outsourcing](https://crececont.pe/servicio/outsourcing-contable-y-tributario/)).

## La prueba social del rubro está rota, y eso favorece al que publica solo hechos

La confianza es donde el mercado más falla, y donde JJMM puede ganar sin inventar nada. Las mejores pruebas observadas son pocas: Líderes Contables incrusta **reseñas de Google** con respuestas del propietario ([Líderes Contables](https://www.liderescontables.com/)); ACG publica casos de éxito con cliente, fecha y problema (por ejemplo, Telefónica en 2017–2018, trazabilidad ante una fiscalización de SUNAT) y testimonios en video de gerentes generales ([ACG](https://www.acg.com.pe/)); Viringo ofrece una garantía concreta: el primer mes trabaja en paralelo con el contador actual y, si su resultado "no cuadra, te devolvemos el mes completo" ([Viringo](https://www.tuviringo.com/)). El resto se debilita a sí mismo: Grupo JC publicó su equipo con marcadores sin rellenar ("Matrícula CPC [N°]", "Responsable: [Nombre, cargo]") ([Grupo JC](https://grupojc.com.pe/)); S&M y Contador Mype muestran contadores animados que se quedan en "0" ([S&M](https://symcontadores.com/), [Contador Mype](https://contadormype.pe/)); Netamente se contradice entre "56 empresas" y "más de 50", y entre 12 y 8 años ([Netamente](https://netamentecontable.com/)); Enfoque Contable publica "97 %", "86 %" y "72 %" sin fuente y logos de prensa con archivos que no coinciden ([Enfoque Contable](https://www.enfoquecontableperu.com/)). La lección es directa: **una prueba incompleta o falsa resta más de lo que suma**.

`PRODUCT.md` prohíbe inventar testimonios, cifras, fotos o número de colegiatura, y deja a JJMM con cuatro cifras reales y 11 logos de clientes. Eso alcanza para competir si se presenta bien (las cifras son lo mejor del sitio actual, según [CRITICA.md](../CRITICA.md)), pero la prueba social más fuerte del mercado requiere material que solo el estudio puede producir. Ninguno de los sitios en línea muestra razón social y RUC en la portada ([Viringo](https://www.tuviringo.com/), [TuEstudioContable](https://www.tuestudiocontable.com/)) y casi nadie publica un número de colegiatura CPC completo, así que JJMM, como S.A.C. registrada, puede diferenciarse con datos que ya tiene y que no requieren inventar nada. El resto son decisiones para el estudio: pedir reseñas de Google a clientes reales por sede, documentar casos con el permiso del cliente, fotografiar al equipo y las sedes, y publicar la matrícula de sus contadores.

En contenido, el hueco es todavía más claro. Netamente publica casi a diario, S&M y GCF mantienen blogs activos en octubre de 2026 y GCF tiene un artículo "Cronograma de vencimientos SUNAT: fechas para IGV y renta" ([Netamente blog](https://netamentecontable.com/blog/), [GCF](https://gcfcontadores.com/)), pero **ningún competidor ofrece un calendario de vencimientos interactivo por último dígito del RUC**. JJMM ya tiene la materia prima en su guía de clientes, hoy encerrada en tres imágenes JPG ilegibles en el celular, y su blog muestra publicaciones "Prueba 1" y un artículo sobre requisitos de 2021 presentado como vigente ([CRITICA.md](../CRITICA.md)). Las herramientas útiles escasean y destacan: la calculadora de honorarios de TuEstudioContable termina en un WhatsApp prellenado, y DeContador ofrece calculadoras de CTS, gratificaciones e IGV ([TuEstudioContable](https://www.tuestudiocontable.com/), [DeContador](https://decontador.com/servicio-contable-online/)).

## JJMM es el más pesado de los medidos y no aparece fuera de su marca

En rendimiento móvil la competencia no es un muro: tres de los nueve sitios medidos cargan su contenido principal más lento que JJMM. Pero JJMM pesa más del doble que cualquiera de ellos, tiene la segunda peor accesibilidad y queda claramente por detrás de los dos sitios en línea mejor construidos.

| Sitio | Rendimiento | Accesibilidad | SEO | LCP | Peso |
|---|---|---|---|---|---|
| Viringo | 99 | 100 | 100 | 1,7 s | 2,3 MB |
| DeContador | 92 | 92 | 100 | 2,9 s | 0,3 MB |
| Enfoque Contable | 70 | 93 | 85 | 4,4 s | 2,7 MB |
| S&M Contadores | 64 | 85 | 100 | 5,4 s | 1,6 MB |
| Crececont | 57 | 95 | 100 | 6,3 s | 2,1 MB |
| Netamente | 60 | 94 | 85 | 8,4 s | 1,2 MB |
| **JJMM** | **56** | **74** | **85** | **9,8 s** | **7,7 MB** |
| Tu Contador Mype | 17 | 70 | 92 | 13,1 s | 2,4 MB |
| Carmanger | 58 | 93 | 77 | 17,2 s | 3,7 MB |
| Líderes Contables | 36 | 86 | 92 | 20,7 s | 2,7 MB |

Medición propia con Lighthouse 12.2.1, perfil móvil, una ejecución por portada, 25/11/2026; JJMM según [CRITICA.md](../CRITICA.md). Sitios: [Viringo](https://www.tuviringo.com/), [DeContador](https://decontador.com/), [Enfoque Contable](https://www.enfoquecontableperu.com/), [S&M](https://symcontadores.com/), [Crececont](https://crececont.pe/), [Netamente](https://netamentecontable.com/), [Tu Contador Mype](https://tucontadormype.com/), [Carmanger](https://carmanger.pe/), [Líderes Contables](https://www.liderescontables.com/).

El listón técnico alcanzable es concreto: con una portada de menos de 2 MB y un LCP inferior a 4 s, JJMM superaría a todos los estudios tradicionales y firmas medianas medidos; solo Viringo y DeContador quedarían por delante. El sitio actual pierde 4,5 MB solo con imágenes adaptadas al tamaño y carga cuatro copias de jQuery ([CRITICA.md](../CRITICA.md)), así que el margen está en la construcción, no en el contenido.

La visibilidad en búsqueda es el problema más silencioso. En las seis búsquedas comerciales ejecutadas, el dominio más repetido fue tuestudiocontable.com (4 de 6), seguido de S&M y Lidercontab; **sigemype.com no apareció en ninguna** ([TuEstudioContable](https://www.tuestudiocontable.com/), [S&M San Isidro](https://symcontadores.com/estudio-contable-en-san-isidro/)). En la búsqueda de su propia marca, LinkedIn, Indeed y directorios salen antes que el sitio, cuyo resultado se titula solo "JJMM" ([LinkedIn](https://www.linkedin.com/in/estudio-contable-jjmm-970656a4/?_l=en), [Indeed](https://pe.indeed.com/cmp/Estudio-Contable-Jjmm-S.a.c.)). La causa es técnica y corregible: el sitio no tiene `sitemap.xml` (responde 404), no tiene datos estructurados de negocio local, su canonical apunta al dominio antiguo jjmm.com.pe y el `<title>` es el mismo en todas las páginas ([sitemap.xml](https://sigemype.com/sitemap.xml), [CRITICA.md](../CRITICA.md)). El competidor más visible tiene justo lo contrario: JSON-LD `AccountingService` y `FAQPage`, y una página por intención (inicio, outsourcing, precios, ciudades) ([TuEstudioContable](https://www.tuestudiocontable.com/)). S&M publica páginas por distrito para San Isidro y Miraflores ([S&M Miraflores](https://symcontadores.com/estudio-contable-en-miraflores/)), y en San Martín de Porres los resultados visibles son páginas de Facebook y sitios pequeños ([Líderes Contables en Facebook](https://www.facebook.com/estudioliderescontables/), [María Romero](https://www.estudiocontablemariaromero.com/)): es la búsqueda local más alcanzable para JJMM.

Hay además un problema de identidad que el rediseño debe resolver antes de publicar páginas por sede. Los datos de contacto se contradicen entre fuentes: (01) 480-0125 frente a (01) 425-0125, Jr. Iquitos 593 frente a 591 en la Ficha RUC de 2018, un celular de Miraflores con un dígito de más ("+51 946 068 4372") y dos páginas de Facebook distintas ([Ficha RUC](https://connectamericas.com/sites/default/files/company_files/1.-Ficha.Ruc-EST-CONT-JJMM%2003.01.2018.pdf), [sigemype.com](https://sigemype.com/), [Facebook jjmm](https://www.facebook.com/jjmm-181508565240013/)). `PRODUCT.md` registra dos sedes y dos celulares, mientras que producción muestra una tercera sede en Miraflores.

## Qué adoptar, qué evitar y qué aprovechar

Las recomendaciones se ordenan por el efecto esperado sobre el objetivo del sitio (que el visitante escriba o llame) y respetan las restricciones de `PRODUCT.md`. Las que chocan con esas restricciones se presentan aparte, como decisiones del estudio.

**Adoptar** (patrones probados en la competencia y compatibles con `PRODUCT.md`):

| Qué | Quién lo hace bien | Cómo se aplica a JJMM |
|---|---|---|
| WhatsApp flotante + `tel:` en cada sede + mensaje prellenado por plan | GCF, Líderes Contables, DeContador | Barra fija con WhatsApp y Llamar a los celulares 951 965 242 y 952 249 102; CTA por plan con el nombre del plan en el mensaje |
| Hero centrado en el problema del dueño, con selector por perfil | Grupo JC, Viringo, GCF | Hablar de SUNAT, multas y orden; "Asesoría gratuita" como botón principal, si es una oferta real |
| Método con nombre, en etapas, con una línea de beneficio por etapa | Crececont ("Ciclo Integral") | Las nueve áreas de SIGE Mype visibles en texto, cada una con su beneficio y su página; la rueda como ilustración |
| Planes en tarjetas con dato ancla | Líderes Contables, Tu Contador Mype, Viringo | 4 tarjetas con el criterio que ayude a elegir y un "ver todo lo que incluye" desplegable |
| Proceso de trabajo en 4 pasos con plazos | Intelectta, Crececont | Incluir el caso de quien cambia de contador |
| Una página por intención y por sede, con datos estructurados | TuEstudioContable, S&M, GCF | Páginas de servicio y de sede con `AccountingService`, `<title>` único, sitemap y canonical a sigemype.com |
| Vencimientos en HTML | GCF (como artículo) | Convertir la guía de imágenes en un calendario por último dígito del RUC |

**Evitar** (errores observados en la competencia que el rediseño no debe repetir):

| Error | Dónde se vio |
|---|---|
| Contadores animados que dependen de JavaScript y se quedan en "0" | S&M, Contador Mype |
| Marcadores sin rellenar o cifras que se contradicen entre secciones | Grupo JC, Netamente, Crececont, Lidercontab |
| Contenido con fecha que vence sin mantenimiento ("cupos abren en octubre de 2026") | Viringo |
| Popups a pantalla completa en el celular | Grupo JC |
| Botones de contacto a "#" o enlaces de plantilla sin destino | ACG, Consulting Perú, Enfoque Contable, Carmanger |
| Certificaciones o métricas mostradas sin explicar qué significan | Enfoque Contable |
| Eliminar WhatsApp y teléfono para forzar una agenda | Viringo, Contadeus |
| Restos de plantilla: copyright viejo, erratas, redes que apuntan a facebook.com genérico | Servicontal, Lidercontab, Contador Mype |

**Aprovechar** (huecos que ningún competidor revisado cubre bien):

| Hueco | Por qué JJMM puede ocuparlo |
|---|---|
| Calendario interactivo de vencimientos SUNAT por último dígito del RUC | Ya produce los vencimientos para sus clientes; genera visitas recurrentes cada mes |
| Un sistema de calidad explicado en lenguaje del dueño | SIGE Mype es propio; el único rival con ISO no lo explica |
| Identidad legal visible (razón social, RUC, sedes reales) | Ningún servicio en línea la muestra en la portada |
| Velocidad | Con menos de 2 MB y LCP bajo 4 s supera a todos los tradicionales y medianos medidos |
| Búsqueda local en San Martín de Porres | La competencia visible son páginas de Facebook y sitios pequeños |
| Guía "¿qué régimen me conviene?" | Ningún competidor la ofrece en la portada |

**Decisiones del estudio**, donde la evidencia del mercado discute una restricción de `PRODUCT.md`:

| Decisión | Restricción vigente | Evidencia | Opciones con su costo |
|---|---|---|---|
| Publicar precio orientativo | "Consultar"; no se publican montos | 7 de 7 en línea y 3 de 8 tradicionales publican; 0 de 7 medianos; el precio en el `<title>` acompaña al dominio más visible | Mantener "Consultar" y explicar las variables del honorario (modelo S&M/GCF), o publicar "desde S/ X + IGV" (modelo Líderes/Carmanger). Además, resolver el "S/ 10.00" que hoy contradice la regla |
| Construir prueba social | No inventar testimonios, fotos ni colegiatura | Las pruebas más fuertes son reseñas de Google, casos con cliente y equipo con nombre | Pedir reseñas reales por sede, casos con permiso del cliente, fotos del equipo y matrícula CPC; mientras tanto, solo las 4 cifras y los 11 logos |
| Ofrecer una garantía o diagnóstico de entrada | No figura en `PRODUCT.md` | Diagnóstico sin costo en casi todas las firmas medianas; garantía de devolución en Viringo | Confirmar si "Asesoría gratuita" es una oferta real y con qué alcance |
| Sedes y marca | Dos sedes y dos celulares en `PRODUCT.md` | Producción muestra Miraflores; los datos de contacto se contradicen entre fuentes | Fijar sedes, celular por sede, dirección exacta (593 o 591) y marca principal (JJMM, Mariñas & Asociados o SIGE Mype) |

## Lo que esta investigación no pudo ver

Los resultados tienen límites que conviene conocer antes de usarlos para decidir. **No se pudieron leer los resultados de Google Perú ni Google Maps**: el navegador automatizado recibió un CAPTCHA (HTTP 429), así que no hay posiciones reales en Google.com.pe, ni datos del bloque de resultados locales, ni calificaciones o número de reseñas de ningún perfil de Google Business, tampoco el de JJMM. El "ranking" de visibilidad viene de un buscador genérico con sesgo hacia EE. UU. y sirve para ver quién aparece, no para medir posiciones; las cifras de reseñas que declaran S&M ("93 reseñas" en la portada, "40" en una página de distrito) son autodeclaradas y no se verificaron. **El diseño visual casi no se inspeccionó con capturas de pantalla**: los juicios sobre plantillas, fotografía y tipografía de los competidores se infieren del texto y de la estructura de las páginas, y solo Viringo y algunos sitios tradicionales se renderizaron a 390 px para revisar desbordes y enlaces. **Lighthouse se midió una sola vez por sitio y solo en 9 competidores** (3 por segmento); una sola ejecución varía entre 5 y 10 puntos, por lo que las cifras sirven para ordenar y no como valores exactos, y quedaron sin medir Grupo JC, Lidercontab, Milian, Servicontal, Contadeus, ACG, Consulting Perú, GCF, Intelectta y otros. Tampoco se envió ningún formulario, no se obtuvieron volúmenes de búsqueda ni datos de Google Trends, Crowe Perú bloqueó la lectura y micontable.pe no resolvió su dominio. Antes de cerrar el brief del rediseño, conviene revisar a mano, desde un navegador en Lima, las fichas de Google Maps de JJMM y de sus rivales directos.

## Conclusión

El hallazgo que cambia la prioridad del rediseño es que la competencia no gana por tener mejores sitios, sino por tener sitios que no se rompen en el momento de contactar. El mercado de Lima tiene un listón bajo y desordenado: precios publicados con fallos de rendimiento, pruebas sociales con marcadores sin rellenar y botones de WhatsApp que llevan a "#". Por eso la ventaja de JJMM no está en copiar a un competidor en particular, sino en reunir piezas que hoy están repartidas: el contacto de GCF, el método con nombre de Crececont, los planes con dato ancla de Líderes Contables y la velocidad de Viringo, más dos huecos que nadie llena, el calendario de vencimientos y un sistema de calidad explicado al dueño.

La segunda conclusión es que las restricciones de `PRODUCT.md` no impiden competir, pero sí definen contra quién. Si el estudio mantiene "Consultar" y no tiene testimonios, su referencia natural son las firmas medianas, y deberá compensar con transparencia sobre el honorario, cifras reales bien presentadas e identidad legal visible. Si decide publicar un precio orientativo y reunir reseñas reales, entra a disputar el terreno de los servicios en línea, que persiguen exactamente a su cliente principal. Esa elección, junto con la definición de sedes, celulares y marca, conviene tomarla antes de diseñar, porque determina la estructura de la página de inicio, de los planes y de las páginas por sede.
