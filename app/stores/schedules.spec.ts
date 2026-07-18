import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSchedulesStore } from './schedules'

describe('useSchedulesStore', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('exposes today, legend, schedules from JSON', () => {
    const store = useSchedulesStore()
    expect(store.today).toBe('2026-05-31')
    expect(store.legend.length).toBeGreaterThan(0)
    expect(store.schedules.length).toBeGreaterThan(0)
  })

  it('legendByCode maps code → legend entry', () => {
    const store = useSchedulesStore()
    expect(store.legendByCode.DTY?.label).toBe('On Duty')
    expect(store.legendByCode.TRD?.label).toBe('Travel Day')
  })

  it('scheduleByDate maps ISO date → schedule', () => {
    const store = useSchedulesStore()
    const sched = store.scheduleByDate.get('2026-05-31')
    expect(sched?.base_name).toBe('MKW')
    expect(sched?.duty_type).toBe('DTY')
  })

  describe('nextUpcomingSchedule', () => {
    it('returns the earliest pending schedule on or after today', () => {
      const store = useSchedulesStore()
      // schedules.json today = 2026-05-31; first pending schedule on/after
      // that date is the 2026-05-31 MKW duty itself (status=1).
      expect(store.nextUpcomingSchedule?.duty_date).toBe('2026-05-31')
      expect(store.nextUpcomingSchedule?.status).toBe(1)
    })

    it('skips completed duties (status=2)', () => {
      const store = useSchedulesStore()
      // All duties before 2026-05-31 are status=2 — none should be selected.
      // String compare on ISO dates works because they're zero-padded.
      const next = store.nextUpcomingSchedule?.duty_date ?? ''
      expect(next >= '2026-05-31').toBe(true)
    })

    it('returns undefined when no pending schedule qualifies', () => {
      // Mutate the store: mark all as completed.
      const store = useSchedulesStore()
      store.schedules.forEach((s) => {
        s.status = 2
      })
      expect(store.nextUpcomingSchedule).toBeUndefined()
    })
  })

  describe('nextUpcomingFlight', () => {
    it('returns the first upcoming flight + its schedule', () => {
      const store = useSchedulesStore()
      const next = store.nextUpcomingFlight
      expect(next).toBeDefined()
      expect(next?.schedule.duty_date).toBe('2026-05-31')
      // First upcoming leg on 2026-05-31 is SSI-2204 (PDG→MKW 14:30); the
      // earlier SSI-1801 (08:30) is status=2 (completed).
      expect(next?.flight.flight_number).toBe('SSI-2204')
      expect(next?.flight.status).toBe(1)
    })

    it('returns undefined when no upcoming flight qualifies', () => {
      const store = useSchedulesStore()
      store.schedules.forEach((s) => {
        s.status = 2
        s.flights?.forEach((f) => {
          f.status = 2
        })
      })
      expect(store.nextUpcomingFlight).toBeUndefined()
    })
  })

  describe('flightsForDate', () => {
    it('returns flights for the date sorted by departure time', () => {
      const store = useSchedulesStore()
      const flights = store.flightsForDate('2026-05-31')
      expect(flights).toHaveLength(3)
      expect(flights.map((f) => f.departure.time)).toEqual(['08:30', '14:30', '18:00'])
    })

    it('returns an empty array for dates with no enriched schedule', () => {
      const store = useSchedulesStore()
      expect(store.flightsForDate('2026-04-01')).toEqual([])
    })
  })
})
