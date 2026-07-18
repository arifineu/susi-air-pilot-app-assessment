import { describe, it, expect } from 'vitest'
import { addDays, formatDateLong, formatDuration, formatHours, formatHoursOrMinutes, roundHours } from './format'

describe('roundHours', () => {
  it('rounds to 1 decimal by default', () => {
    expect(roundHours(24.599999)).toBe(24.6)
  })
  it('supports custom decimals', () => {
    expect(roundHours(24.599999, 2)).toBe(24.6)
  })
})

describe('formatHours', () => {
  it('drops trailing .0 for whole hours', () => {
    expect(formatHours(8)).toBe('8h')
  })
  it('keeps one decimal otherwise', () => {
    expect(formatHours(24.6)).toBe('24.6h')
  })
})

describe('formatHoursOrMinutes', () => {
  it('renders 0 as 0h', () => {
    expect(formatHoursOrMinutes(0)).toBe('0h')
  })
  it('renders under-1h values as minutes', () => {
    expect(formatHoursOrMinutes(0.7)).toBe('42m')
  })
  it('renders 1h+ as hours', () => {
    expect(formatHoursOrMinutes(8)).toBe('8h')
  })
})

describe('formatDateLong', () => {
  it('formats an ISO date as "Weekday, D Month YYYY"', () => {
    expect(formatDateLong('2026-05-31')).toBe('Sunday, 31 May 2026')
  })
  it('returns the input unchanged when the date is invalid', () => {
    expect(formatDateLong('not-a-date')).toBe('not-a-date')
  })
  it('handles leap-day dates correctly', () => {
    expect(formatDateLong('2024-02-29')).toBe('Thursday, 29 February 2024')
  })
})

describe('formatDuration', () => {
  it('renders zero as "0m"', () => {
    expect(formatDuration(0)).toBe('0m')
  })
  it('renders sub-hour durations as minutes only', () => {
    expect(formatDuration(45)).toBe('45m')
  })
  it('renders whole-hour durations without trailing minutes', () => {
    expect(formatDuration(120)).toBe('2h')
  })
  it('renders mixed hour+minute durations', () => {
    expect(formatDuration(75)).toBe('1h 15m')
  })
})

describe('addDays', () => {
  it('returns the same date when days=0', () => {
    expect(addDays('2026-05-31', 0)).toBe('2026-05-31')
  })
  it('adds days within a month', () => {
    expect(addDays('2026-05-31', 3)).toBe('2026-06-03')
  })
  it('wraps at month boundaries', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01')
  })
  it('wraps at year boundaries', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
  })
  it('handles negative offsets', () => {
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
  })
  it('passes invalid input through unchanged', () => {
    expect(addDays('nope', 1)).toBe('nope')
  })
})
