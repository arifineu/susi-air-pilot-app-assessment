<script setup lang="ts">
/**
 * ProgressBar
 * Linear variant of ProgressRing. Same threshold semantics.
 */

interface Props {
  value: number
  max?: number
  warningThreshold?: number
  dangerThreshold?: number
  unit?: string
  label?: string
  showValue?: boolean
  height?: number
}
const props = withDefaults(defineProps<Props>(), {
  max: 100,
  warningThreshold: 0.8,
  dangerThreshold: 1,
  unit: '',
  showValue: true,
  height: 6,
})

const clamped = computed(() => Math.max(0, Math.min(props.value, props.max)))
const ratio = computed(() => (props.max > 0 ? clamped.value / props.max : 0))
const widthPct = computed(() => `${Math.round(ratio.value * 100)}%`)
const state = computed<'safe' | 'warning' | 'danger'>(() => {
  if (ratio.value >= props.dangerThreshold) return 'danger'
  if (ratio.value >= props.warningThreshold) return 'warning'
  return 'safe'
})
</script>

<template>
  <div class="progress-bar" :class="`progress-bar--${state}`">
    <div v-if="label || showValue" class="progress-bar__caption">
      <span v-if="label" class="progress-bar__label">{{ label }}</span>
      <span v-if="showValue" class="progress-bar__value">
        {{ value }}<template v-if="unit"> / {{ max }}{{ unit }}</template>
      </span>
    </div>
    <div class="progress-bar__track" :style="{ height: `${height}px` }">
      <div class="progress-bar__fill" :style="{ width: widthPct }" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.progress-bar {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  width: 100%;

  &__caption {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--space-3);
  }

  &__label {
    font-size: var(--fs-base-sm);
    color: var(--color-text-secondary);
  }

  &__value {
    font-size: var(--fs-base-sm);
    font-weight: var(--fw-bold);
    color: var(--color-text-primary);
  }

  &__track {
    width: 100%;
    background: rgba(14, 33, 56, 0.08);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  &__fill {
    height: 100%;
    border-radius: var(--radius-full);
    transition: width 0.4s ease, background 0.2s ease;
  }

  &--safe &__fill {
    background: var(--color-success);
  }
  &--warning &__fill {
    background: var(--color-warning);
  }
  &--danger &__fill {
    background: var(--color-danger);
  }
}
</style>
