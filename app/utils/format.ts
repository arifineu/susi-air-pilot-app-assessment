/**
 * Display formatters for flight-hour values.
 *
 * Why: rolling sums of fractional hours accumulate IEEE-754 noise
 * (e.g. 24.599999999999998). These helpers round at the display boundary
 * so the underlying composables stay precise.
 */

/** Round to 1 decimal place, returning a number (e.g. 24.6). */
export function roundHours(value: number, decimals = 1): number {
  const factor = 10 ** decimals
  return Math.round((value + Number.EPSILON) * factor) / factor
}

/** Format an hours value with unit, trimmed of trailing zeros (e.g. "24.6h", "8h"). */
export function formatHours(value: number, unit = 'h', decimals = 1): string {
  const rounded = roundHours(value, decimals)
  // Drop trailing ".0" so whole hours render as "8h" not "8.0h".
  const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(decimals)
  return `${text}${unit}`
}

/**
 * Format an hours value, but switch to minutes when under 1 hour so values
 * like "0.7h" read as "42m" instead. Whole hours still render with the hours
 * unit (e.g. "8h"). Zero renders as "0h" to match the hours-unit limit text.
 */
export function formatHoursOrMinutes(value: number, unit = 'h'): string {
  if (value <= 0) return `0${unit}`
  if (value < 1) {
    const minutes = Math.round(value * 60)
    return `${minutes}m`
  }
  return formatHours(value, unit)
}
