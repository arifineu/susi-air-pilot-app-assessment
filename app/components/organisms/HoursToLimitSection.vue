<script setup lang="ts">
/**
 * HoursToLimitSection
 * The dashboard's most complex organism. Composes:
 *   - RangeToggleGroup (1w / 1m / 3m / 6m / 1y)
 *   - FlightHoursTrendChart (driven by useRollingSum at the active range)
 *   - 4 LimitCards (driven by useFlightLimits, INDEPENDENT of the range toggle)
 *
 * Per brief §3.2: the chart's ±7-day display window is fixed; only the
 * summation width (windowDays) changes with the toggle. The 4 LimitCards
 * always show daily/weekly/monthly/annual regardless of the toggle.
 */
import FlightHoursTrendChart from './FlightHoursTrendChart.vue'
import type { ChartBounds, ChartRangeKey, FlightHour, FlightLimits } from '~/types'

interface Props {
  flightHours: FlightHour[]
  limits: FlightLimits
  chartBounds: Record<ChartRangeKey, ChartBounds>
  today?: string
  initialRange?: ChartRangeKey
}
const props = withDefaults(defineProps<Props>(), {
  today: '2026-05-31',
  initialRange: '1w',
})

const emit = defineEmits<{ (e: 'range-change', value: ChartRangeKey): void }>()

const range = ref<ChartRangeKey>(props.initialRange)

const activeBounds = computed(() => props.chartBounds[range.value])

// Chart series — display window is ±7 days regardless of windowDays.
const series = useRollingSum(
  () => props.flightHours,
  () => props.today,
  () => activeBounds.value.windowDays,
  () => activeBounds.value.displayRangeDays,
)

// 4 limit cards — independent of range toggle.
const cards = useFlightLimits(
  () => props.flightHours,
  () => props.limits,
  () => props.today,
)

function onRangeChange(value: string) {
  range.value = value as ChartRangeKey
  emit('range-change', range.value)
}
</script>

<template>
  <section class="hours-to-limit-section">
    <header class="hours-to-limit-section__header">
      <h2 class="hours-to-limit-section__title">Hours to Limit</h2>
      <RangeToggleGroup :model-value="range" @update:model-value="onRangeChange" />
    </header>

    <div class="hours-to-limit-section__chart">
      <FlightHoursTrendChart
        :series="series"
        :limit="activeBounds.limit"
        :max="activeBounds.max"
        unit="h"
      />
    </div>

    <div class="hours-to-limit-section__cards">
      <LimitCard
        v-for="card in cards"
        :key="card.key"
        :label="card.label"
        :value="card.value"
        :limit="card.limit"
        :unit="card.unit"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
.hours-to-limit-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  background: var(--color-surface);
  border-radius: var(--radius-card);
  padding: var(--space-4);
  box-shadow: var(--shadow-sm);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    flex-wrap: wrap;
  }

  &__title {
    margin: 0;
    font-size: var(--fs-lg);
    font-weight: var(--fw-bold);
    color: var(--color-text-primary);
  }

  &__chart {
    width: 100%;
  }

  &__cards {
    display: grid;
    // Mobile (phones + large phones) → strict 2x2. Each cell can shrink
    // because min-width: 0 was removed from .limit-card.
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-3);

    // Tablet and up → 4 across (plenty of width to fit them comfortably).
    @media (min-width: 768px) {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }
}
</style>
