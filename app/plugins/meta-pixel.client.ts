// Pixel de Meta: PageView en cada página (también al navegar sin recargar).
// La landing en inglés (/healthy-desserts) usa su propio pixel; el resto del sitio, el principal.
// El InitiateCheckout y el Purchase los dispara Hotmart desde su checkout, configurando el mismo pixel en cada producto.
declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void, queue?: unknown[], loaded?: boolean, version?: string, push?: unknown }
    _fbq?: Window['fbq']
  }
}

export default defineNuxtPlugin(() => {
  const { metaPixelId, metaPixelIdEn } = useRuntimeConfig().public
  if ((!metaPixelId && !metaPixelIdEn) || window.fbq) return

  const pixelDeRuta = (path: string) => (path.startsWith('/healthy-desserts') ? metaPixelIdEn : metaPixelId)

  const fbq: NonNullable<Window['fbq']> = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args)
    else fbq.queue!.push(args)
  }
  fbq.push = fbq
  fbq.loaded = true
  fbq.version = '2.0'
  fbq.queue = []
  window.fbq = fbq
  window._fbq = fbq

  useHead({
    script: [{ src: 'https://connect.facebook.net/en_US/fbevents.js', async: true }],
  })

  // trackSingle: cada PageView va solo al pixel de esa página, aunque se hayan iniciado los dos al navegar
  const iniciados = new Set<string>()
  const pageView = (path: string) => {
    const id = pixelDeRuta(path)
    if (!id) return
    if (!iniciados.has(id)) {
      fbq('init', id)
      iniciados.add(id)
    }
    fbq('trackSingle', id, 'PageView')
  }

  pageView(window.location.pathname)

  // Evita contar dos veces la primera página
  let ultimaRuta = window.location.pathname
  useRouter().afterEach((to) => {
    if (to.path === ultimaRuta) return
    ultimaRuta = to.path
    pageView(to.path)
  })
})
