// Pixel de Meta en el navegador: PageView al navegar sin recargar.
// El código base y el primer PageView vienen en el HTML del servidor (server/plugins/meta-pixel.ts).
// Cada página usa su propio pixel (ver shared/utils/pixel.ts).
// El InitiateCheckout y el Purchase los dispara Hotmart desde su checkout, configurando el mismo pixel en cada producto.
declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void, queue?: unknown[], loaded?: boolean, version?: string, push?: unknown }
    _fbq?: Window['fbq']
  }
}

export default defineNuxtPlugin(() => {
  const ids = useRuntimeConfig().public
  if (!ids.metaPixelId && !ids.metaPixelIdEn) return

  const iniciados = new Set<string>()
  const pixelInicial = pixelDeRuta(window.location.pathname, ids)

  if (window.fbq) {
    // El HTML del servidor ya inició el pixel de esta página y envió su PageView
    if (pixelInicial) iniciados.add(pixelInicial)
  }
  else {
    // Respaldo por si la página llega sin el código del servidor
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
  }

  // trackSingle: cada PageView va solo al pixel de esa página, aunque se hayan iniciado los dos al navegar
  const pageView = (path: string) => {
    const id = pixelDeRuta(path, ids)
    if (!id) return
    if (!iniciados.has(id)) {
      window.fbq!('init', id)
      iniciados.add(id)
    }
    window.fbq!('trackSingle', id, 'PageView')
  }

  if (!iniciados.size) pageView(window.location.pathname)

  // Evita contar dos veces la primera página
  let ultimaRuta = window.location.pathname
  useRouter().afterEach((to) => {
    if (to.path === ultimaRuta) return
    ultimaRuta = to.path
    pageView(to.path)
  })
})
