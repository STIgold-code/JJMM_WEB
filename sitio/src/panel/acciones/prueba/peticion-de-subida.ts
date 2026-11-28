// Peticiones de prueba para el manejador de la subida de imágenes: un multipart con el archivo y su
// texto alternativo, y las cabeceras que manda el navegador (Origin, Host y el largo del cuerpo).
export const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0])
export const SVG = new TextEncoder().encode(
  '<svg xmlns="http://www.w3.org/2000/svg"><script/></svg>',
)

interface Opciones {
  bytes?: Uint8Array<ArrayBuffer>
  nombre?: string
  alt?: string
  // `null`: sin la cabecera.
  origen?: string | null
  largo?: number | null
}

export function peticionDeSubida({
  bytes = PNG,
  nombre = 'logo.html',
  alt = 'Logotipo',
  ...cabeceras
}: Opciones = {}): Request {
  const formulario = new FormData()
  formulario.set('archivo', new File([bytes], nombre, { type: 'image/png' }))
  formulario.set('alt', alt)
  const headers = new Headers({ host: 'jjmm.pe' })
  const origen = cabeceras.origen === undefined ? 'https://jjmm.pe' : cabeceras.origen
  if (origen) headers.set('origin', origen)
  const largo = cabeceras.largo === undefined ? bytes.length + 400 : cabeceras.largo
  if (largo !== null) headers.set('content-length', String(largo))
  return new Request('https://jjmm.pe/panel/imagenes/subir', {
    method: 'POST',
    headers,
    body: formulario,
  })
}

// Lo que devuelve la Local API al crear el medio.
export const MEDIO_CREADO = {
  id: 9,
  filename: 'logo.png',
  alt: 'Logotipo',
  url: '/api/medios/file/logo.png',
  width: 120,
  height: 40,
  mimeType: 'image/png',
  filesize: 12,
}

export const leerRespuesta = async (respuesta: Response) => ({
  status: respuesta.status,
  json: await respuesta.json(),
})
