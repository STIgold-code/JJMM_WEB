import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { crearAlmacenamientoWasabi } from './compartido/infraestructura/almacenamiento-wasabi'
import { coleccionMedios } from './compartido/infraestructura/coleccion-medios'
import {
  ADMIN_DEL_PANEL,
  I18N_DEL_PANEL,
} from './compartido/infraestructura/panel/configuracion-del-panel'
import { COLECCIONES, GLOBALES } from './contenido'
import { migrations } from './migrations'
import { coleccionUsuarios } from './modulos/usuarios/infraestructura/coleccion-usuarios'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    ...ADMIN_DEL_PANEL,
    user: coleccionUsuarios.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  i18n: I18N_DEL_PANEL,
  collections: COLECCIONES,
  globals: GLOBALES,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI ?? '',
    },
    // El esquema se sincroniza solo en desarrollo. En CI y producción se aplica con
    // migraciones versionadas, así nada cambia la base sin revisión. `prodMigrations` aplica
    // las pendientes al iniciar el servidor en producción (contenedor de larga vida en Railway).
    push: process.env.NODE_ENV === 'development',
    migrationDir: path.resolve(dirname, 'migrations'),
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [...crearAlmacenamientoWasabi(process.env, [coleccionMedios.slug])],
})
