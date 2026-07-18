<script setup lang="ts">
/**
 * LegendItem
 * Color swatch + label for the schedule legend.
 */
interface Props {
  color: string
  code: string
  label: string
}
defineProps<Props>()
</script>

<template>
  <li class="legend-item">
    <span class="legend-item__swatch" :style="{ background: color }" :aria-label="`Duty color for ${code}`" />
    <span class="legend-item__code">{{ code }}</span>
    <span class="legend-item__label">{{ label }}</span>
  </li>
</template>

<style scoped lang="scss">
.legend-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--fs-base-sm);
  color: var(--color-text-secondary);

  &__swatch {
    width: 12px;
    height: 12px;
    border-radius: var(--radius-sm);
    flex-shrink: 0;
    border: 1px solid rgba(14, 33, 56, 0.06);
  }

  &__code {
    font-weight: var(--fw-bold);
    color: var(--color-text-primary);
    letter-spacing: 0.02em;
  }

  &__label {
    color: var(--color-text-secondary);
  }
}
</style>
