<script setup lang="ts">
/**
 * UpcomingFlightCard
 * Surfaces the next upcoming flight leg on the dashboard. Renders flight-level
 * detail (flight number, dep→arr ICAO+city, dep/arr times, aircraft, duration)
 * sourced from the enriched mock data — no fabricated route.
 *
 * Emits `view-all` when the "View all" button is tapped. The button only
 * renders when the parent schedule has more than one leg, since single-leg
 * days have nothing else to show.
 */
import { formatDuration, formatDateLong } from '~/utils/format'
import type { Flight, Schedule } from '~/types'

interface Props {
  flight: Flight
  schedule: Schedule
}
const props = defineProps<Props>()
defineEmits<{ (e: 'view-all'): void }>()

const statusVariant = computed<'safe' | 'neutral'>(() =>
  props.schedule.status === 2 ? 'safe' : 'neutral',
)
const statusLabel = computed(() => (props.schedule.status === 2 ? 'Verified' : 'Upcoming'))
const formattedDate = computed(() => formatDateLong(props.schedule.duty_date))
const hasMultipleLegs = computed(() => props.schedule.count_schedules > 1)
</script>

<template>
  <article class="upcoming-flight-card">
    <header class="upcoming-flight-card__header">
      <span class="upcoming-flight-card__label">Next flight</span>
      <AtomsDisplayBadge :variant="statusVariant" :label="statusLabel" />
    </header>

    <p class="upcoming-flight-card__date">{{ formattedDate }}</p>

    <MoleculesFlightRoute
      :departure="flight.departure"
      :arrival="flight.arrival"
      :flight-number="flight.flight_number"
    />

    <footer class="upcoming-flight-card__times">
      <div class="upcoming-flight-card__time">
        <span class="upcoming-flight-card__time-label">Dep</span>
        <span class="upcoming-flight-card__time-value">{{ flight.departure.time }}</span>
      </div>
      <div class="upcoming-flight-card__time upcoming-flight-card__time--arr">
        <span class="upcoming-flight-card__time-label">Arr</span>
        <span class="upcoming-flight-card__time-value">{{ flight.arrival.time }}</span>
      </div>
    </footer>

    <p class="upcoming-flight-card__meta">
      <span class="upcoming-flight-card__meta-value">{{ formatDuration(flight.duration_minutes) }}</span>
      <span class="upcoming-flight-card__meta-sep" aria-hidden="true">·</span>
      <span>{{ flight.aircraft }}</span>
      <span class="upcoming-flight-card__meta-sep" aria-hidden="true">·</span>
      <span>{{ flight.aircraft_registration }}</span>
    </p>

    <AtomsFormBaseButton
      v-if="hasMultipleLegs"
      variant="ghost"
      size="sm"
      class="upcoming-flight-card__view-all"
      @click="$emit('view-all')"
    >
      View all ({{ schedule.count_schedules }})
    </AtomsFormBaseButton>
  </article>
</template>

<style scoped lang="scss">
.upcoming-flight-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  background: var(--color-surface);
  border-radius: var(--radius-card);
  padding: var(--space-4);
  box-shadow: var(--shadow-sm);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
  }

  &__label {
    font-size: var(--fs-base-sm);
    font-weight: var(--fw-semibold);
    color: var(--color-text-secondary);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  &__date {
    margin: 0;
    font-size: var(--fs-base-sm);
    color: var(--color-text-secondary);
    font-weight: var(--fw-medium);
  }

  &__times {
    display: flex;
    justify-content: space-between;
    gap: var(--space-4);
    padding-top: var(--space-3);
    border-top: 1px solid var(--color-border);
  }

  &__time {
    display: flex;
    flex-direction: column;
    line-height: 1.2;

    &--arr {
      text-align: right;
      align-items: flex-end;
    }
  }

  &__time-label {
    font-size: var(--fs-xs);
    color: var(--color-text-muted);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  &__time-value {
    font-size: var(--fs-md);
    font-weight: var(--fw-bold);
    color: var(--color-text-primary);
    margin-top: 2px;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: var(--space-1) var(--space-2);
    margin: 0;
    font-size: var(--fs-sm);
    color: var(--color-text-secondary);
  }

  &__meta-value {
    font-weight: var(--fw-bold);
    color: var(--color-text-primary);
  }

  &__meta-sep {
    color: var(--color-text-muted);
  }

  &__view-all {
    align-self: flex-start;
    margin-top: var(--space-1);
  }
}
</style>
