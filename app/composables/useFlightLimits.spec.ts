import { describe, it, expect } from 'vitest'
import { computeFlightLimits, useFlightLimits } from './useFlightLimits'
import type { FlightHour, FlightLimits } from '~/types'

// Reuse the 14-day fixture pattern from useRollingSum but with simpler hours.
const FIXTURE: FlightHour[] = Array.from({ length: 14 }, (_, i) => ({
  date: `2026-05-${String(i + 18).padStart(2, '0')}`, // 2026-05-18 .. 2026-05-31
  hours: 3, // 3h/day → 14 days × 3h = 42h total
}))

const LIMITS: FlightLimits = { daily: 8, weekly: 40, monthly: 100, annual: 1050 }
const TODAY = '2026-05-31'

describe('computeFlightLimits', () => {
  it('returns exactly 4 cards in canonical order', () => {
    const cards = computeFlightLimits(FIXTURE, LIMITS, TODAY)
    expect(cards.map((c) => c.key)).toEqual(['daily', 'weekly', 'monthly', 'annual'])
  })

  it('Daily = today only (windowDays=1) — 3h on 2026-05-31', () => {
    const cards = computeFlightLimits(FIXTURE, LIMITS, TODAY)
    const daily = cards.find((c) => c.key === 'daily')
    expect(daily?.value).toBe(3)
    expect(daily?.limit).toBe(8)
    expect(daily?.unit).toBe('h')
  })

  it('Weekly = rolling 7 days — 7 days × 3h = 21h', () => {
    const cards = computeFlightLimits(FIXTURE, LIMITS, TODAY)
    const weekly = cards.find((c) => c.key === 'weekly')
    expect(weekly?.value).toBe(21)
    expect(weekly?.limit).toBe(40)
  })

  it('Monthly = rolling 30 days — all 14 fixture days fall in last 30d → 42h', () => {
    const cards = computeFlightLimits(FIXTURE, LIMITS, TODAY)
    const monthly = cards.find((c) => c.key === 'monthly')
    expect(monthly?.value).toBe(42)
    expect(monthly?.limit).toBe(100)
  })

  it('Annual = rolling 365 days — all 14 fixture days → 42h', () => {
    const cards = computeFlightLimits(FIXTURE, LIMITS, TODAY)
    const annual = cards.find((c) => c.key === 'annual')
    expect(annual?.value).toBe(42)
    expect(annual?.limit).toBe(1050)
  })

  it('labels are human-readable', () => {
    const cards = computeFlightLimits(FIXTURE, LIMITS, TODAY)
    expect(cards.map((c) => c.label)).toEqual(['Daily', 'Weekly', 'Monthly', 'Annual'])
  })

  it('defaults today to the brief dev reference date', () => {
    // No today arg → defaults to 2026-05-31. Same result as passing it.
    const implicit = computeFlightLimits(FIXTURE, LIMITS)
    const explicit = computeFlightLimits(FIXTURE, LIMITS, '2026-05-31')
    expect(implicit).toEqual(explicit)
  })

  it('handles empty flightHours', () => {
    const cards = computeFlightLimits([], LIMITS, TODAY)
    expect(cards.every((c) => c.value === 0)).toBe(true)
  })
})

describe('useFlightLimits — reactive wrapper', () => {
  it('returns a ComputedRef matching the pure function', () => {
    const cards = useFlightLimits(FIXTURE, LIMITS, TODAY)
    expect(cards.value).toEqual(computeFlightLimits(FIXTURE, LIMITS, TODAY))
  })
})
