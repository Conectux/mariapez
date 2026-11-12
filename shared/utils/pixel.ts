// Qué pixel de Meta usa cada página: la landing en inglés tiene el suyo; el resto del sitio, el principal.
// Lo usan el servidor (código base en el HTML) y el navegador (navegaciones siguientes).
export function pixelDeRuta(path: string, ids: { metaPixelId?: string, metaPixelIdEn?: string }) {
  return path.startsWith('/healthy-desserts') ? ids.metaPixelIdEn : ids.metaPixelId
}
