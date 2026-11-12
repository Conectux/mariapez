// Pasa los parámetros de los anuncios (utm_*, src, sck, fbclid...) a todos los links de Hotmart del sitio.
// Los guarda en localStorage para que sigan llegando al checkout si la persona vuelve después sin ellos.
// Solo agrega los que falten: nunca cambia los que ya trae el link (off=, checkoutMode=...).
export default defineNuxtPlugin((nuxtApp) => {
  const KEY = 'hm_params'
  let params = new URLSearchParams(window.location.search)
  try {
    if (params.toString()) localStorage.setItem(KEY, params.toString())
    else if (localStorage.getItem(KEY)) params = new URLSearchParams(localStorage.getItem(KEY)!)
  }
  catch {}
  if (!params.toString()) return

  const addParams = (a: HTMLAnchorElement) => {
    try {
      const url = new URL(a.href)
      params.forEach((v, k) => {
        if (!url.searchParams.has(k)) url.searchParams.set(k, v)
      })
      a.href = url.toString()
    }
    catch {}
  }
  const run = () => document.querySelectorAll<HTMLAnchorElement>('a[href*="hotmart.com"]').forEach(addParams)

  // Vue puede reescribir los href al montar o al cambiar de página: se repasan después de cada render
  nuxtApp.hook('app:mounted', () => nextTick(run))
  nuxtApp.hook('page:finish', () => nextTick(run))
  // Y justo antes de salir al checkout, por si algo cambió el link después
  document.addEventListener('click', (e) => {
    const a = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href*="hotmart.com"]')
    if (a) addParams(a)
  }, true)
})
