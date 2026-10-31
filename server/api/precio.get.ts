// Convierte precios en USD a la moneda local del visitante, ajustados a lo que cobra Hotmart (ver AJUSTE_HOTMART).
// El país sale de la cabecera de geolocalización de Vercel; `?pais=CO` permite forzarlo para probar.
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const pais = String(query.pais || getHeader(event, 'x-vercel-ip-country') || '').toUpperCase()
  const montos = String(query.usd || '')
    .split(',')
    .map(Number)
    .filter(n => Number.isFinite(n) && n > 0)

  const info = monedasLatam[pais]
  if (!info || info.moneda === 'USD' || !montos.length) {
    return { pais, nombre: info?.nombre ?? null, moneda: 'USD', precios: [] as string[] }
  }

  const ajuste = AJUSTE_HOTMART[info.moneda] ?? AJUSTE_HOTMART.default

  try {
    const tasa = (await obtenerTasas())[info.moneda]
    if (!tasa) throw new Error(`Sin tasa para ${info.moneda}`)

    const precios = montos.map(usd => new Intl.NumberFormat(info.locale, {
      style: 'currency',
      currency: info.moneda,
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(redondearArriba(usd * tasa * ajuste, info.moneda)))

    return { pais, nombre: info.nombre, moneda: info.moneda, precios }
  }
  catch (error) {
    // Respaldo: precio en USD con el mismo ajuste, para no mostrar menos de lo que cobrará Hotmart en moneda local
    console.error('[precio]', error)
    const precios = montos.map(usd => redondearArriba(usd * ajuste, 'USD').toFixed(2))
    return { pais, nombre: info.nombre, moneda: 'USD', precios }
  }
})
