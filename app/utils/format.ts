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

/**
 * Format an ISO date as a long human-readable string, e.g.
 *   "2026-05-31" → "Sunday, 31 May 2026"
 *
 * Uses Intl.DateTimeFormat('en-GB', ...) — the rest of the app already
 * standardizes on en-GB for day-before-month ordering (see DocumentListItem,
 * ScheduleCalendarGrid, FlightHoursTrendChart).
 */
export function formatDateLong(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(d)
}

/**
 * Format a duration in minutes as a compact label:
 *   0   → "0m"
 *   45  → "45m"
 *   75  → "1h 15m"
 *   120 → "2h"
 */
export function formatDuration(minutes: number): string {
  if (minutes <= 0) return '0m'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

/**
 * Add N days to an ISO yyyy-mm-dd date, returning a new ISO yyyy-mm-dd.
 *   addDays('2026-05-31', 3) → '2026-06-03'
 *   addDays('2026-01-31', 1) → '2026-02-01'   (month boundary)
 *
 * Uses UTC explicitly. Constructing `new Date('2026-05-31')` parses as local
 * midnight, and `setDate` can cross DST boundaries or shift a day in some
 * timezones — UTC keeps the yyyy-mm-dd math stable everywhere.
 */
export function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(d.getTime())) return iso
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}
