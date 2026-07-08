/**
 * Pilot store — exposes the pilot profile from mock-flight-hours.json.
 * Read-only; no mutations expected during this brief.
 */
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import pilotData from '~/assets/data/mock-flight-hours.json'
import type { Pilot } from '~/types'

export const usePilotStore = defineStore('pilot', () => {
  const pilot = ref<Pilot>(pilotData.pilot)

  const name = computed(() => pilot.value.name)
  const pilotId = computed(() => pilot.value.pilotId)
  const totalFlightHours = computed(() => pilot.value.totalFlightHours)

  /** Initials for the Avatar fallback. */
  const initials = computed(() => {
    const parts = pilot.value.name.trim().split(/\s+/)
    const first = parts[0]?.[0] ?? ''
    const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
    return (first + last).toUpperCase() || '?'
  })

  return { pilot, name, pilotId, totalFlightHours, initials }
})
