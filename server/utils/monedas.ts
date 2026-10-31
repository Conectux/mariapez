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

// Hotmart cobra un poco más que la conversión de la API (usa su propia tasa y suma impuestos).
// Cada factor = precio del checkout de Hotmart / precio que muestra la página (antes del ajuste).
// Calibrado el 2026-10-30. Recalíbralo si la diferencia vuelve a aparecer.
export const AJUSTE_HOTMART: Record<string, number> = {
  COP: 1.0739, // 33.877 / 31.546
  // MXN: pendiente,
  // PEN: pendiente,
  // CLP: pendiente,
  default: 1.08,
}

// Redondea siempre hacia arriba para que la página nunca muestre menos de lo que cobra el checkout:
// COP y CLP a la centena, USD al centavo y el resto a la unidad
export function redondearArriba(valor: number, moneda: string) {
  const paso = ['COP', 'CLP'].includes(moneda) ? 100 : moneda === 'USD' ? 0.01 : 1
  // El 1e-9 evita que un error de coma flotante (997.0000000001) suba un paso de más
  return Math.ceil(valor / paso - 1e-9) * paso
}
