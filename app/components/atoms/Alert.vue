<script setup lang="ts">
/**
 * Alert
 * Inline dismissible message bar. Four variants map to standard severity
 * levels (info / success / warning / danger) with matching Lucide icons and
 * token-based color tints.
 *
 * Slot carries the body; `title` is optional. When `dismissible` is set, an
 * inline close button emits `dismiss`.
 */
interface Props {
  variant?: 'info' | 'success' | 'warning' | 'danger'
  title?: string
  dismissible?: boolean
}
withDefaults(defineProps<Props>(), { variant: 'info', dismissible: false })

const emit = defineEmits<{ (e: 'dismiss'): void }>()

// Per-variant icon name + scoped color overrides (kept here so the SCSS block
// stays declarative — variant logic in one place).
const ICON_BY_VARIANT: Record<NonNullable<Props['variant']>, string> = {
  info: 'info',
  success: 'check-circle',
  warning: 'alert-triangle',
  danger: 'alert-octagon',
}
</script>

<template>
  <div class="alert" :class="`alert--${variant}`" role="alert">
    <Icon :name="ICON_BY_VARIANT[variant]" :size="18" class="alert__icon" />
    <div class="alert__body">
      <p v-if="title" class="alert__title">{{ title }}</p>
      <div class="alert__content"><slot /></div>
    </div>
    <button
      v-if="dismissible"
      type="button"
      class="alert__close"
      aria-label="Dismiss"
      @click="emit('dismiss')"
    >
      <Icon name="x" :size="16" />
    </button>
  </div>
</template>

<style scoped lang="scss">
.alert {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  font-size: var(--fs-base);
  line-height: 1.4;

  &__icon {
    flex-shrink: 0;
    margin-top: 1px;
    color: currentColor;
  }

  &__body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__title {
    margin: 0;
    font-weight: var(--fw-bold);
    color: var(--color-text-primary);
  }

  &__content {
    color: var(--color-text-secondary);

    :deep(strong) {
      color: var(--color-text-primary);
      font-weight: var(--fw-semibold);
    }
  }

  &__close {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 0;
    border-radius: var(--radius-full);
    color: inherit;
    opacity: 0.7;
    cursor: pointer;
    transition: opacity 0.15s ease, background 0.15s ease;

    &:hover {
      opacity: 1;
      background: rgba(14, 33, 56, 0.06);
    }

    &:focus-visible {
      outline: none;
      box-shadow: var(--shadow-focus);
      opacity: 1;
    }
  }

  &--info {
    background: rgba(34, 197, 232, 0.08);
    border-color: rgba(34, 197, 232, 0.25);
    color: #0e7490;
  }

  &--success {
    background: rgba(31, 191, 143, 0.1);
    border-color: rgba(31, 191, 143, 0.25);
    color: #0e9472;
  }

  &--warning {
    background: rgba(245, 158, 11, 0.12);
    border-color: rgba(245, 158, 11, 0.3);
    color: #b8730a;
  }

  &--danger {
    background: rgba(230, 55, 87, 0.08);
    border-color: rgba(230, 55, 87, 0.25);
    color: var(--color-danger);
  }
}
</style>
