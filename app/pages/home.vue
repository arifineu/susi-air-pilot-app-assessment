<script setup lang="ts">
/**
 * Dashboard (Home) — composes the 5 dashboard organisms with data from
 * 5 Pinia stores. All mock data; no fetches.
 *
 * Reference "today" for flight hours is 2026-05-31 (per brief §3.2), while
 * schedules use their own today (2026-05-15) from mock-schedules.json.
 *
 * Phase 6: data is gated by useLoadingDelay so skeletons are demonstrable.
 */
import { usePilotStore } from '~/stores/pilot'
import { useSchedulesStore } from '~/stores/schedules'
import { navigateTo } from '#app'
import { useFlightHoursStore } from '~/stores/flightHours'
import { useDocumentsStore } from '~/stores/documents'
import { useNewsStore } from '~/stores/news'
import type { NotificationItem } from '~/types'

definePageMeta({ layout: 'default' })

const pilotStore = usePilotStore()
const schedulesStore = useSchedulesStore()
const flightHoursStore = useFlightHoursStore()
const documentsStore = useDocumentsStore()
const newsStore = useNewsStore()

function onLogout() {
  // No real auth — just return to the sign-in screen.
  navigateTo('/')
}

// Dummy notifications for the bell dropdown. No backend; the brief ships
// with mock data only. Mixed read/unread so the unread badge is meaningful.
const notifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Duty starts in 2 hours',
    body: 'PDG → PLM, Airbus ATR 72-600. Report by 14:30 LT.',
    time: '12m ago',
    variant: 'info',
  },
  {
    id: 'n2',
    title: 'Schedule change',
    body: 'PKU → BTH leg added to tomorrow\'s roster.',
    time: '1h ago',
    variant: 'warning',
  },
  {
    id: 'n3',
    title: 'Medical certificate expires soon',
    body: '14 days remaining — renew before 22 July 2026.',
    time: 'Yesterday',
    variant: 'warning',
  },
  {
    id: 'n4',
    title: 'Flight log verified',
    body: 'Cruise log for flight SJO-320 has been countersigned.',
    time: '2 days ago',
    read: true,
    variant: 'success',
  },
]

const loading = useLoadingDelay(600)

// Per brief §3.2, the chart's dev "today" is 2026-05-31.
const FLIGHT_HOURS_TODAY = '2026-05-31'

// Decode the next upcoming schedule's base_name into a fake departure/arrival
// pair. The mock doesn't include route legs, so we surface the duty's base
// as the arrival and Padang (PDG) as the canonical departure.
const upcomingDeparture = computed(() => ({ icao: 'PDG', city: 'Padang' }))
const upcomingArrival = computed(() => {
  const next = schedulesStore.nextUpcomingSchedule
  return next ? { icao: next.base_name } : { icao: '—' }
})
</script>

<template>
  <div class="home-page">
    <OrganismsDashboardHeader
      :pilot-name="pilotStore.name"
      :pilot-id="pilotStore.pilotId"
      :total-flight-hours="pilotStore.totalFlightHours"
      :notifications="notifications"
      @logout="onLogout"
    />

    <section class="home-page__section">
      <template v-if="loading">
        <div class="home-page__skeleton-card">
          <AtomsFeedbackSkeleton variant="rect" :height="140" />
        </div>
      </template>
      <OrganismsDashboardUpcomingFlightCard
        v-else-if="schedulesStore.nextUpcomingSchedule"
        :schedule="schedulesStore.nextUpcomingSchedule"
        :departure="upcomingDeparture"
        :arrival="upcomingArrival"
      />
    </section>

    <section class="home-page__section">
      <template v-if="loading">
        <h2 class="home-page__skeleton-title"><AtomsFeedbackSkeleton variant="text" :width="120" :height="18" /></h2>
        <div class="home-page__skeleton-news">
          <AtomsFeedbackSkeleton variant="rect" :height="220" radius="14" />
          <AtomsFeedbackSkeleton variant="rect" :height="220" radius="14" />
        </div>
      </template>
      <OrganismsNewsLatestNewsCarousel v-else :items="newsStore.items" />
    </section>

    <section class="home-page__section">
      <template v-if="loading">
        <div class="home-page__skeleton-hours">
          <AtomsFeedbackSkeleton variant="rect" :height="40" radius="24" :width="220" />
          <AtomsFeedbackSkeleton variant="rect" :height="180" />
          <div class="home-page__skeleton-cards">
            <AtomsFeedbackSkeleton variant="rect" :height="140" />
            <AtomsFeedbackSkeleton variant="rect" :height="140" />
            <AtomsFeedbackSkeleton variant="rect" :height="140" />
            <AtomsFeedbackSkeleton variant="rect" :height="140" />
          </div>
        </div>
      </template>
      <OrganismsDashboardHoursToLimitSection
        v-else
        :flight-hours="flightHoursStore.flightHours"
        :limits="flightHoursStore.limits"
        :chart-bounds="flightHoursStore.chartBounds"
        :today="FLIGHT_HOURS_TODAY"
      />
    </section>

    <section class="home-page__section">
      <OrganismsDocumentsMyDocumentsList
        :documents="documentsStore.documents"
        :today="documentsStore.today"
        :warning-days="documentsStore.warningDays"
      />
    </section>
  </div>
</template>

<style scoped lang="scss">
.home-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: 0 var(--space-4);

  &__section {
    width: 100%;
  }

  &__skeleton-card {
    background: var(--color-surface);
    border-radius: var(--radius-card);
    overflow: hidden;
    padding: var(--space-4);
  }

  &__skeleton-title {
    margin: 0 0 var(--space-3) var(--space-2);
  }

  &__skeleton-news {
    display: flex;
    gap: var(--space-3);
    overflow: hidden;
  }

  &__skeleton-hours {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    background: var(--color-surface);
    border-radius: var(--radius-card);
    padding: var(--space-4);
  }

  &__skeleton-cards {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-3);
  }
}
</style>
