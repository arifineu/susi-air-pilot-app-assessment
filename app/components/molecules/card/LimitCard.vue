<script setup lang="ts">
/**
 * LimitCard
 * One of the 4 daily/weekly/monthly/annual limit cards on the dashboard.
 * Uses ProgressRing as the central visual.
 */
import { formatHours, formatHoursOrMinutes, roundHours } from '~/utils/format'

interface Props {
  label: string
  value: number
  limit: number
  unit?: string
  /** Override ProgressRing defaults (0.8 / 1.0). */
  warningThreshold?: number
  dangerThreshold?: number
}
const props = withDefaults(defineProps<Props>(), {
  unit: 'h',
  warningThreshold: 0.8,
  dangerThreshold: 1,
})

const state = computed<'safe' | 'warning' | 'danger'>(() => {
  const ratio = props.limit > 0 ? props.value / props.limit : 0
  if (ratio >= props.dangerThreshold) return 'danger'
  if (ratio >= props.warningThreshold) return 'warning'
  return 'safe'
})

const remaining = computed(() => Math.max(0, props.limit - props.value))

// Display formatters — keeps raw values precise upstream while avoiding
// IEEE-754 noise like "24.599999999999998h" in the UI.
const _valueText = computed(() => formatHours(props.value, props.unit))
// Remaining switches to minutes under 1h so "0.7h left" reads as "42m left".
const remainingText = computed(() => formatHoursOrMinutes(remaining.value, props.unit))
const limitText = computed(() => formatHours(props.limit, props.unit))
</script>

<template>
  <div class="limit-card" :class="`limit-card--${state}`">
    <AtomsFeedbackProgressRing
      :value="value"
      :max="limit"
      :unit="unit"
      :label="label"
      :warning-threshold="warningThreshold"
      :danger-threshold="dangerThreshold"
      :format-value="(n: number) => String(roundHours(n))"
    />
    <div class="limit-card__meta">
      <span class="limit-card__remaining">
        <span class="limit-card__remaining-value">{{ remainingText }}</span>
        <span class="limit-card__remaining-label">left</span>
      </span>
      <span class="limit-card__limit">of {{ limitText }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.limit-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  background: var(--color-surface);
  border-radius: var(--radius-card);
  padding: var(--space-4) var(--space-3);
  box-shadow: var(--shadow-sm);
  min-width: 0;

  &--warning {
    box-shadow: var(--shadow-sm), 0 0 0 1px rgba(245, 158, 11, 0.2);
  }

  &--danger {
    box-shadow: var(--shadow-sm), 0 0 0 1px rgba(230, 55, 87, 0.25);
  }

  &__meta {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  &__remaining {
    display: inline-flex;
    align-items: baseline;
    gap: 4px;
  }

  &__remaining-value {
    font-size: var(--fs-md);
    font-weight: var(--fw-bold);
    color: var(--color-text-primary);
  }

  &__remaining-label {
    font-size: var(--fs-xs);
    color: var(--color-text-secondary);
  }

  &__limit {
    font-size: var(--fs-xs);
    color: var(--color-text-muted);
  }
}
</style>
