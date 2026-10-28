// Convierte precios en USD a la moneda local del visitante.
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

  try {
    const tasa = (await obtenerTasas())[info.moneda]
    if (!tasa) throw new Error(`Sin tasa para ${info.moneda}`)

    const precios = montos.map((usd) => {
      const local = usd * tasa
      const decimales = local >= 100 ? 0 : 2
      return new Intl.NumberFormat(info.locale, {
        style: 'currency',
        currency: info.moneda,
        currencyDisplay: 'narrowSymbol',
        minimumFractionDigits: decimales,
        maximumFractionDigits: decimales,
      }).format(decimales ? local : Math.round(local))
    })

    return { pais, nombre: info.nombre, moneda: info.moneda, precios }
  }
  catch (error) {
    console.error('[precio]', error)
    return { pais, nombre: info.nombre, moneda: 'USD', precios: [] as string[] }
  }
})
