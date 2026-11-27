# ADR 0002: Caché de lecturas y revalidación al publicar

- Estado: aceptada (27/11/2026, T12)
- Specs: S3 (y S2, S8 como restricciones) de `../../../odd/tasks/rediseno-sitio-jjmm.md`

## Contexto

Hasta T11 cada página pública se armaba en cada petición y consultaba PostgreSQL varias veces (configuración, menú, sedes, secciones, listas). S3 pide rendimiento; S2 pide que un cambio en el panel se vea sin volver a desplegar. Además, la compilación debe seguir sin base de datos (la CI y Railway compilan sin ella).

## Opciones evaluadas (Next 16.4, Payload 3.94)

1. **Cache Components (`cacheComponents: true`, `'use cache'`, `cacheTag`).** Es estable en Next 16, pero no es un cambio de una línea: reemplaza `dynamic`, `revalidate` y `fetchCache` de todas las rutas, exige `<Suspense>` alrededor de datos sin caché y obliga a revisar las rutas generadas de Payload (`src/app/(payload)`), que no se editan. Demasiado riesgo para la ganancia en un sitio de pocas páginas.
2. **ISR por ruta (`revalidate` + `revalidatePath`).** Las rutas estáticas (`/`, `/guia`, `/blog`) se prerenderizarían al compilar y necesitarían la base de datos.
3. **HTML dinámico + caché de datos con etiquetas (`unstable_cache` + `revalidateTag`).** Elegida.

## Decisión

- El HTML se sigue armando en cada petición (`force-dynamic` en el layout de `(frontend)` y en `sitemap.ts`): la compilación no toca la base. Dibujar React en el servidor es barato frente a las consultas.
- Cada lectura de un adaptador de Payload pasa por `leerEnCache` (`unstable_cache`), con etiquetas de todo lo que trae: `coleccion:<slug>`, `global:<slug>` y `documento:publicaciones:<slug>`. El detalle de una publicación lleva además `coleccion:publicaciones`, porque su contenido puede enlazar a otras publicaciones por su slug: si una enlazada se renombra o se despublica, el enlace no debe quedar roto. La documentación de `unstable_cache` en Next 16 recomienda migrar a `'use cache'` con Cache Components, y la mantiene para datos que no vienen de `fetch`. Migrar es un cambio local: solo `lectura-en-cache.ts` conoce la API.
- `force-dynamic` no apaga `unstable_cache`: en Next 16.4 la caché solo se omite con `fetchCache = 'force-no-store'`, en modo borrador o en una revalidación a pedido (`server/web/spec-extension/unstable-cache.js`).
- Los hooks `afterChange` / `afterDelete` de colecciones y `afterChange` de globales invalidan con `revalidateTag(etiqueta, { expire: 0 })`. `{ expire: 0 }` es lo que la documentación de `revalidateTag` indica para invalidar desde un Route Handler (las peticiones REST del panel): la siguiente visita lee de la base, no recibe la versión vieja. `updateTag` solo existe en Server Actions.
- Se adjuntan en un solo lugar, `src/contenido.ts`, y `src/contenido.test.ts` prueba que toda colección y global que el sitio lee los tiene. `mensajes-de-contacto` y `usuarios` quedan fuera: el sitio no los lee, y revalidar desde la Server Action del formulario refrescaría la página del visitante.

### Borradores de publicaciones

En Payload, `previousDoc` es la **última versión**, que puede ser un borrador, y un borrador no toca la fila principal (la que lee el público). Por eso, en una colección con borradores, un hook `beforeChange` lee la fila principal antes del cambio (estado público y slug) y la deja en el contexto de la petición. Después del cambio se invalida si el documento queda publicado o si era público antes. Resultados:

| Cambio                                              | ¿Invalida?                                      |
| --------------------------------------------------- | ----------------------------------------------- |
| Crear o guardar un borrador de algo nunca publicado | No                                              |
| Publicar                                            | Sí: listado, slug nuevo y el que era público    |
| Despublicar (aunque haya un borrador pendiente)     | Sí                                              |
| Guardar un borrador sobre una publicación publicada | Sí (de más, pero inofensivo: se relee lo mismo) |
| Borrar                                              | Siempre                                         |

Si el slug cambió, se invalida también el slug que era público, para que la URL anterior deje de servir la versión vieja.

## Carreras y límites

- **Orden con la transacción.** `revalidateTag` solo anota la etiqueta; Next la aplica al terminar el Route Handler, después de que Payload confirma la transacción. Una lectura posterior ve los datos nuevos.
- **Lectura en curso al publicar.** Si una petición leyó la base antes de confirmar y guarda su resultado después de la invalidación, esa entrada vieja queda como fresca. La ventana dura lo que una consulta (milisegundos). La acota la red de seguridad: toda entrada se renueva como máximo cada 10 minutos (`REVALIDACION_DE_RESPALDO_EN_SEGUNDOS`).
- **Cambios fuera del panel.** La carga inicial (`payload run`, fuera de Next) apaga los hooks con `CONTEXTO_SIN_REVALIDACION`, porque `revalidateTag` falla sin petición de Next; lo mismo un cambio directo en la base. En ambos casos rige la red de seguridad.
- **Varias instancias.** La caché de datos vive en el disco de cada instancia. Con una sola instancia en Railway basta; con más, hace falta un `cacheHandler` compartido.
- **Despliegue.** Railway arranca sin el disco anterior: la caché empieza vacía en cada despliegue.

## Consecuencias

- Una página pública consulta PostgreSQL solo la primera vez después de un cambio o cada 10 minutos.
- Una lectura nueva debe declarar sus etiquetas, incluidas las de lo que puebla con `depth`. Olvidarla deja datos viejos hasta 10 minutos.
- Las respuestas de los adaptadores se guardan como JSON.
