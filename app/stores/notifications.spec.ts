import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNotificationsStore } from './notifications'

describe('useNotificationsStore', () => {
  beforeEach(() => setActivePinia(createPinia()))

  describe('seed derivation', () => {
    it('seeds exactly one upcoming-flight notification from nextUpcomingFlight', () => {
      const store = useNotificationsStore()
      const upcoming = store.notifications.filter(
        (n) => n.category === 'upcoming-flight',
      )
      expect(upcoming).toHaveLength(1)
      // Body should mention the route + aircraft from the mock's enriched flight.
      expect(upcoming[0]?.body).toMatch(/→/)
      expect(upcoming[0]?.body).toMatch(/Cessna Grand Caravan|LET 410/)
      expect(upcoming[0]?.variant).toBe('info')
      expect(upcoming[0]?.read).toBe(false)
    })

    it('seeds 1-2 schedule-change notifications from upcoming duties (excluding the next)', () => {
      const store = useNotificationsStore()
      const changes = store.notifications.filter(
        (n) => n.category === 'schedule-change',
      )
      // Mock has duties on 2026-06-01, 2026-06-02, 2026-06-03 within the
      // 3-day window after today (2026-05-31), excluding the next-upcoming
      // duty on 2026-05-31 itself. slice(0, 2) → 2 entries.
      expect(changes.length).toBeGreaterThanOrEqual(1)
      expect(changes.length).toBeLessThanOrEqual(2)
      changes.forEach((n) => {
        expect(n.variant).toBe('warning')
        expect(n.body).toMatch(/leg added to .* roster/)
      })
    })

    it('seeds one document-expiry notification per non-safe document', () => {
      const store = useNotificationsStore()
      const exp = store.notifications.filter(
        (n) => n.category === 'document-expiry',
      )
      // Mock: license expired, medical soon, security expired → 3 entries.
      expect(exp).toHaveLength(3)
      const expired = exp.filter((n) => n.variant === 'danger')
      const soon = exp.filter((n) => n.variant === 'warning')
      expect(expired.length).toBe(2) // license + security
      expect(soon.length).toBe(1) // medical
    })

    it('seeds one flight-verified notification from the most recent completed duty', () => {
      const store = useNotificationsStore()
      const verified = store.notifications.filter(
        (n) => n.category === 'flight-verified',
      )
      expect(verified).toHaveLength(1)
      expect(verified[0]?.variant).toBe('success')
      expect(verified[0]?.read).toBe(true) // old news
    })

    it('uses stable IDs prefixed by category', () => {
      const store = useNotificationsStore()
      store.notifications.forEach((n) => {
        expect(n.id).toMatch(
          /^(upcoming-flight|schedule-change|document-expiry|verified-flight):/,
        )
      })
    })
  })

  describe('unreadCount', () => {
    it('counts notifications where read is falsy', () => {
      const store = useNotificationsStore()
      // Seeded mix: upcoming(unread) + schedule changes(mixed) + 3 docs(unread)
      // + verified(read). The exact count is data-driven; assert it matches
      // the array filter so the test doesn't break when the mock changes.
      expect(store.unreadCount).toBe(
        store.notifications.filter((n) => !n.read).length,
      )
      expect(store.unreadCount).toBeGreaterThan(0)
    })
  })

  describe('sortedNotifications', () => {
    it('returns notifications in seed order (newest first)', () => {
      const store = useNotificationsStore()
      const sorted = store.sortedNotifications
      expect(sorted).toHaveLength(store.notifications.length)
      // Seed order is newest-first: upcoming-flight → schedule-change →
      // document-expiry → flight-verified. First sorted item == first seeded.
      expect(sorted[0]?.id).toBe(store.notifications[0]?.id)
      expect(sorted[0]?.category).toBe('upcoming-flight')
      // Last sorted item == the verified flight (oldest, 2 days ago).
      expect(sorted[sorted.length - 1]?.category).toBe('flight-verified')
    })

    it('places the upcoming-flight notification (today) above older events', () => {
      const store = useNotificationsStore()
      const sorted = store.sortedNotifications
      const upcomingIdx = sorted.findIndex((n) => n.category === 'upcoming-flight')
      const verifiedIdx = sorted.findIndex((n) => n.category === 'flight-verified')
      expect(upcomingIdx).toBeLessThan(verifiedIdx)
    })

    it('does not mutate the underlying notifications array', () => {
      const store = useNotificationsStore()
      const original = [...store.notifications]
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      store.sortedNotifications
      expect(store.notifications.map((n) => n.id)).toEqual(original.map((n) => n.id))
    })
  })

  describe('markAsRead', () => {
    it('flips the targeted notification to read=true', () => {
      const store = useNotificationsStore()
      const firstUnread = store.notifications.find((n) => !n.read)!
      const before = store.unreadCount
      store.markAsRead(firstUnread.id)
      expect(firstUnread.read).toBe(true)
      expect(store.unreadCount).toBe(before - 1)
    })

    it('is a no-op for an unknown id', () => {
      const store = useNotificationsStore()
      const before = store.unreadCount
      store.markAsRead('does-not-exist')
      expect(store.unreadCount).toBe(before)
    })

    it('is a no-op for an already-read notification', () => {
      const store = useNotificationsStore()
      const alreadyRead = store.notifications.find((n) => n.read)
      if (!alreadyRead) return // seed should always include at least one read
      const before = store.unreadCount
      store.markAsRead(alreadyRead.id)
      expect(store.unreadCount).toBe(before)
    })
  })

  describe('markAllAsRead', () => {
    it('flips every notification to read=true', () => {
      const store = useNotificationsStore()
      store.markAllAsRead()
      expect(store.notifications.every((n) => n.read)).toBe(true)
      expect(store.unreadCount).toBe(0)
    })
  })
})
