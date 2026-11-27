import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { crearAlmacenamientoWasabi } from './compartido/infraestructura/almacenamiento-wasabi'
import { coleccionMedios } from './compartido/infraestructura/coleccion-medios'
import { coleccionUsuarios } from './modulos/usuarios/infraestructura/coleccion-usuarios'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: coleccionUsuarios.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [coleccionUsuarios, coleccionMedios],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI ?? '',
    },
  }),
  sharp,
  plugins: [...crearAlmacenamientoWasabi(process.env, [coleccionMedios.slug])],
})
