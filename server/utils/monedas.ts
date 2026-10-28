// Moneda y locale de cada país de Latinoamérica (código ISO del país → moneda)
export const monedasLatam: Record<string, { moneda: string, locale: string, nombre: string }> = {
  AR: { moneda: 'ARS', locale: 'es-AR', nombre: 'Argentina' },
  BO: { moneda: 'BOB', locale: 'es-BO', nombre: 'Bolivia' },
  BR: { moneda: 'BRL', locale: 'pt-BR', nombre: 'Brasil' },
  CL: { moneda: 'CLP', locale: 'es-CL', nombre: 'Chile' },
  CO: { moneda: 'COP', locale: 'es-CO', nombre: 'Colombia' },
  CR: { moneda: 'CRC', locale: 'es-CR', nombre: 'Costa Rica' },
  CU: { moneda: 'CUP', locale: 'es-CU', nombre: 'Cuba' },
  DO: { moneda: 'DOP', locale: 'es-DO', nombre: 'República Dominicana' },
  EC: { moneda: 'USD', locale: 'es-EC', nombre: 'Ecuador' },
  SV: { moneda: 'USD', locale: 'es-SV', nombre: 'El Salvador' },
  GT: { moneda: 'GTQ', locale: 'es-GT', nombre: 'Guatemala' },
  HN: { moneda: 'HNL', locale: 'es-HN', nombre: 'Honduras' },
  MX: { moneda: 'MXN', locale: 'es-MX', nombre: 'México' },
  NI: { moneda: 'NIO', locale: 'es-NI', nombre: 'Nicaragua' },
  PA: { moneda: 'USD', locale: 'es-PA', nombre: 'Panamá' },
  PY: { moneda: 'PYG', locale: 'es-PY', nombre: 'Paraguay' },
  PE: { moneda: 'PEN', locale: 'es-PE', nombre: 'Perú' },
  PR: { moneda: 'USD', locale: 'es-PR', nombre: 'Puerto Rico' },
  UY: { moneda: 'UYU', locale: 'es-UY', nombre: 'Uruguay' },
  VE: { moneda: 'VES', locale: 'es-VE', nombre: 'Venezuela' },
}

// Tasas de cambio desde USD, cacheadas 6 horas para no consultar la API en cada visita
export const obtenerTasas = defineCachedFunction(async () => {
  const res = await $fetch<{ result: string, rates: Record<string, number> }>('https://open.er-api.com/v6/latest/USD')
  if (res.result !== 'success') throw new Error('No se pudieron obtener las tasas de cambio')
  return res.rates
}, { maxAge: 60 * 60 * 6, name: 'tasas-usd', getKey: () => 'latest' })
