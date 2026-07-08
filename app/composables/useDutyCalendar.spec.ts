import { describe, it, expect } from 'vitest'
import { computeDutyCalendar, useDutyCalendar } from './useDutyCalendar'
import type { Legend, Schedule } from '~/types'

const LEGEND: Legend[] = [
  { code: 'DTY', label: 'On Duty', color: '#10B981' },
  { code: 'TRD', label: 'Travel Day', color: '#FBA577' },
]

const SCHEDULES: Schedule[] = [
  {
    id: '1',
    duty_date: '2026-05-01',
    status: 2,
    base_name: 'PDG',
    base_color: '#10B981',
    duty_type: 'DTY',
    count_schedules: 2,
    count_logbooks: 2,
  },
  {
    id: '2',
    duty_date: '2026-05-15',
    status: 1,
    base_name: 'MKW',
    base_color: '#10B981',
    duty_type: 'DTY',
    count_schedules: 6,
    count_logbooks: 0,
  },
  {
    id: '3',
    duty_date: '2026-05-31',
    status: 1,
    base_name: 'CJN',
    base_color: '#FBA577',
    duty_type: 'TRD',
    count_schedules: 1,
    count_logbooks: 0,
  },
]

const TODAY = '2026-05-31'

describe('computeDutyCalendar', () => {
  it('returns 6 rows × 7 cols (42 cells) — predictable layout', () => {
    const grid = computeDutyCalendar(SCHEDULES, LEGEND, '2026-05', TODAY)
    expect(grid).toHaveLength(6)
    for (const row of grid) {
      expect(row).toHaveLength(7)
    }
  })

  it('2026-05 starts on a Friday → grid start is Sunday 2026-04-26', () => {
    const grid = computeDutyCalendar(SCHEDULES, LEGEND, '2026-05', TODAY)
    expect(grid[0]?.[0]?.date).toBe('2026-04-26')
    expect(grid[0]?.[0]?.dayNumber).toBe(26)
  })

  it('marks leading out-of-month cells correctly', () => {
    const grid = computeDutyCalendar(SCHEDULES, LEGEND, '2026-05', TODAY)
    // 2026-04-26 through 2026-04-30 (5 days) are out-of-month
    const firstRow = grid[0] ?? []
    const outOfMonthCount = firstRow.filter((c) => c.isOutOfMonth).length
    expect(outOfMonthCount).toBe(5)
    // First in-month cell is 2026-05-01 at index 5
    expect(firstRow[5]?.date).toBe('2026-05-01')
    expect(firstRow[5]?.isOutOfMonth).toBe(false)
  })

  it('marks trailing out-of-month cells correctly', () => {
    const grid = computeDutyCalendar(SCHEDULES, LEGEND, '2026-05', TODAY)
    const lastRow = grid[5] ?? []
    // 2026-05-31 is a Sunday → it's the first cell of the last row
    expect(lastRow[0]?.date).toBe('2026-05-31')
    expect(lastRow[0]?.isOutOfMonth).toBe(false)
    // Rest of the last row is June
    expect(lastRow[1]?.date).toBe('2026-06-01')
    expect(lastRow[1]?.isOutOfMonth).toBe(true)
  })

  it('matches schedules by duty_date', () => {
    const grid = computeDutyCalendar(SCHEDULES, LEGEND, '2026-05', TODAY)
    const all = grid.flat()
    const withSchedule = all.filter((c) => c.schedule)
    expect(withSchedule).toHaveLength(3)
    expect(all.find((c) => c.date === '2026-05-01')?.schedule?.id).toBe('1')
    expect(all.find((c) => c.date === '2026-05-15')?.schedule?.id).toBe('2')
    expect(all.find((c) => c.date === '2026-05-31')?.schedule?.id).toBe('3')
  })

  it('cells without a matching schedule have schedule === undefined', () => {
    const grid = computeDutyCalendar(SCHEDULES, LEGEND, '2026-05', TODAY)
    const all = grid.flat()
    expect(all.find((c) => c.date === '2026-05-02')?.schedule).toBeUndefined()
  })

  it('isToday is true only for cells matching today', () => {
    const grid = computeDutyCalendar(SCHEDULES, LEGEND, '2026-05', TODAY)
    const all = grid.flat()
    const todayCells = all.filter((c) => c.isToday)
    expect(todayCells).toHaveLength(1)
    expect(todayCells[0]?.date).toBe(TODAY)
  })

  it('defaults today to 2026-05-31', () => {
    const implicit = computeDutyCalendar(SCHEDULES, LEGEND, '2026-05')
    const todayCells = implicit.flat().filter((c) => c.isToday)
    expect(todayCells[0]?.date).toBe('2026-05-31')
  })

  it('throws when today is not a valid date', () => {
    // Covers the `Number.isNaN(d.getTime())` throw branch in parseUtcMidnight.
    expect(() => computeDutyCalendar(SCHEDULES, LEGEND, '2026-05', 'not-a-date')).toThrow(
      /invalid date/,
    )
  })

  it('handles a month with no schedules', () => {
    const grid = computeDutyCalendar([], LEGEND, '2026-05', TODAY)
    const withSchedule = grid.flat().filter((c) => c.schedule)
    expect(withSchedule).toHaveLength(0)
  })

  it('throws on invalid yearMonth format', () => {
    expect(() => computeDutyCalendar([], LEGEND, '2026/05')).toThrow()
    expect(() => computeDutyCalendar([], LEGEND, 'May 2026')).toThrow()
  })

  it('throws on out-of-range month', () => {
    expect(() => computeDutyCalendar([], LEGEND, '2026-00')).toThrow()
    expect(() => computeDutyCalendar([], LEGEND, '2026-13')).toThrow()
  })

  it('cross-month boundary: schedules in April appear in May grid leading cells', () => {
    const aprilSched: Schedule[] = [
      {
        id: 'apr1',
        duty_date: '2026-04-30',
        status: 2,
        base_name: 'PDG',
        base_color: '#10B981',
        duty_type: 'DTY',
        count_schedules: 4,
        count_logbooks: 4,
      },
    ]
    const grid = computeDutyCalendar(aprilSched, LEGEND, '2026-05', TODAY)
    const cell = grid.flat().find((c) => c.date === '2026-04-30')
    expect(cell?.schedule?.id).toBe('apr1')
    expect(cell?.isOutOfMonth).toBe(true)
  })
})

describe('useDutyCalendar — reactive wrapper', () => {
  it('returns a ComputedRef matching the pure function', () => {
    const grid = useDutyCalendar(SCHEDULES, LEGEND, '2026-05', TODAY)
    expect(grid.value).toEqual(computeDutyCalendar(SCHEDULES, LEGEND, '2026-05', TODAY))
  })
})
