/**
 * useDutyCalendar
 *
 * Builds a 6-week (42-cell) month grid for the schedule view. Per brief §3
 * (Phase 5 schedule page):
 *
 *   - Grid cell coloring driven from `legend[]` lookup by `schedule.duty_type`
 *     (never hardcode "DTY"/"TRD"/etc. — drive entirely from JSON)
 *   - Tap-a-date emits an event; pages decide what to do with it
 *   - Today highlighted via `isToday` flag
 *
 * Layout: always 6 rows × 7 cols (42 cells), starting from the Sunday on or
 * before day 1 of `yearMonth`. Predictable grid size keeps CSS layout stable.
 */
import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from 'vue'
import type { Legend, Schedule } from '~/types'

const DAY_MS = 86_400_000
const DEFAULT_TODAY = '2026-05-31'

export interface DutyCalendarCell {
  /** ISO yyyy-mm-dd */
  date: string
  /** Day-of-month number 1..31 (or trailing/leading day-of-month for out-of-month cells). */
  dayNumber: number
  /** Matched schedule, if any. Undefined = no duty that day. */
  schedule?: Schedule
  /** True if this cell falls outside the active yearMonth (leading/trailing days). */
  isOutOfMonth: boolean
  /** True only when cell.date === today. */
  isToday: boolean
}

function parseUtcMidnight(date: string): Date {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) {
    throw new Error(`useDutyCalendar: invalid date "${date}"`)
  }
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
}

function isoDate(d: Date): string {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * Pure primitive. Builds the 6×7 grid for the given yearMonth.
 *
 * The `legend` arg is currently unused by this function but accepted so the
 * wrapper signature matches the consumer's mental model (legend drives color
 * at render time via CalendarDay's `baseColor` prop, which already exists on
 * the schedule record itself).
 */
export function computeDutyCalendar(
  schedules: Schedule[],
  _legend: Legend[],
  yearMonth: string, // 'yyyy-mm'
  today: string = DEFAULT_TODAY,
): DutyCalendarCell[][] {
  const match = /^(\d{4})-(\d{2})$/.exec(yearMonth)
  if (!match) {
    throw new Error(`useDutyCalendar: yearMonth must be 'yyyy-mm', got "${yearMonth}"`)
  }
  const year = Number(match[1])
  const month = Number(match[2]) // 1..12

  if (month < 1 || month > 12) {
    throw new Error(`useDutyCalendar: month must be 1..12, got ${month}`)
  }

  const todayIso = isoDate(parseUtcMidnight(today))

  // Index schedules by ISO date for O(1) lookup.
  const byDate = new Map<string, Schedule>()
  for (const s of schedules) {
    byDate.set(s.duty_date, s)
  }

  // First day of the month, UTC midnight.
  const firstOfMonth = new Date(Date.UTC(year, month - 1, 1))
  // Day of week: 0=Sun, 1=Mon, ... 6=Sat. We start the grid on Sunday.
  const firstDow = firstOfMonth.getUTCDay()
  // Grid start: first Sunday on or before day 1.
  const gridStart = new Date(firstOfMonth.getTime() - firstDow * DAY_MS)

  const grid: DutyCalendarCell[][] = []
  for (let row = 0; row < 6; row++) {
    const cells: DutyCalendarCell[] = []
    for (let col = 0; col < 7; col++) {
      const offset = row * 7 + col
      const cellDate = new Date(gridStart.getTime() + offset * DAY_MS)
      const iso = isoDate(cellDate)
      const cellMonth = cellDate.getUTCMonth() + 1
      cells.push({
        date: iso,
        dayNumber: cellDate.getUTCDate(),
        schedule: byDate.get(iso),
        isOutOfMonth: cellMonth !== month,
        isToday: iso === todayIso,
      })
    }
    grid.push(cells)
  }
  return grid
}

/** Reactive wrapper. */
export function useDutyCalendar(
  schedules: MaybeRefOrGetter<Schedule[]>,
  legend: MaybeRefOrGetter<Legend[]>,
  yearMonth: MaybeRefOrGetter<string>,
  today: MaybeRefOrGetter<string> = DEFAULT_TODAY,
): ComputedRef<DutyCalendarCell[][]> {
  return computed(() =>
    computeDutyCalendar(toValue(schedules), toValue(legend), toValue(yearMonth), toValue(today)),
  )
}
