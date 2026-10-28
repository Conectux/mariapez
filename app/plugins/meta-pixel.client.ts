// Pixel de Meta: PageView en cada página (también al navegar sin recargar).
// El InitiateCheckout y el Purchase los dispara Hotmart desde su checkout, configurando el mismo pixel en el producto.
declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void, queue?: unknown[], loaded?: boolean, version?: string, push?: unknown }
    _fbq?: Window['fbq']
  }
}

export default defineNuxtPlugin(() => {
  const { metaPixelId } = useRuntimeConfig().public
  if (!metaPixelId || window.fbq) return

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

  fbq('init', metaPixelId)
  fbq('track', 'PageView')

  // Evita contar dos veces la primera página
  let ultimaRuta = window.location.pathname
  useRouter().afterEach((to) => {
    if (to.path === ultimaRuta) return
    ultimaRuta = to.path
    window.fbq?.('track', 'PageView')
  })
})
