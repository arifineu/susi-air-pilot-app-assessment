import { describe, it, expect } from 'vitest'
import { computed, ref } from 'vue'
import { computeRollingSum, computeRollingSumSeries, useRollingSum } from './useRollingSum'
import type { FlightHour } from '~/types'

// Curated fixture — 14 consecutive days 2026-05-18 .. 2026-05-31.
// Hours chosen so we can hand-verify sums.
const FIXTURE: FlightHour[] = [
  { date: '2026-05-18', hours: 1 },
  { date: '2026-05-19', hours: 2 },
  { date: '2026-05-20', hours: 3 },
  { date: '2026-05-21', hours: 4 },
  { date: '2026-05-22', hours: 5 },
  { date: '2026-05-23', hours: 6 },
  { date: '2026-05-24', hours: 7 },
  { date: '2026-05-25', hours: 8 },
  { date: '2026-05-26', hours: 9 },
  { date: '2026-05-27', hours: 10 },
  { date: '2026-05-28', hours: 11 },
  { date: '2026-05-29', hours: 12 },
  { date: '2026-05-30', hours: 13 },
  { date: '2026-05-31', hours: 14 },
]

const TODAY = '2026-05-31'

describe('computeRollingSum — pure primitive', () => {
  it('sums all entries in the inclusive window [target - windowDays + 1, target]', () => {
    // windowDays=7, target=2026-05-31 → window 2026-05-25 .. 2026-05-31
    // = 8+9+10+11+12+13+14 = 77
    expect(computeRollingSum(FIXTURE, TODAY, 7)).toBe(77)
  })

  it('windowDays=1 returns only the target day (used by Daily limit card)', () => {
    expect(computeRollingSum(FIXTURE, TODAY, 1)).toBe(14)
  })

  it('windowDays=30 returns the rolling 30-day sum', () => {
    // FIXTURE has 14 days, all within the last 30 days of TODAY → sum = 105
    expect(computeRollingSum(FIXTURE, TODAY, 30)).toBe(105)
  })

  it('windowDays=0 returns 0 (no window)', () => {
    expect(computeRollingSum(FIXTURE, TODAY, 0)).toBe(0)
  })

  it('excludes entries just outside the lower edge', () => {
    // windowDays=7, target=2026-05-30 → window 2026-05-24 .. 2026-05-30
    // = 7+8+9+10+11+12+13 = 70  (entry 2026-05-23 with value 6 is EXCLUDED)
    expect(computeRollingSum(FIXTURE, '2026-05-30', 7)).toBe(70)
  })

  it('handles target date before all data', () => {
    expect(computeRollingSum(FIXTURE, '2026-04-01', 7)).toBe(0)
  })

  it('handles target date after all data', () => {
    // window includes all 14 days
    expect(computeRollingSum(FIXTURE, '2026-06-15', 30)).toBe(105)
  })

  it('handles empty flightHours array', () => {
    expect(computeRollingSum([], TODAY, 7)).toBe(0)
  })

  it('handles Date objects as target', () => {
    expect(computeRollingSum(FIXTURE, new Date('2026-05-31'), 7)).toBe(77)
  })

  it('throws on invalid date string', () => {
    expect(() => computeRollingSum(FIXTURE, 'not-a-date', 7)).toThrow()
  })
})

describe('computeRollingSumSeries — 15-day chart series', () => {
  it('returns exactly 15 points for displayRangeDays=7', () => {
    const series = computeRollingSumSeries(FIXTURE, TODAY, 7)
    expect(series).toHaveLength(15)
  })

  it('first date is today - 7, last date is today + 7', () => {
    const series = computeRollingSumSeries(FIXTURE, TODAY, 7)
    expect(series[0]?.date).toBe('2026-05-24')
    expect(series[series.length - 1]?.date).toBe('2026-06-07')
  })

  it('today is the middle point at index 7', () => {
    const series = computeRollingSumSeries(FIXTURE, TODAY, 7)
    expect(series[7]?.date).toBe(TODAY)
  })

  it('display window is INDEPENDENT of windowDays (the critical property)', () => {
    // Toggle 1w vs 1y → SAME 15 dates, only values change
    const series1w = computeRollingSumSeries(FIXTURE, TODAY, 7)
    const series1y = computeRollingSumSeries(FIXTURE, TODAY, 365)
    expect(series1w.map((p) => p.date)).toEqual(series1y.map((p) => p.date))
  })

  it('values change with windowDays (longer window → larger sums)', () => {
    const series1w = computeRollingSumSeries(FIXTURE, TODAY, 7)
    const series1y = computeRollingSumSeries(FIXTURE, TODAY, 365)
    // At today (index 7), 1y sum includes all 14 fixture entries → 105
    // while 1w sum is only 77
    expect(series1y[7]?.value).toBe(105)
    expect(series1w[7]?.value).toBe(77)
  })

  it('future dates in the series still include past data via the rolling window', () => {
    // Point at 2026-06-01, windowDays=7 → window 2026-05-26..2026-06-01
    // = 9+10+11+12+13+14 = 69 (no fixture data for 2026-06-01)
    const series = computeRollingSumSeries(FIXTURE, TODAY, 7)
    const jun1 = series.find((p) => p.date === '2026-06-01')
    expect(jun1?.value).toBe(69)
  })

  it('past dates before all fixture data yield 0', () => {
    const series = computeRollingSumSeries(FIXTURE, TODAY, 7)
    const early = series.find((p) => p.date === '2026-05-24')
    // window 2026-05-18..2026-05-24 = 1+2+3+4+5+6+7 = 28
    expect(early?.value).toBe(28)
  })

  it('honours a custom displayRangeDays', () => {
    const series = computeRollingSumSeries(FIXTURE, TODAY, 7, 3)
    expect(series).toHaveLength(7)
    expect(series[0]?.date).toBe('2026-05-28')
    expect(series[series.length - 1]?.date).toBe('2026-06-03')
  })

  it('handles empty flightHours', () => {
    const series = computeRollingSumSeries([], TODAY, 7)
    expect(series).toHaveLength(15)
    expect(series.every((p) => p.value === 0)).toBe(true)
  })

  it('hand-verified full 1w series for the worked example (today=2026-05-31)', () => {
    // Today = 2026-05-31. windowDays=7. displayRangeDays=7.
    // Each Y(D) = sum of FIXTURE entries in [D-6, D].
    const expected: { date: string; value: number }[] = [
      { date: '2026-05-24', value: 1 + 2 + 3 + 4 + 5 + 6 + 7 }, // 18..24 = 28
      { date: '2026-05-25', value: 2 + 3 + 4 + 5 + 6 + 7 + 8 }, // 19..25 = 35
      { date: '2026-05-26', value: 3 + 4 + 5 + 6 + 7 + 8 + 9 }, // 20..26 = 42
      { date: '2026-05-27', value: 4 + 5 + 6 + 7 + 8 + 9 + 10 }, // 21..27 = 49
      { date: '2026-05-28', value: 5 + 6 + 7 + 8 + 9 + 10 + 11 }, // 22..28 = 56
      { date: '2026-05-29', value: 6 + 7 + 8 + 9 + 10 + 11 + 12 }, // 23..29 = 63
      { date: '2026-05-30', value: 7 + 8 + 9 + 10 + 11 + 12 + 13 }, // 24..30 = 70
      { date: '2026-05-31', value: 8 + 9 + 10 + 11 + 12 + 13 + 14 }, // 25..31 = 77
      { date: '2026-06-01', value: 9 + 10 + 11 + 12 + 13 + 14 }, // 26..06-01 (no 06-01 entry) = 69
      { date: '2026-06-02', value: 10 + 11 + 12 + 13 + 14 }, // 27..06-02 = 60
      { date: '2026-06-03', value: 11 + 12 + 13 + 14 }, // 28..06-03 = 50
      { date: '2026-06-04', value: 12 + 13 + 14 }, // 29..06-04 = 39
      { date: '2026-06-05', value: 13 + 14 }, // 30..06-05 = 27
      { date: '2026-06-06', value: 14 }, // 31..06-06 = 14
      { date: '2026-06-07', value: 0 }, // no data 06-01..06-07
    ]
    const series = computeRollingSumSeries(FIXTURE, TODAY, 7)
    expect(series).toEqual(expected)
  })
})

describe('useRollingSum — reactive wrapper', () => {
  it('returns a ComputedRef with the same series as the pure function', () => {
    const series = useRollingSum(FIXTURE, TODAY, 7)
    expect(series.value).toEqual(computeRollingSumSeries(FIXTURE, TODAY, 7))
  })

  it('recomputes when reactive inputs change', () => {
    const windowDays = ref(7)
    const series = useRollingSum(FIXTURE, TODAY, computed(() => windowDays.value))
    const before = series.value[7]?.value
    windowDays.value = 30
    const after = series.value[7]?.value
    expect(before).toBe(77)
    expect(after).toBe(105) // all 14 fixture entries in last 30 days
  })
})
