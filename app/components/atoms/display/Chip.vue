<script setup lang="ts">
/**
 * Chip
 * Small dismissable tag. Slot for content; emits `dismiss`.
 */
interface Props {
  dismissable?: boolean
  selected?: boolean
}
defineProps<Props>()
const emit = defineEmits<{ (e: 'dismiss'): void }>()
</script>

<template>
  <span class="chip" :class="{ 'chip--selected': selected }">
    <span class="chip__label"><slot /></span>
    <button
      v-if="dismissable"
      type="button"
      class="chip__dismiss"
      aria-label="Remove"
      @click="emit('dismiss')"
    >
      ×
    </button>
  </span>
</template>

<style scoped lang="scss">
.chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  color: var(--color-text-primary);
  font-size: var(--fs-base-sm);
  font-weight: var(--fw-medium);
  line-height: 1.4;

  &--selected {
    background: rgba(230, 55, 87, 0.08);
    border-color: var(--color-red);
    color: var(--color-red);
  }

  &__dismiss {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    padding: 0;
    background: transparent;
    border: 0;
    border-radius: 50%;
    color: var(--color-text-secondary);
    font-size: 14px;
    line-height: 1;
    cursor: pointer;

    &:hover {
      background: rgba(14, 33, 56, 0.08);
      color: var(--color-text-primary);
    }
  }
}
</style>
