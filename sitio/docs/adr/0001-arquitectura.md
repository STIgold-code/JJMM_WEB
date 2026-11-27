# ADR 0001: Arquitectura por módulos y capas

- Estado: aceptada (27/11/2026, T3)
- Specs: S4 y S8 de `../../../odd/tasks/rediseno-sitio-jjmm.md`

## Contexto

S8 pide buenas prácticas verificables: nada de God Components y principios SOLID. El proyecto lo escribe Claude Code, así que cada regla tiene que estar en el código y fallar en `pnpm lint` o `pnpm test`, no depender de la memoria de quien escribe.

## Decisión

### Módulos de negocio

El código grita el negocio, no el framework. Cada área del sitio es un módulo en `src/modulos/<modulo>/` (portada, servicios, planes, sedes, avisos, vencimientos, blog, navegacion, usuarios…). Lo que usan varios módulos vive en `src/compartido/`. Las rutas de Next viven en `src/app/` y solo componen módulos.

Un módulo crea solo las capas que necesita:

```
src/modulos/vencimientos/
  dominio/          vencimiento.ts, calcular-fecha.ts (+ .test.ts)
  aplicacion/       listar-vencimientos.ts, repositorio-vencimientos.ts
  infraestructura/  coleccion-vencimientos.ts, repositorio-vencimientos-payload.ts
  componentes/      seccion-vencimientos.tsx, tabla-vencimientos.tsx
```

### Capas y dirección de dependencias

| Capa               | Contiene                                                                     | No puede importar                                                                                        |
| ------------------ | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `dominio/`         | Tipos y reglas puras                                                         | Payload, `@payload-config`, `payload-types`, React, Next, `aplicacion`, `infraestructura`, `componentes` |
| `aplicacion/`      | Casos de uso e interfaces de repositorio                                     | Payload, `@payload-config`, `payload-types`, React, Next, `infraestructura`, `componentes`               |
| `infraestructura/` | Colecciones, bloques y adaptadores de Payload que implementan las interfaces | —                                                                                                        |
| `componentes/`     | Contenedores y componentes de presentación                                   | `payload`, `@payloadcms/*`, `@payload-config`                                                            |

Las dependencias apuntan hacia adentro: `componentes → aplicacion → dominio` e `infraestructura → aplicacion/dominio`. Los contenedores de `componentes/` son la raíz de composición: unen un caso de uso con su adaptador. Los tipos generados (`@/payload-types`) se permiten en `componentes/` e `infraestructura/` para tipar los datos de los bloques.

`eslint.config.mjs` lo hace cumplir con `no-restricted-imports` por capa, y `src/limites-de-capas.test.ts` prueba que la regla falla con cada importación prohibida.

### Inversión de dependencias (D)

Los casos de uso reciben su repositorio por parámetro y se prueban con un doble, sin base de datos:

```ts
// aplicacion/repositorio-vencimientos.ts
export interface RepositorioVencimientos {
  listarDelMes(anio: number, mes: number): Promise<readonly Vencimiento[]>
}

// aplicacion/listar-vencimientos.ts
export function crearListarVencimientos(repositorio: RepositorioVencimientos) {
  return (anio: number, mes: number) => repositorio.listarDelMes(anio, mes)
}

// infraestructura/repositorio-vencimientos-payload.ts implementa RepositorioVencimientos con getPayload().
```

No se crean repositorios genéricos ni interfaces sin un caso de uso real: el primer módulo de negocio (T4) introduce el suyo.

### Contenedor y presentación

- El contenedor es un Server Component: obtiene los datos con un caso de uso y los prepara.
- El componente de presentación solo recibe props chicas y dibuja; no importa casos de uso ni adaptadores.
- `"use client"` solo en piezas interactivas (slider, menú móvil, rueda con pestañas, selector de plan y formulario).

### Registro de bloques (O y L)

Las secciones de página son bloques de Payload. `src/compartido/componentes/bloques/` define:

- `BloqueBase` y `PropsDeBloque<B>`: todo componente de bloque recibe `{ bloque }` y nada más, así que son intercambiables (L).
- `RegistroDeBloques<B>`: tipo mapeado `blockType → componente`. Exige una entrada por cada variante de la unión de bloques; olvidar una es un error de compilación.
- `RenderizadorDeBloques`: Server Component que dibuja la lista en orden buscando cada tipo en el registro.

Agregar un bloque (O): el módulo crea su `Block` de Payload en `infraestructura/` y su componente en `componentes/`; la unión de tipos sale de `payload-types.ts`, y el registro de la página suma una entrada. Ningún bloque existente cambia.

**Tipo sin registrar.** Solo ocurre con datos guardados de un bloque que ya se quitó del código. El renderizador lanza `TipoDeBloqueDesconocidoError` en lugar de omitir la sección sin aviso. Motivo: con ISR, si la regeneración falla Next sigue sirviendo la última versión válida, y el error queda en los registros. Por eso, quitar un bloque exige una migración que limpie sus datos.

### Límites de tamaño

ESLint como error en `src/**/*.{ts,tsx}`: 150 líneas por archivo, 40 por función, complejidad 10, sin `any`. Superarlos exige dividir, no desactivar la regla.

### Nombres

Español y kebab-case. Las colecciones se exportan como `coleccion<Nombre>` desde `coleccion-<nombre>.ts`, con slug en español y en plural (`usuarios`, `medios`). Los nombres que exige el framework se respetan.

## Consecuencias

- El dominio y los casos de uso se prueban con Vitest sin Payload ni base de datos.
- Cambiar Payload por otra fuente toca solo `infraestructura/`.
- Hay más archivos por módulo; a cambio, cada uno tiene un solo motivo de cambio y cabe en los límites de tamaño.
- La regla de capas se basa en rutas: un archivo fuera de `dominio/`, `aplicacion/` o `componentes/` no tiene restricciones, así que el código nuevo debe vivir en una de esas carpetas.
