/**
 * Phase 3 exit-criteria verification spec.
 *
 * Asserts the two CRITICAL properties called out in the prompt:
 *   1. Rolling-sum unit tests pass against the brief's worked example
 *      (today = 2026-05-31, ±7 day window, summation width per toggle).
 *   2. LimitCard values match mock-flight-hours.json's actual sums at today.
 *
 * If either of these breaks, the dashboard is broken — this file is the
 * canary.
 */
import { describe, it, expect } from 'vitest'
import flightHoursData from '~/assets/data/mock-flight-hours.json'
import { computeRollingSum, computeRollingSumSeries } from '~/composables/useRollingSum'
import { computeFlightLimits } from '~/composables/useFlightLimits'

const TODAY = '2026-05-31' // brief dev reference date

describe('Brief §3.2 — rolling-sum worked example', () => {
  const flightHours = flightHoursData.flightHours

  it.each([
    ['1w', 7],
    ['1m', 30],
    ['3m', 90],
    ['6m', 180],
    ['1y', 365],
  ] as const)('%s toggle uses windowDays=%i for the summation width', (_key, windowDays) => {
    const sum = computeRollingSum(flightHours, TODAY, windowDays)
    expect(typeof sum).toBe('number')
    expect(Number.isFinite(sum)).toBe(true)
  })

  it('display window is ALWAYS ±7 days regardless of toggle (the critical property)', () => {
    const w = computeRollingSumSeries(flightHours, TODAY, 7)
    const m = computeRollingSumSeries(flightHours, TODAY, 30)
    const q = computeRollingSumSeries(flightHours, TODAY, 90)
    const h = computeRollingSumSeries(flightHours, TODAY, 180)
    const y = computeRollingSumSeries(flightHours, TODAY, 365)

    expect(w.map((p) => p.date)).toEqual(m.map((p) => p.date))
    expect(m.map((p) => p.date)).toEqual(q.map((p) => p.date))
    expect(q.map((p) => p.date)).toEqual(h.map((p) => p.date))
    expect(h.map((p) => p.date)).toEqual(y.map((p) => p.date))

    // Exactly 15 points, today at index 7
    expect(w).toHaveLength(15)
    expect(w[7]?.date).toBe(TODAY)
    expect(w[0]?.date).toBe('2026-05-24')
    expect(w[14]?.date).toBe('2026-06-07')
  })

  it('toggle values are internally consistent: 1w <= 1m <= 3m <= 6m <= 1y at every date', () => {
    const w = computeRollingSumSeries(flightHours, TODAY, 7)
    const m = computeRollingSumSeries(flightHours, TODAY, 30)
    const q = computeRollingSumSeries(flightHours, TODAY, 90)
    const h = computeRollingSumSeries(flightHours, TODAY, 180)
    const y = computeRollingSumSeries(flightHours, TODAY, 365)

    for (let i = 0; i < 15; i++) {
      expect(w[i]?.value).toBeLessThanOrEqual(m[i]?.value ?? 0)
      expect(m[i]?.value).toBeLessThanOrEqual(q[i]?.value ?? 0)
      expect(q[i]?.value).toBeLessThanOrEqual(h[i]?.value ?? 0)
      expect(h[i]?.value).toBeLessThanOrEqual(y[i]?.value ?? 0)
    }
  })
})

describe('Brief §3.3 — LimitCard values match JSON sums at today', () => {
  const cards = computeFlightLimits(flightHoursData.flightHours, flightHoursData.limits, TODAY)
  const byKey = Object.fromEntries(cards.map((c) => [c.key, c]))

  it('Daily card uses today-only window (windowDays=1)', () => {
    const expected = computeRollingSum(flightHoursData.flightHours, TODAY, 1)
    expect(byKey.daily?.value).toBe(expected)
    expect(byKey.daily?.limit).toBe(flightHoursData.limits.daily)
  })

  it('Weekly card uses rolling 7-day window', () => {
    const expected = computeRollingSum(flightHoursData.flightHours, TODAY, 7)
    expect(byKey.weekly?.value).toBe(expected)
    expect(byKey.weekly?.limit).toBe(flightHoursData.limits.weekly)
  })

  it('Monthly card uses rolling 30-day window', () => {
    const expected = computeRollingSum(flightHoursData.flightHours, TODAY, 30)
    expect(byKey.monthly?.value).toBe(expected)
    expect(byKey.monthly?.limit).toBe(flightHoursData.limits.monthly)
  })

  it('Annual card uses rolling 365-day window', () => {
    const expected = computeRollingSum(flightHoursData.flightHours, TODAY, 365)
    expect(byKey.annual?.value).toBe(expected)
    expect(byKey.annual?.limit).toBe(flightHoursData.limits.annual)
  })
})
