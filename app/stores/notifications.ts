/**
 * Notifications store — derives the initial notification feed from sibling
 * stores (schedules + documents) and exposes mark-as-read actions.
 *
 * Derivation is one-shot at store init: notifications reflect whatever the
 * mock data shows when the store first spins up. Read state is in-memory
 * only and resets on reload — fine for a mock-only app; would need
 * pinia-plugin-persistedstate for real persistence.
 *
 * The "schedule change" category is honest about its limits: the mock has
 * no change history, so we frame the next 1-2 upcoming duties (excluding
 * the very next one, which gets its own "duty starts soon" entry) as
 * schedule reminders. README documents this as a known limitation.
 */
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useSchedulesStore } from '~/stores/schedules'
import { useDocumentsStore } from '~/stores/documents'
import { addDays } from '~/utils/format'
import type { NotificationItem } from '~/types'

/** Window after today for "schedule change" reminders (excludes today itself). */
const SCHEDULE_REMINDER_WINDOW_DAYS = 3

function relativeDayLabel(todayIso: string, targetIso: string): string {
  // Both inputs are yyyy-mm-dd. diff is integer days; UTC math avoids DST shift.
  const t = new Date(`${todayIso}T00:00:00Z`).getTime()
  const target = new Date(`${targetIso}T00:00:00Z`).getTime()
  const diffDays = Math.round((target - t) / 86_400_000)
  if (diffDays === 1) return 'tomorrow'
  if (diffDays === 2) return 'in 2 days'
  if (diffDays === 3) return 'in 3 days'
  if (diffDays > 3) return `in ${diffDays} days`
  return targetIso
}

function seedNotifications(): NotificationItem[] {
  const schedulesStore = useSchedulesStore()
  const documentsStore = useDocumentsStore()
  const today = schedulesStore.today
  const out: NotificationItem[] = []

  // 1. Upcoming flight — the next leg the pilot is scheduled to fly.
  let nextScheduleId: string | undefined
  const next = schedulesStore.nextUpcomingFlight
  if (next) {
    const { flight, schedule } = next
    out.push({
      id: `upcoming-flight:${flight.id}`,
      title: 'Duty starts in 2 hours',
      body: `${flight.departure.icao} → ${flight.arrival.icao}, ${flight.aircraft}. Report by ${flight.departure.time} LT.`,
      time: `Today, ${flight.departure.time}`,
      read: false,
      variant: 'info',
      category: 'upcoming-flight',
    })
    nextScheduleId = schedule.id
  }

  // 2. Schedule change reminders — upcoming duties within the next 3 days
  //    (excluding the very next one, which got the duty-starts entry above).
  //    Mock has no change history; we frame these as "leg added to {day}'s
  //    roster" so the user sees a plausible schedule-change notification.
  const windowEnd = addDays(today, SCHEDULE_REMINDER_WINDOW_DAYS)
  const upcomingDuties = schedulesStore.schedules
    .filter(
      (s) =>
        s.status === 1 &&
        s.duty_date > today &&
        s.duty_date <= windowEnd &&
        s.id !== nextScheduleId,
    )
    .sort((a, b) => a.duty_date.localeCompare(b.duty_date))
    .slice(0, 2)

  upcomingDuties.forEach((s, i) => {
    out.push({
      id: `schedule-change:${s.id}`,
      title: 'Schedule change',
      body: `${s.base_name} leg added to ${relativeDayLabel(today, s.duty_date)}'s roster.`,
      time: i === 0 ? '1h ago' : 'Yesterday',
      read: i === 1, // mark the older one as already-read for visual variety
      variant: 'warning',
      category: 'schedule-change',
    })
  })

  // 3. Document expiry — one notification per non-safe document.
  documentsStore.documentsWithExpiry
    .filter((d) => d.status !== 'safe')
    .forEach((d) => {
      const expired = d.status === 'expired'
      out.push({
        id: `document-expiry:${d.id}`,
        title: expired ? `${d.label} expired` : `${d.label} expires soon`,
        body: expired
          ? `Expired ${Math.abs(d.daysRemaining)} days ago. Contact CRD before your next duty.`
          : `${d.daysRemaining} days remaining — renew before ${d.expiryDate}.`,
        time: expired ? 'Yesterday' : '2 days ago',
        read: false,
        variant: expired ? 'danger' : 'warning',
        category: 'document-expiry',
      })
    })

  // 4. Verified flight — most recent completed duty with a verified leg.
  //    Most completed duties in the mock don't have an enriched flights[]
  //    array, so we fall back to the duty's base_name when no leg detail.
  const verifiedSchedule = schedulesStore.schedules
    .filter((s) => s.status === 2)
    .sort((a, b) => b.duty_date.localeCompare(a.duty_date))[0]
  if (verifiedSchedule) {
    const verifiedFlight = verifiedSchedule.flights?.find((f) => f.status === 2)
    out.push({
      id: `verified-flight:${verifiedFlight?.id ?? verifiedSchedule.id}`,
      title: 'Flight log verified',
      body: verifiedFlight
        ? `Cruise log for flight ${verifiedFlight.flight_number} has been countersigned.`
        : `Cruise log for duty at ${verifiedSchedule.base_name} has been countersigned.`,
      time: '2 days ago',
      read: true, // already-read — old news
      variant: 'success',
      category: 'flight-verified',
    })
  }

  return out
}

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<NotificationItem[]>(seedNotifications())

  const unreadCount = computed(() =>
    notifications.value.filter((n) => !n.read).length,
  )

  // Seed order IS newest-first by design: upcoming-flight (today) → schedule
  // changes (1h ago / yesterday) → document-expiry (yesterday / 2 days ago)
  // → flight-verified (2 days ago, read). No reverse — the seed function
  // already orders by descending recency. Returns a fresh array so consumers
  // can't mutate the underlying state.
  const sortedNotifications = computed(() => [...notifications.value])

  function markAsRead(id: string) {
    const n = notifications.value.find((x) => x.id === id)
    if (n) n.read = true
  }

  function markAllAsRead() {
    notifications.value.forEach((n) => {
      n.read = true
    })
  }

  return { notifications, unreadCount, sortedNotifications, markAsRead, markAllAsRead }
})
