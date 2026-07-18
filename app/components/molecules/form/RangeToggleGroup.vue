<script setup lang="ts">
/**
 * RangeToggleGroup
 * Segmented control for the 1w / 1m / 3m / 6m / 1y window selector on the
 * HoursToLimit section. Active option styled as a pill on top of a track.
 */
interface Option {
  value: string
  label: string
}
interface Props {
  modelValue: string
  options?: Option[]
}
const props = withDefaults(defineProps<Props>(), {
  options: () => [
    { value: '1w', label: '1W' },
    { value: '1m', label: '1M' },
    { value: '3m', label: '3M' },
    { value: '6m', label: '6M' },
    { value: '1y', label: '1Y' },
  ],
})
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

function select(value: string) {
  if (value !== props.modelValue) emit('update:modelValue', value)
}
</script>

<template>
  <div class="range-toggle-group" role="tablist" aria-label="Range">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      class="range-toggle-group__option"
      :class="{ 'range-toggle-group__option--active': opt.value === modelValue }"
      role="tab"
      :aria-selected="opt.value === modelValue ? 'true' : 'false'"
      @click="select(opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.range-toggle-group {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px;
  background: var(--color-surface-alt);
  border-radius: var(--radius-pill);
  width: 100%;

  &__option {
    flex: 1;
    padding: var(--space-2) var(--space-3);
    background: transparent;
    border: 0;
    border-radius: var(--radius-pill);
    color: var(--color-text-secondary);
    font-family: var(--font-sans);
    font-size: var(--fs-base-sm);
    font-weight: var(--fw-semibold);
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;

    &:hover:not(.range-toggle-group__option--active) {
      color: var(--color-text-primary);
    }

    &--active {
      background: var(--color-surface);
      color: var(--color-red);
      box-shadow: var(--shadow-xs);
    }

    &:focus-visible {
      outline: none;
      box-shadow: var(--shadow-focus);
    }
  }
}
</style>
