import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePilotStore } from './pilot'

describe('usePilotStore', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('exposes name, pilotId, and totalFlightHours from JSON', () => {
    const store = usePilotStore()
    expect(store.name).toBe('John Doe')
    expect(store.pilotId).toBe('PSA-1042')
    expect(store.totalFlightHours).toBe(1444.5)
  })

  it('derives initials from the name', () => {
    const store = usePilotStore()
    expect(store.initials).toBe('JD')
  })
})
