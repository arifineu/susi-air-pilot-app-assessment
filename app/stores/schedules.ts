/**
 * Schedules store — exposes the legend + schedules from mock-schedules.json.
 * Drives the calendar grid and the schedule legend list.
 */
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import schedulesData from '~/assets/data/mock-schedules.json'
import type { Flight, Legend, Schedule } from '~/types'

export const useSchedulesStore = defineStore('schedules', () => {
  const today = ref<string>(schedulesData.today)
  // Clone the JSON-imported arrays so consumer mutation (e.g. tests changing
  // status fields) doesn't leak into the module-level singleton and pollute
  // other consumers. structuredClone keeps the nested `flights[]` intact.
  const legend = ref<Legend[]>(structuredClone(schedulesData.legend))
  const schedules = ref<Schedule[]>(structuredClone(schedulesData.schedules))

  /** Lookup map: duty_type code → legend entry. */
  const legendByCode = computed<Record<string, Legend>>(() => {
    const map: Record<string, Legend> = {}
    for (const entry of legend.value) {
      map[entry.code] = entry
    }
    return map
  })

  /** Lookup map: ISO date → schedule. */
  const scheduleByDate = computed<Map<string, Schedule>>(() => {
    const map = new Map<string, Schedule>()
    for (const s of schedules.value) {
      map.set(s.duty_date, s)
    }
    return map
  })

  /**
   * Next upcoming duty for the dashboard: first pending schedule (status=1)
   * with duty_date >= today, sorted ascending. Undefined if none qualify.
   *
   * Uses string compare on ISO yyyy-mm-dd — safe because all dates share
   * the same zero-padded format.
   */
  const nextUpcomingSchedule = computed<Schedule | undefined>(() => {
    const todayIso = today.value
    return (
      schedules.value
        .filter((s) => s.status === 1 && s.duty_date >= todayIso)
        .sort((a, b) => a.duty_date.localeCompare(b.duty_date))[0] ?? undefined
    )
  })

  /**
   * Next upcoming flight leg for the dashboard card. Scans schedules in date
   * order (today onward, status=1), then flights within each schedule for the
   * first leg with status=1 (upcoming). Returns both so the card can render
   * the day-level status badge + count_schedules alongside the flight detail.
   */
  const nextUpcomingFlight = computed<{ schedule: Schedule; flight: Flight } | undefined>(() => {
    const todayIso = today.value
    const ordered = schedules.value
      .filter((s) => s.status === 1 && s.duty_date >= todayIso)
      .sort((a, b) => a.duty_date.localeCompare(b.duty_date))
    for (const schedule of ordered) {
      const flight = (schedule.flights ?? []).find((f) => f.status === 1)
      if (flight) return { schedule, flight }
    }
    return undefined
  })

  /**
   * All flight legs for a given ISO date, sorted by departure time ascending.
   * Empty when the schedule has no `flights` array (most non-enriched duties).
   */
  function flightsForDate(date: string): Flight[] {
    const schedule = scheduleByDate.value.get(date)
    if (!schedule?.flights) return []
    return [...schedule.flights].sort((a, b) =>
      a.departure.time.localeCompare(b.departure.time),
    )
  }

  return {
    today,
    legend,
    schedules,
    legendByCode,
    scheduleByDate,
    nextUpcomingSchedule,
    nextUpcomingFlight,
    flightsForDate,
  }
})
