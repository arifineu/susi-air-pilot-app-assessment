/**
 * useRollingSum
 *
 * The rolling-sum primitive powering both the HoursToLimit chart and the 4
 * LimitCards. Per brief §3.2:
 *
 *   For each date D in the displayed 15-day window (today-7 ... today+7):
 *     Y(D) = sum of flightHours[].hours where date is in
 *            (D - windowDays + 1) ... D inclusive
 *
 * Rules verified against mock-flight-hours.json's `chartBounds`:
 *   - Display window is ALWAYS ±7 days from today regardless of toggle
 *   - Only `windowDays` (the summation width) changes per toggle:
 *       1w → 7, 1m → 30, 3m → 90, 6m → 180, 1y → 365
 *
 * Dates use UTC midnight normalization (mirrors useDocumentExpiry) so DST
 * boundaries don't shift the day count.
 */
import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from 'vue'
import type { FlightHour } from '~/types'

const DAY_MS = 86_400_000

function toUtcMidnight(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
}

function parseUtc(date: string | Date): Date {
  const d = typeof date === 'string' ? new Date(date) : date
  if (Number.isNaN(d.getTime())) {
    throw new Error(`useRollingSum: invalid date input: ${date}`)
  }
  return toUtcMidnight(d)
}

/**
 * Pure primitive. Sum of all `flightHours[].hours` where the entry's date
 * falls in the inclusive window [targetDate - windowDays + 1, targetDate].
 *
 * Window edges (windowDays = 7, targetDate = D):
 *   - D - 6 (oldest) is INCLUDED
 *   - D (target) is INCLUDED
 *   - D - 7 (one day older) is EXCLUDED
 */
export function computeRollingSum(
  flightHours: FlightHour[],
  targetDate: string | Date,
  windowDays: number,
): number {
  if (windowDays <= 0) return 0
  const target = parseUtc(targetDate).getTime()
  const start = target - (windowDays - 1) * DAY_MS

  let sum = 0
  for (const entry of flightHours) {
    const t = parseUtc(entry.date).getTime()
    if (t >= start && t <= target) {
      sum += entry.hours
    }
  }
  return sum
}

/**
 * Build the 15-point (or `(2 * displayRangeDays + 1)`-point) series used by
 * the trend chart. One entry per date in [today - displayRangeDays, today +
 * displayRangeDays], each value computed via computeRollingSum.
 *
 * The display window is INDEPENDENT of `windowDays` — the same 15 dates
 * appear whether the user toggles 1w or 1y. Only the value heights change.
 */
export function computeRollingSumSeries(
  flightHours: FlightHour[],
  today: string | Date,
  windowDays: number,
  displayRangeDays: number = 7,
): { date: string; value: number }[] {
  const todayUtc = parseUtc(today)
  const series: { date: string; value: number }[] = []
  for (let offset = -displayRangeDays; offset <= displayRangeDays; offset++) {
    const d = new Date(todayUtc.getTime() + offset * DAY_MS)
    const iso = isoDate(d)
    series.push({ date: iso, value: computeRollingSum(flightHours, d, windowDays) })
  }
  return series
}

/** Reactive wrapper returning the series form (most common consumer). */
export function useRollingSum(
  flightHours: MaybeRefOrGetter<FlightHour[]>,
  today: MaybeRefOrGetter<string | Date>,
  windowDays: MaybeRefOrGetter<number>,
  displayRangeDays?: MaybeRefOrGetter<number | undefined>,
): ComputedRef<{ date: string; value: number }[]> {
  return computed(() =>
    computeRollingSumSeries(
      toValue(flightHours),
      toValue(today),
      toValue(windowDays),
      toValue(displayRangeDays) ?? 7,
    ),
  )
}

/** Format a UTC-midnight Date back to ISO yyyy-mm-dd (no timezone shift). */
function isoDate(d: Date): string {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
