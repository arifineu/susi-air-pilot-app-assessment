<script setup lang="ts">
/**
 * LimitCard
 * One of the 4 daily/weekly/monthly/annual limit cards on the dashboard.
 * Uses ProgressBar (linear) as the central visual.
 *
 * Layout: label (DAILY) → value/limit (4.3 / 8h) → bar → remaining (3.7h left).
 * Threshold state (safe/warning/danger) drives both the card's outer ring
 * (box-shadow) and the ProgressBar's fill color via the same thresholds.
 */
import { formatHours, formatHoursOrMinutes, roundHours } from '~/utils/format'

interface Props {
  label: string
  value: number
  limit: number
  unit?: string
  /** Override ProgressBar defaults (0.8 / 1.0). */
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

// "4.3" or "1025.3" — strip trailing .0 so whole hours render as "8" not "8.0".
// Unit lives on the limit side only, per the requested "4.3 / 8h" format.
const currentValue = computed(() => String(roundHours(props.value, 1)))
const limitText = computed(() => formatHours(props.limit, props.unit))

// Remaining switches to minutes under 1h so "0.7h left" reads as "42m left".
const remainingText = computed(() => formatHoursOrMinutes(remaining.value, props.unit))
</script>

<template>
  <div class="limit-card" :class="`limit-card--${state}`">
    <span class="limit-card__label">{{ label }}</span>
    <p class="limit-card__value">
      <span class="limit-card__value-current">{{ currentValue }}</span>
      <span class="limit-card__value-sep" aria-hidden="true"> / </span>
      <span class="limit-card__value-limit">{{ limitText }}</span>
    </p>
    <AtomsFeedbackProgressBar
      :value="value"
      :max="limit"
      :warning-threshold="warningThreshold"
      :danger-threshold="dangerThreshold"
      :show-value="false"
      :height="6"
    />
    <p class="limit-card__remaining">
      <span class="limit-card__remaining-value">{{ remainingText }}</span>
      <span class="limit-card__remaining-label">left</span>
    </p>
  </div>
</template>

<style scoped lang="scss">
.limit-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: var(--space-4) var(--space-3);
  box-shadow: var(--shadow-sm);
  min-width: 0;

  &--warning {
    box-shadow: var(--shadow-sm), 0 0 0 1px rgba(245, 158, 11, 0.2);
  }

  &--danger {
    box-shadow: var(--shadow-sm), 0 0 0 1px rgba(230, 55, 87, 0.25);
  }

  &__label {
    font-size: var(--fs-xs);
    font-weight: var(--fw-bold);
    color: var(--color-text-secondary);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  &__value {
    margin: 0;
    display: flex;
    align-items: baseline;
    gap: 2px;
    font-size: var(--fs-md);
    color: var(--color-text-primary);
  }

  &__value-current {
    font-weight: var(--fw-bold);
  }

  &__value-sep,
  &__value-limit {
    color: var(--color-text-secondary);
    font-weight: var(--fw-semibold);
  }

  &__remaining {
    margin: 0;
    display: inline-flex;
    align-items: baseline;
    gap: 4px;
  }

  &__remaining-value {
    font-size: var(--fs-sm);
    font-weight: var(--fw-bold);
    color: var(--color-text-primary);
  }

  &__remaining-label {
    font-size: var(--fs-xs);
    color: var(--color-text-muted);
  }
}
</style>
