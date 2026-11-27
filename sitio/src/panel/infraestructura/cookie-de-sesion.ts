import { cookies } from 'next/headers'
import { generateExpiredPayloadCookie, generatePayloadCookie, type Payload } from 'payload'

// La cookie de sesión del panel es la misma que usa el /admin de Payload: nombre, duración,
// dominio y `sameSite` salen de la configuración de `auth` de la colección `usuarios`.
const SAME_SITE = { Lax: 'lax', None: 'none', Strict: 'strict' } as const

// Lo que se usa del objeto que devuelven `generatePayloadCookie` y `generateExpiredPayloadCookie`.
interface CookieDePayload {
  name: string
  value?: string
  domain?: string
  expires?: string
  sameSite?: keyof typeof SAME_SITE
  secure?: boolean
}

async function escribir(cookie: CookieDePayload): Promise<void> {
  const almacen = await cookies()
  almacen.set(cookie.name, cookie.value ?? '', {
    domain: cookie.domain,
    expires: cookie.expires ? new Date(cookie.expires) : undefined,
    httpOnly: true,
    path: '/',
    sameSite: cookie.sameSite ? SAME_SITE[cookie.sameSite] : 'lax',
    secure: cookie.secure ?? false,
  })
}

const configuracion = (payload: Payload) => ({
  collectionAuthConfig: payload.collections.usuarios.config.auth,
  cookiePrefix: payload.config.cookiePrefix,
  returnCookieAsObject: true as const,
})

export async function guardarCookieDeSesion(payload: Payload, token: string): Promise<void> {
  await escribir(generatePayloadCookie({ ...configuracion(payload), token }))
}

export async function borrarCookieDeSesion(payload: Payload): Promise<void> {
  await escribir(generateExpiredPayloadCookie(configuracion(payload)))
}
